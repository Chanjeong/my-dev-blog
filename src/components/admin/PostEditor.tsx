'use client';

import { useEffect, useState, useRef } from 'react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { savePostAction } from '@/app/admin/dashboard/write/actions';
import { usePostForm } from '@/hooks/usePostForm';
import { Post, PostFormState } from '@/types/post-editor';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import MDEditor from '@uiw/react-md-editor';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type PostEditorProps = {
  initialData?: Pick<Post, 'id'> & Partial<Pick<Post, 'title' | 'content' | 'published'>>;
};

export default function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [state, formAction, isPending] = useActionState<PostFormState, FormData>(savePostAction, {
    success: false,
    error: null,
  });
  const { formData, dispatch } = usePostForm({
    title: initialData?.title || '',
    content: initialData?.content || '',
    published: initialData?.published || false,
  });

  // 커서 위치 추적을 위한 ref
  const editorRef = useRef<any>(null);

  // 커서 위치에 텍스트 삽입하는 함수
  const insertTextAtCursor = (text: string) => {
    const editor = editorRef.current;
    if (editor?.textarea) {
      const textarea = editor.textarea;
      const cursorPos = textarea.selectionStart || 0;
      const currentContent = formData.content;

      const newContent = currentContent.slice(0, cursorPos) + text + currentContent.slice(cursorPos);

      dispatch({
        type: 'SET_FIELD',
        field: 'content',
        value: newContent,
      });

      // 커서 위치를 삽입된 텍스트 뒤로 이동
      setTimeout(() => {
        const newCursorPos = cursorPos + text.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }, 0);
    }
  };

  // 이미지 업로드 함수
  const uploadImage = async (file: File): Promise<string> => {
    try {
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('파일 크기는 5MB를 초과할 수 없습니다.');
      }

      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        throw new Error('이미지 파일만 업로드할 수 있습니다.');
      }

      // 고유한 파일명 생성
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const fileName = `blog-${timestamp}-${randomString}.${fileExtension}`;
      const filePath = `posts/${fileName}`;

      // Supabase Storage에 업로드
      const { error } = await supabase.storage.from('blog-images').upload(filePath, file, {
        cacheControl: '3600',
      });

      if (error) {
        throw new Error(`업로드 실패: ${error.message}`);
      }

      // 공개 URL 생성
      const {
        data: { publicUrl },
      } = supabase.storage.from('blog-images').getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      throw error;
    }
  };

  // MDEditor 커스텀 툴바
  const customCommands = [
    {
      name: 'upload-image',
      keyCommand: 'upload-image',
      buttonProps: { 'aria-label': '이미지 업로드', title: '이미지 업로드' },
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
          />
        </svg>
      ),
      execute: async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async e => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            try {
              const imageUrl = await uploadImage(file);
              const imageMarkdown = `![${file.name}](${imageUrl})`;
              insertTextAtCursor(imageMarkdown);
            } catch {
              toast.error('이미지 업로드에 실패했습니다.');
            }
          }
        };
        input.click();
      },
    },
  ];

  // 액션 상태가 변경될 때 처리
  useEffect(() => {
    if (state.success) {
      toast.success('포스트가 성공적으로 저장되었습니다!');
      router.push('/admin/dashboard');
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  // 마운트 상태 설정
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {initialData?.id ? '포스트 수정' : '새 포스트 작성'}
            </h1>
            <p className="text-muted-foreground">
              {initialData?.id ? '포스트를 수정하고 저장하세요.' : '새로운 포스트를 작성하고 저장하세요.'}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form action={formAction} className="space-y-6">
                {/* 숨겨진 필드들 */}
                {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

                {/* 제목 입력 */}
                <div className="space-y-2">
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'title', value: e.target.value })}
                    placeholder="포스트 제목을 입력하세요"
                    className="text-lg"
                    required
                  />
                </div>

                {/* 내용 입력 */}
                <div className="space-y-2">
                  <Label htmlFor="content">내용</Label>
                  <div className="border rounded-md overflow-hidden">
                    <MDEditor
                      ref={editorRef}
                      value={formData.content}
                      onChange={value => dispatch({ type: 'SET_FIELD', field: 'content', value: value || '' })}
                      data-color-mode={theme === 'dark' ? 'dark' : 'light'}
                      height={500}
                      visibleDragbar={false}
                      textareaProps={{
                        placeholder: '포스트 내용을 작성하세요...',
                        style: {
                          fontSize: '14px',
                          lineHeight: '1.6',
                        },
                      }}
                      commands={customCommands}
                    />
                  </div>
                </div>

                {/* 발행 상태 */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'published', value: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="published">즉시 발행</Label>
                </div>

                {/* 액션 상태 표시 */}
                {state.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}

                {/* 버튼들 */}
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !formData.title.trim() || !formData.content.trim()}
                    className="min-w-[120px]"
                  >
                    {isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>저장 중...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>저장</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
