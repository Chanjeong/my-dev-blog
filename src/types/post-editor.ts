export interface PostFormData {
  title: string;
  content: string;
  published: boolean;
}

export interface PostEditorProps {
  initialData?: {
    id?: string;
    title?: string;
    content?: string;
    published?: boolean;
  };
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
