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
import { PostFormState } from '@/types/post-editor';
import { Post } from '@/types/post-editor';

export type PostEditorProps = {
  initialData?: Pick<Post, 'id'> & Partial<Pick<Post, 'title' | 'content' | 'published'>>;
};
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import MDEditor from '@uiw/react-md-editor';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRef } from 'react';

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
    } else {
      // 폴백: 맨 끝에 추가
      dispatch({
        type: 'SET_FIELD',
        field: 'content',
        value: formData.content + text,
      });
    }
  };

  // 이미지 압축 함수
  const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          blob => resolve(blob ? new File([blob], file.name, { type: 'image/jpeg' }) : file),
          'image/jpeg',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // 이미지 업로드 함수
  const uploadImage = async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드할 수 있습니다.');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
    }

    // 5MB 이상이면 압축
    const fileToUpload = file.size > 5 * 1024 * 1024 ? await compressImage(file) : file;

    const fileExt = fileToUpload.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;

    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, fileToUpload, { cacheControl: '3600' });

    if (error) {
      if (error.message.includes('Bucket not found')) {
        throw new Error('이미지 저장소가 설정되지 않았습니다.');
      } else if (error.message.includes('Row Level Security')) {
        throw new Error('이미지 업로드 권한이 없습니다.');
      }
      throw new Error(`업로드 실패: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('blog-images').getPublicUrl(filePath);

    return publicUrl;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state.success) {
      alert(formData.published ? '포스트가 발행되었습니다!' : '포스트가 임시저장되었습니다!');

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
              <h1 className="text-3xl font-bold">{initialData?.id ? '포스트 수정' : '새 포스트 작성'}</h1>
            </div>
          </div>

          <form action={formAction} className="space-y-6">
            {/* 숨겨진 필드들 */}
            <input type="hidden" name="postId" value={initialData?.id || ''} />
            <input type="hidden" name="published" value={formData.published.toString()} />

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
                        value: e.target.value,
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
                      ref={editorRef}
                      value={formData.content}
                      onChange={value => {
                        dispatch({
                          type: 'SET_FIELD',
                          field: 'content',
                          value: value || '',
                        });
                      }}
                      data-color-mode={mounted && theme === 'dark' ? 'dark' : 'light'}
                      height={600}
                      visibleDragbar={false}
                      onPaste={async event => {
                        const items = event.clipboardData?.items;
                        if (!items) return;

                        for (const item of items) {
                          if (item.type.startsWith('image/')) {
                            event.preventDefault();
                            const file = item.getAsFile();
                            if (!file) continue;

                            const loadingToast = toast.loading('이미지를 업로드하는 중...', { duration: 0 });

                            try {
                              const imageUrl = await uploadImage(file);
                              insertTextAtCursor(`![이미지](${imageUrl})\n\n`);
                              toast.dismiss(loadingToast);
                              toast.success('이미지가 업로드되었습니다!');
                            } catch (error) {
                              toast.dismiss(loadingToast);
                              toast.error(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
                            }
                            break;
                          }
                        }
                      }}
                    />
                  </div>
                  <input type="hidden" name="content" value={formData.content} />
                </div>
              </CardContent>
            </Card>

            {/* 액션 버튼들 */}
            <div className="flex gap-4 justify-end">
              {/* 임시저장 버튼 */}
              <Button
                type="submit"
                variant="outline"
                disabled={isPending || !formData.title.trim() || !formData.content?.trim()}
                onClick={e => {
                  e.preventDefault();
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'published',
                    value: false,
                  });
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) {
                      const hiddenInput = form.querySelector('input[name="published"]') as HTMLInputElement;
                      if (hiddenInput) hiddenInput.value = 'false';
                      form.requestSubmit();
                    }
                  }, 100);
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                {isPending ? '저장 중...' : '임시저장'}
              </Button>

              {/* 발행하기 버튼 */}
              <Button
                type="submit"
                disabled={isPending || !formData.title.trim() || !formData.content?.trim()}
                onClick={e => {
                  e.preventDefault();
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'published',
                    value: true,
                  });
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) {
                      const hiddenInput = form.querySelector('input[name="published"]') as HTMLInputElement;
                      if (hiddenInput) hiddenInput.value = 'true';
                      form.requestSubmit();
                    }
                  }, 100);
                }}
              >
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
