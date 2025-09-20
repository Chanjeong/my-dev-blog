'use client';

import { useEffect, useRef } from 'react';
import 'highlight.js/styles/github.css';
import '@/styles/tiptap.css';

interface HtmlRendererProps {
  content: string;
}

export default function HtmlRenderer({ content }: HtmlRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // 링크를 새 탭에서 열기
      const links = contentRef.current.querySelectorAll('a');
      links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });
    }
  }, [content]);

  return <div ref={contentRef} className="max-w-none ProseMirror" dangerouslySetInnerHTML={{ __html: content }} />;
}
