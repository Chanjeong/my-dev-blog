export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 메인 콘텐츠 */}
      <main className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">환영합니다</h2>
            <p className="text-lg text-muted-foreground">
              나의 개발 여정과 생각을 담은 공간입니다
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
