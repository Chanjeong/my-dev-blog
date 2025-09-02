'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'React 18의 새로운 기능들',
    description:
      'React 18에서 도입된 Concurrent Features와 Suspense에 대해 알아보세요.',
    image: '/next.svg', // 실제 이미지 경로로 변경하세요
    date: '2024-01-15',
    category: 'React'
  },
  {
    id: 2,
    title: 'TypeScript와 함께하는 안전한 개발',
    description:
      'TypeScript를 활용하여 더 안전하고 유지보수하기 쉬운 코드를 작성하는 방법을 소개합니다.',
    image: '/vercel.svg', // 실제 이미지 경로로 변경하세요
    date: '2024-01-10',
    category: 'TypeScript'
  },
  {
    id: 3,
    title: 'Next.js 14 App Router 완벽 가이드',
    description:
      'Next.js 14의 새로운 App Router를 활용한 현대적인 웹 애플리케이션 개발 방법을 알아보세요.',
    image: '/window.svg', // 실제 이미지 경로로 변경하세요
    date: '2024-01-05',
    category: 'Next.js'
  },
  {
    id: 4,
    title: 'Tailwind CSS로 만드는 반응형 디자인',
    description:
      'Tailwind CSS의 유틸리티 클래스를 활용하여 아름답고 반응형인 웹 디자인을 만드는 방법을 소개합니다.',
    image: '/globe.svg', // 실제 이미지 경로로 변경하세요
    date: '2024-01-01',
    category: 'CSS'
  }
];

export default function CardContainer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogPosts.map(post => (
        <Card
          key={post.id}
          className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105">
          <div className="relative h-48 overflow-hidden rounded-t-xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute top-3 left-3">
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                {post.category}
              </span>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </CardTitle>
            <CardDescription className="line-clamp-3">
              {post.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{post.date}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
