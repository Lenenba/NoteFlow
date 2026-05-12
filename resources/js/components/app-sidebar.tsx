import { Link } from '@inertiajs/react';
import {
  BookOpen,
  Gamepad2,
  History,
  LayoutGrid,
  Music,
  Sparkles,
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { demo as musicPracticeDemo } from '@/routes/music-practice';
import { index as practiceSessionsIndex } from '@/routes/practice-sessions';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
  },
  {
    title: 'Songs',
    href: '/songs',
    icon: Music,
  },
  {
    title: 'Practice sessions',
    href: practiceSessionsIndex().url,
    icon: History,
  },
];

const studioNavItems: NavItem[] = [
  {
    title: 'Music Game demo',
    href: musicPracticeDemo().url,
    icon: Gamepad2,
  },
];

const footerNavItems: NavItem[] = [
  {
    title: 'Documentation',
    href: 'https://laravel.com/docs/starter-kits#react',
    icon: BookOpen,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />

        <SidebarGroup className="px-2 py-0">
          <SidebarGroupLabel>Studio</SidebarGroupLabel>
          <SidebarMenu>
            {studioNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={{ children: item.title }}>
                  <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Decorative call-out: keeps the sidebar feeling like a music app, not a generic admin. */}
        <SidebarGroup className="px-3 mt-auto">
          <div className="rounded-2xl border border-lime-400/20 bg-gradient-to-br from-lime-400/[0.08] via-emerald-500/[0.05] to-transparent p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lime-300">
              <Sparkles className="h-3.5 w-3.5" />
              Tip
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Connect a MIDI instrument and open any song to start a live practice session.
            </p>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
