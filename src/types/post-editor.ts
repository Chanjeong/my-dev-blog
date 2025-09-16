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

// 포스트 목록용 (content 제외)
export type PostList = Omit<Post, 'content'>;

// 썸네일 추출용 (content 포함하지만 최소한만)
export type PostWithThumbnail = Pick<Post, 'id' | 'title' | 'slug' | 'content' | 'createdAt' | 'updatedAt'>;

// 포스트 폼 데이터
export type PostForm = Pick<Post, 'title' | 'content' | 'published'>;

// 포스트 에디터 초기 데이터
export type PostEditorData = Pick<Post, 'id'> & Partial<PostForm>;

// 포스트 에디터 Props
export interface PostEditorProps {
  initialData?: PostEditorData;
}

// 폼 액션
export type PostFormAction =
  | { type: 'SET_FIELD'; field: keyof PostForm; value: string | boolean }
  | { type: 'RESET_FORM' };

// 폼 상태
export interface PostFormState {
  success: boolean;
  error: string | null;
  postId?: string;
}

// 초기 폼 상태
export const initialPostForm: PostForm = {
  title: '',
  content: '',
  published: false,
};
