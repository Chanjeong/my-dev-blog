'use client';

import { useState, type ComponentType } from 'react';
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
  onImageUpload?: (file: File) => void;
}

interface ToolbarButtonProps {
  editor: Editor;
  icon: ComponentType<{ className?: string }>;
  title: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function ToolbarButton({ icon: Icon, title, isActive, disabled, onClick }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={isActive ? 'default' : 'ghost'}
      size="sm"
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export default function TiptapToolbar({ editor, onImageUpload }: TiptapToolbarProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  if (!editor) return null;

  const handleLinkClick = () => {
    const { from, to } = editor.state.selection;
    const selected = editor.state.doc.textBetween(from, to);
    setSelectedText(selected);
    setIsLinkDialogOpen(true);
  };

  const handleInsertLink = (url: string, text?: string) => {
    if (text) {
      // Tiptap API를 사용하여 안전하게 링크 삽입 (XSS 방지)
      const { from } = editor.state.selection;
      editor.chain().focus().insertContent(text).run();
      const to = from + text.length;
      editor.chain().setTextSelection({ from, to }).setLink({ href: url }).run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  // velog 방식의 서식 적용 함수
  const handleFormatWithText = (formatFn: () => void, placeholder: string) => {
    const { from, to } = editor.state.selection;
    const selected = editor.state.doc.textBetween(from, to);

    if (!selected.trim()) {
      editor.chain().focus().insertContent(placeholder).run();
      const newFrom = from;
      const newTo = from + placeholder.length;
      editor.chain().setTextSelection({ from: newFrom, to: newTo }).run();
    }

    formatFn();
  };

  const headingButtons = [
    { icon: Heading1, level: 1 as const, title: '제목 1' },
    { icon: Heading2, level: 2 as const, title: '제목 2' },
    { icon: Heading3, level: 3 as const, title: '제목 3' },
    { icon: Heading4, level: 4 as const, title: '제목 4' },
  ];

  const formatButtons = [
    { icon: Bold, mark: 'bold' as const, title: '굵게', format: () => editor.chain().focus().toggleBold().run(), placeholder: '텍스트' },
    { icon: Italic, mark: 'italic' as const, title: '기울임', format: () => editor.chain().focus().toggleItalic().run(), placeholder: '텍스트' },
    { icon: Strikethrough, mark: 'strike' as const, title: '취소선', format: () => editor.chain().focus().toggleStrike().run(), placeholder: '텍스트' },
    { icon: Code, mark: 'code' as const, title: '인라인 코드', format: () => editor.chain().focus().toggleCode().run(), placeholder: '코드' },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1">
      {/* 실행취소/재실행 */}
      <div className="flex border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <ToolbarButton
          editor={editor}
          icon={Undo}
          title="실행취소"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        />
        <ToolbarButton
          editor={editor}
          icon={Redo}
          title="재실행"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        />
      </div>

      {/* 제목 */}
      <div className="flex border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        {headingButtons.map(({ icon, level, title }) => (
          <ToolbarButton
            key={level}
            editor={editor}
            icon={icon}
            title={title}
            isActive={editor.isActive('heading', { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          />
        ))}
      </div>

      {/* 텍스트 서식 */}
      <div className="flex border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        {formatButtons.map(({ icon, mark, title, format, placeholder }) => (
          <ToolbarButton
            key={mark}
            editor={editor}
            icon={icon}
            title={title}
            isActive={editor.isActive(mark)}
            onClick={() => handleFormatWithText(format, placeholder)}
          />
        ))}
      </div>

      {/* 목록 */}
      <div className="flex border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <ToolbarButton
          editor={editor}
          icon={List}
          title="불릿 목록"
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          editor={editor}
          icon={ListOrdered}
          title="번호 목록"
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
      </div>

      {/* 인용문 */}
      <div className="flex border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <ToolbarButton
          editor={editor}
          icon={Quote}
          title="인용문"
          isActive={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
      </div>

      {/* 링크 */}
      <div className="flex border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <ToolbarButton
          editor={editor}
          icon={Link}
          title="링크 삽입"
          isActive={editor.isActive('link')}
          onClick={handleLinkClick}
        />
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
            input.onchange = ev => {
              const file = (ev.target as HTMLInputElement).files?.[0];
              if (file && onImageUpload) {
                onImageUpload(file);
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
