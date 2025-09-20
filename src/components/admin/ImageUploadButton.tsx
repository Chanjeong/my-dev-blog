'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';

interface ImageUploadButtonProps {
  onImageUpload: (url: string, fileName: string) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export default function ImageUploadButton({
  onImageUpload,
  className = '',
  variant = 'outline',
  size = 'default',
}: ImageUploadButtonProps) {
  const { uploadImage } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 파일 선택 핸들러
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    await handleImageUpload(file);
  };

  // 이미지 업로드 처리
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const loadingToast = toast.loading('이미지를 업로드하는 중...', { duration: 0 });

    try {
      const result = await uploadImage(file);
      onImageUpload(result.url, result.fileName);

      toast.dismiss(loadingToast);
      toast.success('이미지가 업로드되었습니다!');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 클릭 핸들러
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  return (
    <div className="relative">
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={e => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* 업로드 버튼 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative ${isDragOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        <Button
          onClick={handleClick}
          disabled={isUploading}
          variant={variant}
          size={size}
          className={`${className} ${isDragOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              업로드 중...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              이미지 업로드
            </>
          )}
        </Button>

        {/* 드래그 오버 표시 */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-500 rounded-md flex items-center justify-center">
            <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              <ImageIcon className="h-6 w-6 mx-auto mb-1" />
              이미지를 여기에 놓으세요
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
