import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { getActiveFiles } from '@/app/admin/dashboard/files/actions';
import ThemeToggle from './ThemeToggle';
export default async function Navigation() {
  const result = await getActiveFiles();
  const fileUrls = result.success ? result.data : { resume: null, portfolio: null };

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
                    href={fileUrls!.portfolio!}
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
                    href={fileUrls!.resume!}
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

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
