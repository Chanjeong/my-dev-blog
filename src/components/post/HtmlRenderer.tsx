'use client';

import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import '@/styles/tiptap.css';

// 필요한 언어들 import
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';

interface HtmlRendererProps {
  content: string;
}

export default function HtmlRenderer({ content }: HtmlRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const links = contentRef.current.querySelectorAll('a');
      links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });

      // 코드 블록 하이라이팅 - 이미 처리된 것은 스킵
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach(block => {
        const codeElement = block as HTMLElement;

        // 이미 Prism이 처리했으면 (span.token이 있으면) 스킵
        if (codeElement.querySelector('.token')) {
          return;
        }

        const preElement = codeElement.parentElement as HTMLElement;
        const currentClass = codeElement.className;

        // 언어 감지 - language-none이나 빈 경우만 처리
        if (
          currentClass.includes('language-none') ||
          currentClass === 'language-' ||
          !currentClass.includes('language-')
        ) {
          // 코드 내용으로 언어 추측
          const code = codeElement.textContent || '';
          let detectedLang = 'javascript'; // 기본값

          // Python 감지
          if (/\b(def|import|from|class|print|if __name__|elif)\b/.test(code)) {
            detectedLang = 'python';
          }
          // TypeScript 감지
          else if (/\b(interface|type|enum)\b/.test(code) || /:\s*(string|number|boolean)/.test(code)) {
            detectedLang = 'typescript';
          }

          codeElement.className = `language-${detectedLang}`;
          if (preElement) {
            preElement.className = `language-${detectedLang}`;
          }
        }

        // Prism 하이라이팅 실행
        try {
          Prism.highlightElement(codeElement);
        } catch (e) {
          console.warn('Prism highlighting failed:', e);
        }
      });
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="max-w-none ProseMirror"
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning={true}
    />
  );
}
