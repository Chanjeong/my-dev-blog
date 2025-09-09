// 포스트 에디터 관련 타입 정의

export interface PostFormData {
  title: string;
  content: string;
  tags: string;
  published: boolean;
  tagInput: string;
}

export interface PostEditorProps {
  initialData?: {
    id?: string;
    title?: string;
    content?: string;
    tags?: string;
    published?: boolean;
  };
}

export type PostFormAction =
  | { type: 'SET_FIELD'; field: keyof PostFormData; value: string | boolean }
  | { type: 'ADD_TAG'; tag: string }
  | { type: 'REMOVE_TAG'; tag: string }
  | { type: 'RESET_FORM' };

export const initialPostFormState: PostFormData = {
  title: '',
  content: '',
  tags: '',
  published: false,
  tagInput: ''
};

