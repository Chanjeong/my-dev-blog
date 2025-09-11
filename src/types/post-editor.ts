export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PostListItem = Omit<Post, 'content'>;

export type PostFormData = Pick<Post, 'title' | 'content' | 'published'>;

export type PostEditorInitialData = Pick<Post, 'id'> & Partial<PostFormData>;

export interface PostEditorProps {
  initialData?: PostEditorInitialData;
}

export interface PostListProps {
  posts: PostListItem[];
}

export type PostFormAction =
  | { type: 'SET_FIELD'; field: keyof PostFormData; value: string | boolean }
  | { type: 'RESET_FORM' };

export const initialPostFormState: PostFormData = {
  title: '',
  content: '',
  published: false
};
export interface PostFormState {
  success: boolean;
  error: string | null;
  postId?: string;
}
