'use client';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold font-noto-serif-kr">喜怒哀樂</h1>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="/portfolio"
              className="text-foreground hover:text-primary transition-colors font-medium">
              Portfolio
            </a>

            <a
              href="/about"
              className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </a>

            <a
              href="/contact"
              className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </a>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="bg-bg-primary  "
              aria-label="Toggle theme">
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
