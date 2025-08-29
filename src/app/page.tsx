export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8 ">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 ">
          안녕하세요, 다크모드 테스트입니다.
        </h1>

        <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary mb-6">
          <h2 className="text-xl font-semibold mb-4">새로운 색상 시스템</h2>

          <p className="text-text-secondary mb-4">
            이제 dark: 클래스를 일일이 지정하지 않아도 됩니다.
          </p>

          <div className="space-y-2">
            <div className="p-3 bg-primary text-primary-foreground rounded">
              Primary 색상
            </div>

            <div className="p-3 bg-secondary text-secondary-foreground rounded">
              Secondary 색상
            </div>

            <div className="p-3 bg-tertiary text-tertiary-foreground rounded">
              Tertiary 색상
            </div>

            <div className="p-3 bg-accent text-accent-foreground rounded">
              Accent 색상
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
