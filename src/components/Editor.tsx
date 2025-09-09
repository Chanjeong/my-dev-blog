'use client';

import '@blocknote/core/fonts/inter.css';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

interface EditorProps {
  initialContent?: any; // BlockNote의 복잡한 타입 시스템으로 인해 any 사용
  onChange?: (editor: { document: any[] }) => void;
  isDark?: boolean;
}

export default function Editor({
  initialContent,
  onChange,
  isDark = false
}: EditorProps) {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: initialContent || undefined
  });

  // 에디터 내용 변경 감지
  if (onChange && editor) {
    editor.onEditorContentChange = () => {
      onChange(editor);
    };
  }

  return (
    <BlockNoteView
      editor={editor}
      style={{
        height: '100%',
        minHeight: '500px',
        width: '100%'
      }}
      theme={isDark ? 'dark' : 'light'}
    />
  );
}
