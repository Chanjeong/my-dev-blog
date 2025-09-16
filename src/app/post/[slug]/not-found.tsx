import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <FileX className="h-16 w-16 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">포스트를 찾을 수 없습니다</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">요청하신 포스트가 존재하지 않거나 삭제되었습니다.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
