/**
 * 마크다운 텍스트를 HTML로 변환하는 유틸리티
 * TiptapEditor에서 붙여넣기 시 마크다운을 HTML로 변환하는 데 사용
 */

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

export function markdownToHtml(markdown: string): string {
  let html = markdown;

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
}
