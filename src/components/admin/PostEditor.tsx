'use client';

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { savePostAction } from '@/app/admin/dashboard/write/actions';
import { usePostForm } from '@/hooks/usePostForm';
import { PostEditorProps, PostFormState } from '@/types/post-editor';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import MDEditor from '@uiw/react-md-editor';

export default function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [state, formAction, isPending] = useActionState<
    PostFormState,
    FormData
  >(savePostAction, { success: false, error: null });
  const { formData, dispatch } = usePostForm({
    title: initialData?.title || '',
    content: initialData?.content || '',
    published: initialData?.published || false
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state.success) {
      alert(
        formData.published
          ? '포스트가 발행되었습니다!'
          : '포스트가 임시저장되었습니다!'
      );

      router.push('/admin/dashboard');
    }
  }, [state.success, formData.published, router]);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {initialData?.id ? '포스트 수정' : '새 포스트 작성'}
              </h1>
            </div>
          </div>

          <form action={formAction} className="space-y-6">
            {/* 숨겨진 필드들 */}
            <input type="hidden" name="postId" value={initialData?.id || ''} />
            <input
              type="hidden"
              name="published"
              value={formData.published.toString()}
            />

            {/* 제목 */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={e =>
                      dispatch({
                        type: 'SET_FIELD',
                        field: 'title',
                        value: e.target.value
                      })
                    }
                    placeholder="포스트 제목을 입력하세요"
                    className="text-2xl font-bold border-none shadow-none focus-visible:ring-0"
                    required
                    disabled={isPending}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label>내용 *</Label>
                  <div className="min-h-[600px]">
                    <MDEditor
                      value={formData.content}
                      onChange={value => {
                        dispatch({
                          type: 'SET_FIELD',
                          field: 'content',
                          value: value || ''
                        });
                      }}
                      data-color-mode={
                        mounted && theme === 'dark' ? 'dark' : 'light'
                      }
                      height={600}
                      visibleDragbar={false}
                    />
                  </div>
                  <input
                    type="hidden"
                    name="content"
                    value={formData.content}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 액션 버튼들 */}
            <div className="flex gap-4 justify-end">
              {/* 임시저장 버튼 */}
              <Button
                type="submit"
                variant="outline"
                disabled={
                  isPending ||
                  !formData.title.trim() ||
                  !formData.content?.trim()
                }
                onClick={e => {
                  e.preventDefault();
                  // 임시저장으로 설정
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'published',
                    value: false
                  });
                  // 폼 제출
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) {
                      const hiddenInput = form.querySelector(
                        'input[name="published"]'
                      ) as HTMLInputElement;
                      if (hiddenInput) {
                        hiddenInput.value = 'false';
                      }
                      form.requestSubmit();
                    }
                  }, 100);
                }}>
                <Save className="h-4 w-4 mr-2" />
                {isPending ? '저장 중...' : '임시저장'}
              </Button>

              {/* 발행하기 버튼 */}
              <Button
                type="submit"
                disabled={
                  isPending ||
                  !formData.title.trim() ||
                  !formData.content?.trim()
                }
                onClick={e => {
                  e.preventDefault();
                  // 발행으로 설정
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'published',
                    value: true
                  });
                  // 폼 제출
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) {
                      const hiddenInput = form.querySelector(
                        'input[name="published"]'
                      ) as HTMLInputElement;
                      if (hiddenInput) {
                        hiddenInput.value = 'true';
                      }
                      form.requestSubmit();
                    }
                  }, 100);
                }}>
                <Save className="h-4 w-4 mr-2" />
                {isPending ? '발행 중...' : '발행하기'}
              </Button>
            </div>

            {/* 에러 메시지 */}
            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
