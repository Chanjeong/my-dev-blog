'use client';

import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import '@/styles/tiptap.css';

// 필요한 언어들 import
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';

interface HtmlRendererProps {
  content: string;
}

function detectLanguage(code: string): string {
  // Python 감지 (Python 고유 패턴)
  if (
    /\bdef\s+\w+\s*\(/.test(code) ||
    /\bfrom\s+\w+\s+import\b/.test(code) ||
    /\bprint\s*\(/.test(code) ||
    /\belif\b/.test(code) ||
    /if\s+__name__\s*==/.test(code)
  ) {
    return 'python';
  }

  // HTML 감지
  if (/<\/?(?:div|span|html|head|body|p|a|img|ul|ol|li|table|form|input)\b/.test(code)) {
    return 'markup';
  }

  // CSS 감지
  if (/[.#][\w-]+\s*\{/.test(code) || /@(?:media|keyframes|import)\b/.test(code)) {
    return 'css';
  }

  // JSON 감지
  if (/^\s*[\[{]/.test(code) && /["'][\w]+["']\s*:/.test(code)) {
    return 'json';
  }

  // Bash 감지
  if (/^(?:#!\/bin\/(?:ba)?sh|(?:\$|>)\s)/.test(code) || /\b(?:echo|sudo|apt|npm|yarn|cd|ls|mkdir|chmod)\b/.test(code)) {
    return 'bash';
  }

  // SQL 감지
  if (/\b(?:SELECT|INSERT|UPDATE|DELETE|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b/i.test(code)) {
    return 'sql';
  }

  // TypeScript 감지
  if (/\b(?:interface|type|enum)\b/.test(code) || /:\s*(?:string|number|boolean)/.test(code)) {
    return 'typescript';
  }

  // Java 감지
  if (/\bpublic\s+(?:static\s+)?(?:void|class|int|String)\b/.test(code)) {
    return 'java';
  }

  // Go 감지
  if (/\bfunc\s+\w+\s*\(/.test(code) || /\bpackage\s+\w+/.test(code)) {
    return 'go';
  }

  // Rust 감지
  if (/\bfn\s+\w+\s*\(/.test(code) || /\blet\s+mut\b/.test(code) || /\bimpl\s+\w+/.test(code)) {
    return 'rust';
  }

  return 'javascript';
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
          const code = codeElement.textContent || '';
          const detectedLang = detectLanguage(code);

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
