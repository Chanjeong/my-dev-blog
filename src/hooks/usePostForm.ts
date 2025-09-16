import { useReducer } from 'react';
import { PostFormData, PostFormAction, initialPostFormState } from '@/types/post-editor';

function postFormReducer(state: PostFormData, action: PostFormAction): PostFormData {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'RESET_FORM':
      return initialPostFormState;

    default:
      return state;
  }
}

export function usePostForm(initialData?: Partial<PostFormData>) {
  const [formData, dispatch] = useReducer(postFormReducer, {
    ...initialPostFormState,
    ...initialData,
  });

  return {
    formData,
    dispatch,
  };
}
