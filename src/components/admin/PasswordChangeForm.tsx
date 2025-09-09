'use client';

import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { changePasswordAction } from '@/app/admin/dashboard/settings/actions';
import { LoginState } from '@/types/admin';

export default function PasswordChangeForm() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    changePasswordAction,
    { success: false, error: null }
  );

  useEffect(() => {
    if (state.success) {
      alert('비밀번호가 성공적으로 변경되었습니다.');
      window.location.reload();
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">현재 비밀번호</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          placeholder="현재 비밀번호를 입력하세요"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">새 비밀번호</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="새 비밀번호를 입력하세요"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="새 비밀번호를 다시 입력하세요"
          required
          disabled={isPending}
        />
      </div>

      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? '변경 중...' : '비밀번호 변경'}
      </Button>
    </form>
  );
}
