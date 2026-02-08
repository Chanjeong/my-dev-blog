'use client';

import { supabase } from '@/lib/supabase';

export interface ImageUploadResult {
  url: string;
  fileName: string;
}

export const useImageUpload = () => {
  // 이미지 압축 함수 (내부 함수)
  const compressImage = (file: File): Promise<File> => {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const maxWidth = 1200;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          blob => resolve(blob ? new File([blob], file.name, { type: 'image/jpeg' }) : file),
          'image/jpeg',
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // 이미지 업로드 함수
  const uploadImage = async (file: File): Promise<ImageUploadResult> => {
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드할 수 있습니다.');
    }

    // 파일 크기 검증 (10MB)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
    }

    // 5MB 이상이면 압축
    const compressThresholdBytes = 5 * 1024 * 1024;
    const fileToUpload = file.size > compressThresholdBytes ? await compressImage(file) : file;

    // 파일명 생성
    const fileExt = fileToUpload.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;

    // Supabase Storage에 업로드
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

    // 공개 URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from('blog-images').getPublicUrl(filePath);

    return {
      url: publicUrl,
      fileName,
    };
  };

  return {
    uploadImage,
  };
};
