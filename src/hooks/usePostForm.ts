import { useReducer } from 'react';
import {
  PostFormData,
  PostFormAction,
  initialPostFormState
} from '@/types/post-editor';

// 리듀서 함수
function postFormReducer(
  state: PostFormData,
  action: PostFormAction
): PostFormData {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'ADD_TAG':
      const currentTags = state.tags
        ? state.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
        : [];
      if (action.tag.trim() && !currentTags.includes(action.tag.trim())) {
        const newTags = [...currentTags, action.tag.trim()];
        return { ...state, tags: newTags.join(', '), tagInput: '' };
      }
      return state;

    case 'REMOVE_TAG':
      const tagsArray = state.tags
        ? state.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
        : [];
      const filteredTags = tagsArray.filter(tag => tag !== action.tag);
      return { ...state, tags: filteredTags.join(', ') };

    case 'RESET_FORM':
      return initialPostFormState;

    default:
      return state;
  }
}

// 커스텀 훅
export function usePostForm(initialData?: Partial<PostFormData>) {
  // content가 문자열이면 JSON으로 변환
  const processedInitialData = initialData
    ? {
        ...initialData,
        content:
          typeof initialData.content === 'string' &&
          initialData.content.startsWith('[')
            ? initialData.content
            : JSON.stringify([
                {
                  type: 'paragraph',
                  content: initialData.content
                    ? [{ type: 'text', text: initialData.content }]
                    : []
                }
              ])
      }
    : undefined;

  const [formData, dispatch] = useReducer(postFormReducer, {
    ...initialPostFormState,
    ...processedInitialData
  });

  // 태그 배열로 변환
  const tagArray = formData.tags
    ? formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)
    : [];

  // 태그 추가 (쉼표로 구분)
  const addTag = (tag: string) => {
    if (tag.trim()) {
      dispatch({ type: 'ADD_TAG', tag: tag.trim() });
    }
  };

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    dispatch({ type: 'REMOVE_TAG', tag: tagToRemove });
  };

  // 태그 입력 처리 (쉼표로 자동 분리)
  const handleTagInput = (value: string) => {
    // 쉼표가 포함되어 있으면 자동으로 태그 추가
    if (value.includes(',')) {
      const tags = value
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
      tags.forEach(tag => addTag(tag));
      dispatch({ type: 'SET_FIELD', field: 'tagInput', value: '' });
    } else {
      dispatch({ type: 'SET_FIELD', field: 'tagInput', value });
    }
  };

  return {
    formData,
    dispatch,
    tagArray,
    addTag,
    removeTag,
    handleTagInput
  };
}
