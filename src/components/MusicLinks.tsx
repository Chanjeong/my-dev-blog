'use client';

import { useState } from 'react';
import MusicPlayer from './MusicPlayer';

const balladTracks = [
  {
    title: '희재',
    artist: '성시경',
    src: '/HeeJae (희재).mp3',
    cover: '/성시경 - 희재.jpg',
  },
  {
    title: '무제 (Untitled, 2014)',
    artist: 'G-Dragon',
    src: '/G-Dragon - 무제(無題) (Untitled, 2014) [MP3 Audio] [권지용 (KWON JI YONG) Mini Album].mp3',
    cover: '/지드래곤 - 무제.jpg',
  },
  {
    title: '이 별',
    artist: '길구봉구',
    src: '/길구봉구 - 이 별 [가사Lyrics].mp3',
    cover: '/길구봉구 - 이 별.jpg',
  },
];

const popTracks = [
  {
    title: 'Myself',
    artist: 'Post Malone',
    src: '/Post Malone - Myself (Audio).mp3',
    cover: '/Post Malone - Myself.jpeg',
  },
  {
    title: 'Out of Time',
    artist: 'The Weeknd',
    src: '/The Weeknd - Out of Time (Audio).mp3',
    cover: '/The Weekend - out of time.webp',
  },
  {
    title: 'All The Stars',
    artist: 'Kendrick Lamar, SZA',
    src: '/Kendrick Lamar, SZA - All The Stars.mp3',
    cover: '/Kendrick Lamar - All the Stars.jpeg',
  },
];

export function BalladLink() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="underline cursor-pointer">
        발라드
      </button>
      <MusicPlayer tracks={balladTracks} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function PopLink() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="underline cursor-pointer">
        팝음악
      </button>
      <MusicPlayer tracks={popTracks} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
