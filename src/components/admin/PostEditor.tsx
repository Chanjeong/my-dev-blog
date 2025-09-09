'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Save } from 'lucide-react';
import { Editor } from '@/components/DynamicEditor';
import { savePostAction } from '@/app/admin/dashboard/write/actions';
import { usePostForm } from '@/hooks/usePostForm';
import { PostEditorProps, PostFormState } from '@/types/post-editor';

export default function PostEditor({ initialData }: PostEditorProps) {
  const [state, formAction, isPending] = useActionState<
    PostFormState,
    FormData
  >(savePostAction, { success: false, error: null });

  const { formData, dispatch, tagArray, removeTag, handleTagInput } =
    usePostForm({
      title: initialData?.title || '',
      content: initialData?.content || '',
      tags: initialData?.tags || '',
      published: initialData?.published || false
    });

  // ThemeProvider에서 다크모드 상태 가져오기
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 에디터 내용 변경 핸들러
  const handleEditorChange = (editor: { document: any[] }) => {
    const blocks = editor.document;
    dispatch({
      type: 'SET_FIELD',
      field: 'content',
      value: JSON.stringify(blocks)
    });
  };

  // 성공 시 처리
  useEffect(() => {
    if (state.success) {
      alert(
        formData.published
          ? '포스트가 발행되었습니다!'
          : '포스트가 임시저장되었습니다!'
      );
    }
  }, [state.success, formData.published]);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {initialData?.id ? '포스트 수정' : '새 포스트 작성'}
              </h1>
              <p className="text-muted-foreground">
                Notion 스타일로 포스트를 작성하세요
              </p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 메인 에디터 영역 */}
              <div className="lg:col-span-2 space-y-6">
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

                {/* 내용 에디터 - Notion 스타일 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Label>내용 *</Label>
                      <div className="min-h-[500px] border rounded-md">
                        <Editor
                          initialContent={
                            formData.content
                              ? JSON.parse(formData.content)
                              : undefined
                          }
                          onChange={handleEditorChange}
                          isDark={isDark}
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
              </div>

              {/* 사이드바 */}
              <div className="space-y-6">
                {/* 발행 설정 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">발행 설정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="published">발행하기</Label>
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={checked =>
                          dispatch({
                            type: 'SET_FIELD',
                            field: 'published',
                            value: checked
                          })
                        }
                        disabled={isPending}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formData.published
                        ? '포스트가 발행됩니다'
                        : '임시저장됩니다'}
                    </p>
                  </CardContent>
                </Card>

                {/* 태그 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">태그</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        value={formData.tagInput}
                        onChange={e => handleTagInput(e.target.value)}
                        placeholder="태그를 입력하고 쉼표(,)로 구분하세요"
                        disabled={isPending}
                      />
                    </div>

                    {tagArray.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">추가된 태그:</p>
                        <div className="flex flex-wrap gap-2">
                          {tagArray.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1">
                              {tag}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => removeTag(tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <input type="hidden" name="tags" value={formData.tags} />
                  </CardContent>
                </Card>

                {/* 액션 버튼들 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={
                          isPending ||
                          !formData.title.trim() ||
                          !formData.content.trim()
                        }>
                        <Save className="h-4 w-4 mr-2" />
                        {isPending
                          ? '저장 중...'
                          : formData.published
                          ? '발행하기'
                          : '임시저장'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
