'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfileName() {
  const [show, setShow] = useState(false);

  return (
    <h1 className="text-3xl font-bold mb-6 mt-20 relative">
      <Link
        href="/me"
        className="underline"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        박찬정
      </Link>
      <div
        className={`absolute left-0 top-full mt-2 z-50 transition-all duration-200 pointer-events-none ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <Image
          src="/박찬정.jpg"
          alt="박찬정"
          width={160}
          height={160}
          className="rounded-lg shadow-lg object-cover"
        />
      </div>
    </h1>
  );
}
