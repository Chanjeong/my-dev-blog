/**
 * 텍스트가 코드인지 또는 마크다운인지 감지하는 유틸리티
 * TiptapEditor에서 붙여넣기 시 콘텐츠 타입을 판단하는 데 사용
 */

/**
 * 텍스트에 마크다운 문법이 포함되어 있는지 확인
 */
export function hasMarkdownSyntax(text: string): boolean {
  return (
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
    /^[-*_]{3,}$/.test(text)
  );
}

/**
 * 텍스트가 코드처럼 보이는지 판단 (점수 기반)
 */
export function isCodeLike(text: string): boolean {
  // 너무 짧으면 코드 아님
  if (text.length < 10) return false;

  // 마크다운 문법이 있으면 코드가 아님
  if (hasMarkdownSyntax(text)) return false;

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
}
