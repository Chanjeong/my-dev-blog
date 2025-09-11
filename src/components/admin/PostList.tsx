'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Edit,
  Trash2,
  Calendar,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { deletePostAction } from '@/app/admin/dashboard/write/actions';
import { PostListProps } from '@/types/post-editor';

export default function PostList({ posts }: PostListProps) {
  const [localPosts, setLocalPosts] = useState(posts);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 포스트 삭제 핸들러
  const handleDelete = async (postId: string) => {
    if (!confirm('정말로 이 포스트를 삭제하시겠습니까?')) return;

    setDeletingId(postId);
    try {
      const result = await deletePostAction(postId);
      if (result.success) {
        setLocalPosts(prev => prev.filter(post => post.id !== postId));
      } else {
        alert('삭제 중 오류가 발생했습니다: ' + result.error);
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (localPosts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">아직 작성된 포스트가 없습니다.</p>
            <p className="text-sm">새 포스트를 작성해보세요!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {localPosts.map(post => {
        return (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg truncate">
                      {post.title}
                    </CardTitle>
                    {post.published ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        발행됨
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        임시저장
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/admin/dashboard/write/${post.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      수정
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deletingId === post.id ? '삭제 중...' : '삭제'}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
