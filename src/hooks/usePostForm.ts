import { useReducer } from 'react';
import { Post, PostFormAction, initialPostForm } from '@/types/post-editor';

type PostFormData = Pick<Post, 'title' | 'content' | 'published'>;

function postFormReducer(state: PostFormData, action: PostFormAction): PostFormData {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'RESET_FORM':
      return initialPostForm;

    default:
      return state;
  }
}

export function usePostForm(initialData?: Partial<PostFormData>) {
  const [formData, dispatch] = useReducer(postFormReducer, {
    ...initialPostForm,
    ...initialData,
  });

  return {
    formData,
    dispatch,
  };
}
