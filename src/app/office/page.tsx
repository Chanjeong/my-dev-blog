import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '사무실 전경 | 어센드미디어',
};

const photos = [
  { src: '/사무실전경/1. 로비.jpg', label: '로비' },
  { src: '/사무실전경/2. 멀티룸.jpg', label: '멀티룸' },
  { src: '/사무실전경/3. 라운지.jpg', label: '라운지' },
  { src: '/사무실전경/4. 북카페.jpg', label: '북카페' },
  { src: '/사무실전경/5. 스낵바.jpg', label: '스낵바' },
  { src: '/사무실전경/6. 폰부스.jpg', label: '폰부스' },
  { src: '/사무실전경/7. 업무공간.jpg', label: '업무공간' },
  { src: '/사무실전경/8. 회의실1.jpg', label: '회의실 1' },
  { src: '/사무실전경/9. 회의실2.jpg', label: '회의실 2' },
  { src: '/사무실전경/10. 회의실3.jpg', label: '회의실 3' },
  { src: '/사무실전경/11. 수면실.jpg', label: '수면실' },
];

export default function OfficePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12 mt-10">
          <h1 className="text-3xl font-bold">어센드미디어</h1>
          <p className="text-muted-foreground mt-2">제가 일하고 있는 공간입니다.</p>
        </div>

        <div className="columns-1 sm:columns-2 gap-4 space-y-4">
          {photos.map(({ src, label }) => (
            <div key={src} className="break-inside-avoid group">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={src}
                  alt={label}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                  <span className="text-white text-sm font-medium px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
