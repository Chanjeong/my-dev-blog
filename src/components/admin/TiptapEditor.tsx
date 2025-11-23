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
  const markdownToHtml = useCallback((markdown: string): string => {
    let html = markdown;

    // HTML 이스케이프 함수
    const escapeHtml = (text: string): string => {
      const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    };

    // 코드블록을 먼저 보호 (플레이스홀더로 교체)
    const codeBlocks: string[] = [];
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
      const placeholder = `__CODEBLOCK_${codeBlocks.length}__`;
      const escapedCode = escapeHtml(code);
      codeBlocks.push(`<pre><code>${escapedCode}</code></pre>`);
      return placeholder;
    });

    // 인라인 코드 보호
    const inlineCodes: string[] = [];
    html = html.replace(/`([^`\n]+)`/g, (match, code) => {
      const placeholder = `__INLINECODE_${inlineCodes.length}__`;
      inlineCodes.push(`<code>${code}</code>`);
      return placeholder;
    });

    // 테이블 처리 (|로 구분된 행) - 코드블록 플레이스홀더는 건너뛰기
    const tableLines = html.split('\n');
    const tableProcessedLines: string[] = [];
    let inTable = false;
    let tableRows: string[] = [];

    for (let i = 0; i < tableLines.length; i++) {
      const line = tableLines[i];
      const trimmedLine = line.trim();

      // 코드블록 플레이스홀더는 건너뛰기
      if (trimmedLine.includes('__CODEBLOCK_')) {
        if (inTable) {
          // 테이블 종료
          if (tableRows.length > 0) {
            const headerRow = tableRows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
            const bodyRows = tableRows.slice(1).join('');
            tableProcessedLines.push(`<table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`);
          }
          tableRows = [];
          inTable = false;
        }
        tableProcessedLines.push(line);
        continue;
      }

      // 테이블 행 확인 (|로 시작하고 끝나는 줄)
      const isTableRow = /^\|.+\|$/.test(trimmedLine);

      if (isTableRow) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }

        // 헤더 구분선 체크 (|---|---| 또는 |:---|)
        if (/^\|[\s\-:]+[\|\s\-:]*\|$/.test(trimmedLine)) {
          continue; // 헤더 구분선은 건너뛰기
        }

        // 셀 분리 (앞뒤 | 제거 후 |로 split)
        const cellContent = trimmedLine.slice(1, -1); // 앞뒤 | 제거
        const cells = cellContent.split('|').map(cell => cell.trim());
        const cellTags = cells.map(cell => `<td>${cell}</td>`).join('');
        tableRows.push(`<tr>${cellTags}</tr>`);
      } else {
        if (inTable) {
          // 테이블 종료
          if (tableRows.length > 0) {
            const headerRow = tableRows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
            const bodyRows = tableRows.slice(1).join('');
            tableProcessedLines.push(`<table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`);
          }
          tableRows = [];
          inTable = false;
        }
        tableProcessedLines.push(line);
      }
    }

    // 마지막에 테이블이 남아있으면
    if (inTable && tableRows.length > 0) {
      const headerRow = tableRows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
      const bodyRows = tableRows.slice(1).join('');
      tableProcessedLines.push(`<table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`);
    }

    html = tableProcessedLines.join('\n');

    // 헤딩 처리 (더 많은 #부터 처리)
    html = html.replace(/^###### (.*$)/gim, (match, content) => {
      if (content.includes('__CODEBLOCK_')) return match;
      return `<h6>${content}</h6>`;
    });
    html = html.replace(/^##### (.*$)/gim, (match, content) => {
      if (content.includes('__CODEBLOCK_')) return match;
      return `<h5>${content}</h5>`;
    });
    html = html.replace(/^#### (.*$)/gim, (match, content) => {
      if (content.includes('__CODEBLOCK_')) return match;
      return `<h4>${content}</h4>`;
    });
    html = html.replace(/^### (.*$)/gim, (match, content) => {
      if (content.includes('__CODEBLOCK_')) return match;
      return `<h3>${content}</h3>`;
    });
    html = html.replace(/^## (.*$)/gim, (match, content) => {
      if (content.includes('__CODEBLOCK_')) return match;
      return `<h2>${content}</h2>`;
    });
    html = html.replace(/^# (.*$)/gim, (match, content) => {
      if (content.includes('__CODEBLOCK_')) return match;
      return `<h1>${content}</h1>`;
    });

    // 리스트 처리 (줄 단위로) - 코드블록 플레이스홀더는 건너뛰기
    const lines = html.split('\n');
    const processedLines: string[] = [];
    let inList = false;
    let listItems: string[] = [];
    let inBlockquote = false;
    let blockquoteItems: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 리스트 항목 확인 (-, *, +, 번호) - 앞뒤 공백 제거 후 확인
      const trimmedLine = line.trim();

      // 코드블록 플레이스홀더는 건너뛰기
      if (trimmedLine.includes('__CODEBLOCK_')) {
        // blockquote 종료
        if (inBlockquote) {
          processedLines.push(`<blockquote>${blockquoteItems.join('\n')}</blockquote>`);
          blockquoteItems = [];
          inBlockquote = false;
        }
        // 리스트 종료
        if (inList) {
          processedLines.push(`<ul>${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        processedLines.push(line);
        continue;
      }

      // Horizontal rule 처리 (---, ***, ___)
      if (/^[-*_]{3,}$/.test(trimmedLine)) {
        // blockquote 종료
        if (inBlockquote) {
          processedLines.push(`<blockquote>${blockquoteItems.join('\n')}</blockquote>`);
          blockquoteItems = [];
          inBlockquote = false;
        }
        // 리스트 종료
        if (inList) {
          processedLines.push(`<ul>${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        processedLines.push('<hr />');
        continue;
      }

      // Blockquote 처리 (>)
      const blockquoteMatch = trimmedLine.match(/^>\s?(.*)$/);
      if (blockquoteMatch) {
        // 리스트 종료
        if (inList) {
          processedLines.push(`<ul>${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        if (!inBlockquote) {
          inBlockquote = true;
          blockquoteItems = [];
        }
        // blockquote 내용이 있으면 추가, 없으면 빈 줄로 처리
        const content = blockquoteMatch[1].trim();
        if (content) {
          blockquoteItems.push(`<p>${content}</p>`);
        } else {
          blockquoteItems.push('<p></p>'); // 빈 줄도 유지
        }
        continue;
      } else {
        // blockquote 종료 (빈 줄이 아닌 다른 내용이 나올 때만)
        if (inBlockquote) {
          if (trimmedLine === '') {
            // 빈 줄은 blockquote 내부에서도 허용하되, 연속된 빈 줄은 하나만 유지
            const lastItem = blockquoteItems[blockquoteItems.length - 1];
            if (lastItem !== '<p></p>') {
              blockquoteItems.push('<p></p>');
            }
            continue;
          } else {
            // 다른 내용이 나오면 blockquote 종료
            // blockquote 내부의 앞뒤 빈 p 태그 제거
            let cleanedItems = blockquoteItems.filter(item => item.trim() !== '<p></p>');
            if (cleanedItems.length > 0 && cleanedItems[0].trim() === '<p></p>') {
              cleanedItems = cleanedItems.slice(1);
            }
            if (cleanedItems.length > 0 && cleanedItems[cleanedItems.length - 1].trim() === '<p></p>') {
              cleanedItems = cleanedItems.slice(0, -1);
            }
            if (cleanedItems.length > 0) {
              processedLines.push(`<blockquote>${cleanedItems.join('')}</blockquote>`);
            }
            blockquoteItems = [];
            inBlockquote = false;
          }
        }
      }

      const listMatch = trimmedLine.match(/^([-*+]|\d+\.)\s(.+)$/);

      if (listMatch) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(`<li>${listMatch[2]}</li>`);
      } else {
        // 리스트가 끝남
        if (inList) {
          processedLines.push(`<ul>${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }

        // 빈 줄
        if (trimmedLine === '') {
          processedLines.push('');
        } else {
          // 이미 HTML 태그가 있으면 그대로
          if (trimmedLine.match(/^<[h1-6]|^<pre|^<ul|^<ol|^<table|^<blockquote|^<hr/)) {
            processedLines.push(trimmedLine);
          } else {
            processedLines.push(`<p>${trimmedLine}</p>`);
          }
        }
      }
    }

    // 마지막에 리스트가 남아있으면 추가
    if (inList && listItems.length > 0) {
      processedLines.push(`<ul>${listItems.join('')}</ul>`);
    }

    // 마지막에 blockquote가 남아있으면 추가
    if (inBlockquote && blockquoteItems.length > 0) {
      let cleanedItems = blockquoteItems.filter(item => item.trim() !== '<p></p>');
      if (cleanedItems.length > 0 && cleanedItems[0].trim() === '<p></p>') {
        cleanedItems = cleanedItems.slice(1);
      }
      if (cleanedItems.length > 0 && cleanedItems[cleanedItems.length - 1].trim() === '<p></p>') {
        cleanedItems = cleanedItems.slice(0, -1);
      }
      if (cleanedItems.length > 0) {
        processedLines.push(`<blockquote>${cleanedItems.join('')}</blockquote>`);
      }
    }

    html = processedLines.join('\n');

    // 볼드 (**text**)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // 이탤릭 (*text*) - 볼드가 아닌 경우만
    html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');

    // 링크 ([text](url))
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // 이미지 (![alt](url))
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // 코드블록 복원
    codeBlocks.forEach((codeBlock, index) => {
      html = html.replace(`__CODEBLOCK_${index}__`, codeBlock);
    });

    // 인라인 코드 복원
    inlineCodes.forEach((inlineCode, index) => {
      html = html.replace(`__INLINECODE_${index}__`, inlineCode);
    });

    return html;
  }, []);

  // 코드인지 판단하는 함수
  const isCodeLike = useCallback((text: string): boolean => {
    // 너무 짧으면 코드 아님
    if (text.length < 10) return false;

    // 마크다운 문법이 있으면 코드가 아님
    if (/^#{1,6}\s/m.test(text)) {
      return false;
    }
    if (
      /```/.test(text) ||
      /^[\s]*[-*+]\s/m.test(text) ||
      /^[\s]*\d+\.\s/m.test(text) ||
      /!\[.*?\]\(.*?\)/.test(text) ||
      /\[.*?\]\(.*?\)/.test(text) ||
      /\*\*.*?\*\*/.test(text) ||
      /\*.*?\*/.test(text) ||
      /`.*?`/.test(text) ||
      /^>\s?/.test(text) ||
      /^[-*_]{3,}$/.test(text)
    ) {
      return false;
    }

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
        const hasMarkdownSyntax =
          /^#{1,6}\s/m.test(text) ||
          /```/.test(text) ||
          /^[\s]*[-*+]\s/m.test(text) ||
          /^[\s]*\d+\.\s/m.test(text) ||
          /!\[.*?\]\(.*?\)/.test(text) ||
          /\[.*?\]\(.*?\)/.test(text) ||
          /\*\*.*?\*\*/.test(text) ||
          /\*.*?\*/.test(text) ||
          /`.*?`/.test(text) ||
          /^>\s?/.test(text) ||
          /^[-*_]{3,}$/.test(text);

        if (hasMarkdownSyntax) {
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
  }, [editor, markdownToHtml, isCodeLike, handleImageUpload]);

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
