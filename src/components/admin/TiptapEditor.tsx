'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Code from '@tiptap/extension-code';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { createLowlight, common } from 'lowlight';
import 'highlight.js/styles/github.css';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';
import { useEffect, useState, useCallback } from 'react';
import TiptapToolbar from './TiptapToolbar';
import '@/styles/tiptap.css';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

// lowlight 인스턴스 생성 (컴포넌트 외부에서 한 번만)
const lowlight = createLowlight(common);

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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // CodeBlockLowlight로 대체
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
      CodeBlockLowlight.configure({
        lowlight, // 재사용 가능한 인스턴스
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
        return false;
      },
    },
  });

  // 이미지 업로드 처리
  const handleImageUpload = useCallback(
    async (file: File) => {
      const loadingToast = toast.loading('이미지를 업로드하는 중...', { duration: 0 });

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

        toast.dismiss(loadingToast);
        toast.success('이미지가 업로드되었습니다!');
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
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
