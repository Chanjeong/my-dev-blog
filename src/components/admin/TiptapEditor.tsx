'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useEffect, useState, useCallback } from 'react';
import { markdownToHtml } from '@/lib/markdownToHtml';
import { isCodeLike, hasMarkdownSyntax } from '@/lib/codeDetection';
import TiptapToolbar from './TiptapToolbar';
import { DOMParser as ProseMirrorDOMParser, Slice } from '@tiptap/pm/model';
import '@/styles/tiptap.css';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = '내용을 입력하세요...',
  className = '',
}: TiptapEditorProps) {
  const { uploadImage } = useImageUpload();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        code: false,
      }),
      Code.configure({
        HTMLAttributes: {
          class: 'inline-code',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'language-',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border border-gray-300',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 bg-gray-100 font-bold p-2',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `focus:outline-none ${className}`,
        placeholder,
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  // 이미지 업로드 처리
  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        const result = await uploadImage(file);

        if (editor) {
          editor
            .chain()
            .focus()
            .setImage({
              src: result.url,
              alt: result.fileName,
            })
            .run();
        }

        alert('이미지가 업로드되었습니다!');
      } catch (error) {
        alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
      }
    },
    [uploadImage, editor]
  );

  // 에디터 DOM에 직접 붙여넣기 이벤트 리스너 추가
  useEffect(() => {
    if (!editor) return;

    const handlePasteEvent = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      const items = clipboardData.items;
      if (!items) return;

      // 이미지 처리
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          event.preventDefault();
          event.stopPropagation();
          const file = item.getAsFile();
          if (file) {
            handleImageUpload(file);
            return;
          }
        }
      }

      // HTML 데이터 확인
      const htmlData = clipboardData.getData('text/html');
      const hasHtml = htmlData && htmlData.trim().length > 0;

      if (hasHtml) {
        event.preventDefault();
        event.stopPropagation();
        try {
          const { state, dispatch } = editor.view;
          const { schema } = state;

          const dom = new window.DOMParser().parseFromString(htmlData, 'text/html');
          const parser = ProseMirrorDOMParser.fromSchema(schema);
          const fragment = parser.parse(dom.body);

          const slice = new Slice(fragment.content, 0, 0);
          const tr = state.tr.replaceSelection(slice);
          dispatch(tr);
          return;
        } catch {
          // 에러 발생 시 기본 동작 사용
          return;
        }
      }

      // 텍스트 데이터 확인
      const text = clipboardData.getData('text/plain');
      if (text && text.trim().length > 0) {
        if (hasMarkdownSyntax(text)) {
          event.preventDefault();
          event.stopPropagation();
          try {
            const htmlFromMarkdown = markdownToHtml(text);
            const { state, dispatch } = editor.view;
            const { schema } = state;

            const dom = new window.DOMParser().parseFromString(htmlFromMarkdown, 'text/html');
            const parser = ProseMirrorDOMParser.fromSchema(schema);
            const fragment = parser.parse(dom.body);

            const slice = new Slice(fragment.content, 0, 0);
            const tr = state.tr.replaceSelection(slice);
            dispatch(tr);
          } catch {
            // 에러 발생 시 기본 동작 사용
          }
          return;
        }

        // 코드처럼 보이면 코드블록으로 변환
        if (isCodeLike(text)) {
          event.preventDefault();
          event.stopPropagation();
          const { state } = editor.view;
          const { tr } = state;
          const codeBlock = state.schema.nodes.codeBlock;

          if (codeBlock) {
            const node = codeBlock.create(null, state.schema.text(text));
            const transaction = tr.replaceSelectionWith(node);
            editor.view.dispatch(transaction);
          }
          return;
        }
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('paste', handlePasteEvent, true); // capture phase에서 실행

    return () => {
      editorElement.removeEventListener('paste', handlePasteEvent, true);
    };
  }, [editor, handleImageUpload]);

  // 이미지 업로드 이벤트 리스너
  useEffect(() => {
    const handleImageUploadEvent = (event: CustomEvent) => {
      const file = event.detail.file;
      if (file) {
        handleImageUpload(file);
      }
    };

    window.addEventListener('imageUpload', handleImageUploadEvent as EventListener);
    return () => {
      window.removeEventListener('imageUpload', handleImageUploadEvent as EventListener);
    };
  }, [handleImageUpload]);

  if (!mounted || !editor) {
    return (
      <div className="min-h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">에디터를 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TiptapToolbar editor={editor} />
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
