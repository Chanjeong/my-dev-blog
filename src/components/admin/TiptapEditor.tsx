'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useEffect, useState, useCallback } from 'react';
import TiptapToolbar from './TiptapToolbar';
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

  // 클라이언트 사이드에서만 마운트
  useEffect(() => {
    setMounted(true);
  }, []);

  // 코드인지 판단하는 함수 - 더 엄격한 조건
  const isCodeLike = useCallback((text: string): boolean => {
    // 너무 짧으면 코드 아님
    if (text.length < 10) return false;

    let score = 0;

    // JavaScript 키워드
    if (/\b(const|let|var|function|class|import|export|return|async|await|if|else|for|while)\b/.test(text)) {
      score += 3;
    }

    // 들여쓰기가 있는 여러 줄
    if (/^\s{2,}/m.test(text)) {
      score += 2;
    }

    // 괄호와 세미콜론 조합
    if (/[{}\[\]();]/.test(text) && /;/.test(text)) {
      score += 2;
    }

    // JavaScript 연산자
    if (/=>|===|!==|\+\+|--/.test(text)) {
      score += 2;
    }

    // 여러 줄
    if ((text.match(/\n/g) || []).length >= 2) {
      score += 1;
    }

    // 점수가 5 이상이면 코드로 판단
    return score >= 5;
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // CodeBlock으로 대체
        code: false, // Code extension으로 대체
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
    ],
    content,
    immediatelyRender: false, // SSR hydration 문제 해결
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
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        // 이미지 처리
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              handleImageUpload(file);
              return true;
            }
          }
        }

        // 텍스트 처리 - 코드인지 확인
        const text = event.clipboardData?.getData('text/plain');
        if (text && isCodeLike(text)) {
          event.preventDefault();
          // view.state.tr을 사용하여 현재 에디터 상태에 안전하게 접근
          const { state } = view;
          const { tr } = state;
          const codeBlock = state.schema.nodes.codeBlock;

          if (codeBlock) {
            const node = codeBlock.create(null, state.schema.text(text));
            const transaction = tr.replaceSelectionWith(node);
            view.dispatch(transaction);
          }
          return true;
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

  // SSR 문제 해결: 클라이언트에서만 렌더링
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
