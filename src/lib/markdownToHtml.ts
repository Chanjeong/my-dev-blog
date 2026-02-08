/**
 * 마크다운 텍스트를 HTML로 변환하는 유틸리티
 * TiptapEditor에서 붙여넣기 시 마크다운을 HTML로 변환하는 데 사용
 */

import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function markdownToHtml(markdown: string): string {
  const result = marked.parse(markdown);
  if (typeof result === 'string') {
    return result;
  }
  return '';
}
