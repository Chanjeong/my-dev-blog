import CardContainer from '@/components/CardContainers';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-24 px-6">
        <div className="max-w-6xl mx-auto">
          <CardContainer />
        </div>
      </main>
    </div>
  );
}
