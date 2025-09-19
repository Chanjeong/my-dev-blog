'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Image from 'next/image';
import 'highlight.js/styles/github.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          img: ({ src, alt }) => {
            return (
              <Image
                src={String(src)}
                alt={String(alt)}
                width={800}
                height={400}
                className="w-full max-w-full h-auto my-4"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
                unoptimized
              />
            );
          },
          pre: ({ children, ...props }) => (
            <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto" {...props}>
              {children}
            </pre>
          ),
          code: ({ children, ...props }) => (
            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
