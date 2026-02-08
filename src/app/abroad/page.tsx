import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '해외생활 | 박찬정',
};

const photos = [
  { src: '/해외생활1.jpg', label: '호주에서 먹은 음식' },
  { src: '/해외생활2.jpg', label: '베트남 호이안 시장' },
  { src: '/해외생활3.jpg', label: '베트남 다낭 시내 풍경' },
  { src: '/해외생활4.jpg', label: '대학생활 수강' },
  { src: '/해외생활5.jpg', label: '컴퓨터공학과 수업' },
  { src: '/해외생활6.jpg', label: '컴퓨터공학 수업 2' },
  { src: '/해외생활7.jpg', label: '컴퓨터공학과 실습' },
  { src: '/해외생활8.jpg', label: '학교 홈페이지 접속' },
  { src: '/해외생활9.jpg', label: '컴퓨터공학과 수업 3' },
  { src: '/해외생활10.jpg', label: '베트남 생활 시작' },
  { src: '/해외생활11.jpg', label: '해외에서 축구 코치 알바' },
  { src: '/해외생활12.jpg', label: '색다른 분위기의 베트남 백화점' },
  { src: '/해외생활13.jpg', label: '베트남 분교 정문 앞' },
  { src: '/해외생활14.jpg', label: '달랏 저녁 풍경' },
];

export default function AbroadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12 mt-10">
          <h1 className="text-3xl font-bold">해외생활</h1>
          <p className="text-muted-foreground mt-2">혼자 해외에서 살아보며 담아둔 순간들입니다.</p>
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
