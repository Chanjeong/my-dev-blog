'use client';

import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-md transition-colors" aria-label="Toggle theme">
        <div className="h-6 w-6"></div>
      </button>
    );
  }

  const current = resolvedTheme ?? theme;

  const handleToggle = () => {
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  return (
    <button onClick={handleToggle} className="p-2 rounded-md transition-colors" aria-label="Toggle theme">
      {theme === 'dark' ? (
        <SunIcon className="h-6 w-6 text-yellow-500" />
      ) : (
        <MoonIcon className="h-6 w-6 text-gray-700" />
      )}
    </button>
  );
}
