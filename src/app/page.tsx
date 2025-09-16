import CardContainer from '@/components/CardContainers';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-12 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 간단한 메시지 */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">개인적인 공간</h3>
                <p className="text-muted-foreground">
                  이 블로그는 제 개인적인 학습과 성장의 기록을 담은 공간입니다.
                  <br />
                  개발 관련 질문이나 피드백이 있으시면 언제든 연락주세요!
                </p>
              </div>
            </CardContent>
          </Card>
          <CardContainer />
        </div>
      </main>
    </div>
  );
}
