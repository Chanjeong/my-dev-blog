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

  // 코드 펜스(```)가 있으면 마크다운이므로 코드 감지 스킵
  if (/```/.test(text)) return false;

  let score = 0;

  // JavaScript/TypeScript 키워드
  if (/\b(const|let|var|function|class|import|export|return|async|await|if|else|for|while|switch|case|break|continue|try|catch|throw|new|this|typeof|instanceof)\b/.test(text)) {
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

  // 중괄호만 있어도 점수 부여 (Python, Go 등 세미콜론 없는 언어)
  if (/\{[\s\S]*\}/.test(text) && !(/;/.test(text))) {
    score += 1;
  }

  // JavaScript 연산자
  if (/=>|===|!==|\+\+|--/.test(text)) {
    score += 2;
  }

  // 화살표 함수 패턴
  if (/\)\s*=>\s*[{(]/.test(text) || /=>\s*\{/.test(text)) {
    score += 2;
  }

  // JSX/TSX 패턴
  if (/<[A-Z]\w+[\s/>]/.test(text) || /className=/.test(text) || /onClick=/.test(text)) {
    score += 2;
  }

  // Python 패턴
  if (/\bdef\s+\w+\s*\(/.test(text) || /\bself\./.test(text) || /\belif\b/.test(text) || /\bfrom\s+\w+\s+import\b/.test(text)) {
    score += 3;
  }

  // TypeScript 패턴
  if (/\b(interface|type|enum)\b/.test(text) || /:\s*(string|number|boolean|void)\b/.test(text)) {
    score += 2;
  }

  // 여러 줄
  if ((text.match(/\n/g) || []).length >= 2) {
    score += 1;
  }

  // 점수가 4 이상이면 코드로 판단
  return score >= 4;
}
