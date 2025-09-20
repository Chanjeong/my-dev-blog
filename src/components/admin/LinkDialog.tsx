'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertLink: (url: string, text?: string) => void;
  selectedText?: string;
}

export default function LinkDialog({ isOpen, onClose, onInsertLink, selectedText }: LinkDialogProps) {
  const [url, setUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);

  // URL 유효성 검사
  useEffect(() => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    setIsValidUrl(urlPattern.test(url) || url === '');
  }, [url]);

  // 다이얼로그가 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setLinkText(selectedText || '');
    }
  }, [isOpen, selectedText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidUrl && url.trim()) {
      const finalUrl = url.startsWith('http') ? url : `https://${url}`;
      onInsertLink(finalUrl, linkText.trim() || finalUrl);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>링크 삽입</DialogTitle>
          <DialogDescription>링크할 URL과 표시할 텍스트를 입력하세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className={!isValidUrl && url ? 'border-red-500' : ''}
              autoFocus
            />
            {!isValidUrl && url && <p className="text-sm text-red-500">올바른 URL 형식을 입력해주세요.</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="text">링크 텍스트 (선택사항)</Label>
            <Input
              id="text"
              placeholder="표시할 텍스트"
              value={linkText}
              onChange={e => setLinkText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <p className="text-xs text-gray-500">비워두면 URL이 그대로 표시됩니다.</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={!isValidUrl || !url.trim()}>
              링크 삽입
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
