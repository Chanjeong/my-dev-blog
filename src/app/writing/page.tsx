import PostList from '@/components/post/PostList';

export default function WritingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-6 py-16 mt-20">
        <PostList limit={0} />
      </main>
    </div>
  );
}
