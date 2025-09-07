// Rate limiting utility for admin login attempts
const attempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
} {
  const now = Date.now();
  const userAttempts = attempts.get(ip);

  if (userAttempts) {
    // 5분이 지났으면 카운트 리셋
    if (now - userAttempts.lastAttempt >= 300000) {
      // 5분 = 300,000ms
      attempts.set(ip, { count: 1, lastAttempt: now });
      return { allowed: true, remainingAttempts: 4 };
    }

    // 5분 내 5번 이상 시도하면 차단
    if (userAttempts.count >= 5) {
      return { allowed: false, remainingAttempts: 0 };
    }

    // 카운트 증가
    attempts.set(ip, { count: userAttempts.count + 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: 5 - userAttempts.count - 1 };
  } else {
    // 첫 시도
    attempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: 4 };
  }
}

export function resetRateLimit(ip: string): void {
  attempts.delete(ip);
}
