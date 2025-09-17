'use client';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { getActiveFiles } from '@/app/admin/dashboard/files/actions';
export default function Navigation() {
  const [mounted, setMounted] = useState(false);
  const [fileUrls, setFileUrls] = useState<{
    resume: string | null;
    portfolio: string | null;
  }>({ resume: null, portfolio: null });
  const { theme, setTheme } = useTheme();

  const fetchFileUrls = async () => {
    try {
      const result = await getActiveFiles();
      if (result.success && result.data) {
        setFileUrls(result.data);
      }
    } catch (error) {
      console.error('파일 URL 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchFileUrls();
  }, []);

  useEffect(() => {
    const handleFileUpdate = () => {
      fetchFileUrls();
    };

    window.addEventListener('fileUpdated', handleFileUpdate);
    return () => window.removeEventListener('fileUpdated', handleFileUpdate);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="relative top-0 left-0 right-0 bg-card backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold font-noto-serif-kr hover:text-primary transition-colors">
              喜怒哀樂
            </Link>
          </div>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a
                    href={fileUrls.portfolio!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={navigationMenuTriggerStyle()}
                  >
                    Portfolio
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a
                    href={fileUrls.resume!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={navigationMenuTriggerStyle()}
                  >
                    About
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/contact" className={navigationMenuTriggerStyle()}>
                    Contact
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-6 w-6 text-yellow-500" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
