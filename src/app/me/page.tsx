import { getActiveFiles } from '@/app/admin/dashboard/files/actions';

export default async function MePage() {
  const result = await getActiveFiles();
  const fileUrls = result.success ? result.data : { resume: null, portfolio: null };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-6 py-16 mt-20">
        <ul className="space-y-2 list-disc list-inside">
          {fileUrls!.portfolio && (
            <li>
              <a href={fileUrls!.portfolio} target="_blank" rel="noopener noreferrer" className="underline">
                Portfolio
              </a>
            </li>
          )}
          {fileUrls!.resume && (
            <li>
              <a href={fileUrls!.resume} target="_blank" rel="noopener noreferrer" className="underline">
                About
              </a>
            </li>
          )}
          <li>
            <a
              href="https://velog.io/@jeongchanpark/posts"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              이전 블로그
            </a>
          </li>
        </ul>
      </main>
    </div>
  );
}
