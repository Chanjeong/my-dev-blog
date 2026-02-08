'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  src: string;
  cover: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MusicPlayer({ tracks, isOpen, onClose }: MusicPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = tracks[currentIndex];

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleClose = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentIndex(0);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen) return;
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime('0:00');
    setDuration('0:00');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [currentIndex, isOpen]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? tracks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === tracks.length - 1 ? 0 : prev + 1));
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime: ct, duration: dur } = audioRef.current;
    if (dur) {
      setProgress((ct / dur) * 100);
      setCurrentTime(formatTime(ct));
      setDuration(formatTime(dur));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * audioRef.current.duration;
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative bg-background border border-border rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 앨범 커버 */}
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={track.cover}
              alt={track.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* 곡 정보 */}
        <div className="text-center mb-6">
          <h3 className="font-bold text-lg">{track.title}</h3>
          <span className="text-sm text-muted-foreground">{track.artist}</span>
        </div>

        {/* 프로그레스 바 */}
        <div className="mb-4">
          <div
            className="h-1.5 bg-muted rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-foreground rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">{currentTime}</span>
            <span className="text-xs text-muted-foreground">{duration}</span>
          </div>
        </div>

        {/* 컨트롤 */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handlePrev}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>
          <button
            onClick={handleNext}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        {/* 트랙 인디케이터 */}
        <div className="flex justify-center gap-1.5 mt-4">
          {tracks.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? 'bg-foreground' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <audio
          ref={audioRef}
          src={track.src}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleNext}
        />
      </div>
    </div>,
    document.body
  );
}
