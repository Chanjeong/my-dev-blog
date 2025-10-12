'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Trash2, ArrowLeft } from 'lucide-react';
import { getFileUploads, deleteFile, uploadFile } from '@/app/admin/dashboard/files/actions';
import { FileUpload } from '@/types/file';

export default function FileManagementClient() {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<'resume' | 'portfolio'>('resume');

  // 파일 목록 가져오기
  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const result = await getFileUploads();
      if (result.success && result.data) {
        setFiles(result.data);
      } else {
        alert(`목록 조회 실패: ${result.error || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`목록 조회 오류: ${error.message}`);
      } else {
        alert('네트워크 오류: 서버에 연결할 수 없습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 파일 업로드
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (file.type !== 'application/pdf') {
      alert(`잘못된 파일 형식: ${file.type}. PDF 파일만 업로드 가능합니다.`);
      return;
    }

    // 파일 크기 검증 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      alert(`파일 크기 초과: ${fileSizeMB}MB. 최대 10MB까지 업로드 가능합니다.`);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', selectedFileType);
      formData.append('uploadedBy', 'admin');

      const result = await uploadFile(formData);
      if (result.success) {
        alert(result.message);
        event.target.value = '';
        fetchFiles(); // 파일 목록 새로고침
        // Navigation 컴포넌트에 파일 업데이트 알림
        window.dispatchEvent(new CustomEvent('fileUpdated'));
      } else {
        alert(`업로드 실패: ${result.error || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`업로드 오류: ${error.message}`);
      } else {
        alert('네트워크 오류: 서버에 연결할 수 없습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 파일 삭제
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('정말로 이 파일을 삭제하시겠습니까?')) return;

    try {
      const result = await deleteFile(fileId);
      if (result.success) {
        alert('파일이 성공적으로 삭제되었습니다.');
        fetchFiles();
        // Navigation 컴포넌트에 파일 업데이트 알림
        window.dispatchEvent(new CustomEvent('fileUpdated'));
      } else {
        alert(`삭제 실패: ${result.error || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`삭제 오류: ${error.message}`);
      } else {
        alert('네트워크 오류: 서버에 연결할 수 없습니다.');
      }
    }
  };

  // 파일 타입 한글 변환
  const getFileTypeLabel = (fileType: string) => {
    return fileType === 'resume' ? '이력서' : '포트폴리오';
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="p-4">
        <div className="max-w-xl mx-auto space-y-4">
          {/* 헤더 */}
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">파일 관리</h1>
          </div>

          {/* 파일 업로드 */}
          <div className="space-y-3 p-3 border rounded">
            <div className="flex gap-2">
              <Button
                variant={selectedFileType === 'resume' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFileType('resume')}
              >
                이력서
              </Button>
              <Button
                variant={selectedFileType === 'portfolio' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFileType('portfolio')}
              >
                포트폴리오
              </Button>
            </div>

            <Input type="file" accept=".pdf" onChange={handleFileUpload} disabled={isLoading} className="text-sm" />
            {isLoading && <p className="text-xs text-muted-foreground">처리 중...</p>}
          </div>

          {/* 파일 목록 */}
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">파일이 없습니다</div>
            ) : (
              files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-2 border rounded text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{file.originalName}</span>
                    <span className="text-xs text-muted-foreground">({getFileTypeLabel(file.fileType)})</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFile(file.id)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
