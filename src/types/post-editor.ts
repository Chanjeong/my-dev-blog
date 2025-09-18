// 기본 Post 타입 (데이터베이스용)
export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 폼 액션
export type PostFormAction =
  | { type: 'SET_FIELD'; field: keyof Pick<Post, 'title' | 'content' | 'published'>; value: string | boolean }
  | { type: 'RESET_FORM' };

// 폼 상태
export interface PostFormState {
  success: boolean;
  error: string | null;
  postId?: string;
}

// 초기 폼 상태
export const initialPostForm = {
  title: '',
  content: '',
  published: false,
} as const;
