'use client';

import { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  Link,
  Upload,
  List,
  ListOrdered,
  Undo,
  Redo,
} from 'lucide-react';
import LinkDialog from './LinkDialog';

interface TiptapToolbarProps {
  editor: Editor | null;
}

export default function TiptapToolbar({ editor }: TiptapToolbarProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  if (!editor) return null;

  const handleLinkClick = () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    setSelectedText(selectedText);
    setIsLinkDialogOpen(true);
  };

  const handleInsertLink = (url: string, text?: string) => {
    if (text) {
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1">
      {/* 실행취소/재실행 */}
      <div className="flex border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          disabled={!editor.can().chain().focus().undo().run()}
          title="실행취소"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          disabled={!editor.can().chain().focus().redo().run()}
          title="재실행"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* 제목 */}
      <div className="flex border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          title="제목 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          title="제목 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          title="제목 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 4 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 4 }).run();
          }}
          title="제목 4"
        >
          <Heading4 className="h-4 w-4" />
        </Button>
      </div>

      {/* 텍스트 서식 */}
      <div className="flex border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          title="굵게"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          title="기울임"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('strike') ? 'default' : 'ghost'}
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          title="취소선"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('code') ? 'default' : 'ghost'}
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleCode().run();
          }}
          title="인라인 코드"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      {/* 목록 */}
      <div className="flex border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          title="불릿 목록"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          title="번호 목록"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* 인용문 */}
      <div className="flex border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <Button
          type="button"
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          size="sm"
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          title="인용문"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      {/* 링크 */}
      <div className="flex border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <Button
          type="button"
          variant={editor.isActive('link') ? 'default' : 'ghost'}
          size="sm"
          onClick={e => {
            e.preventDefault();
            handleLinkClick();
          }}
          title="링크 삽입"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>

      {/* 이미지 업로드 */}
      <div className="flex">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={e => {
            e.preventDefault();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = e => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                const event = new CustomEvent('imageUpload', { detail: { file } });
                window.dispatchEvent(event);
              }
            };
            input.click();
          }}
          title="이미지 업로드"
          aria-label="이미지 업로드"
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>

      {/* 링크 다이얼로그 */}
      <LinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onInsertLink={handleInsertLink}
        selectedText={selectedText}
      />
    </div>
  );
}
