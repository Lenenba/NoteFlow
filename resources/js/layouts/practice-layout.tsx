/**
 * Practice Layout
 * Distraction-free layout used by the in-song practice screen.
 * No sidebar, minimal top bar with a back button, and a dark gradient backdrop
 * tuned to match the music game aesthetic.
 */

import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';
import { index as songsIndex } from '@/routes/songs';

interface PracticeLayoutProps {
  /** Title displayed in the top bar (e.g. song title). */
  title: string;
  /** Optional subtitle (e.g. artist, key, BPM). */
  subtitle?: string;
  /** Optional content rendered on the right side of the top bar (badges, MIDI status, etc). */
  rightSlot?: ReactNode;
  /** URL to navigate back to. Defaults to /songs. */
  backHref?: string;
  /** Custom label for the back link. Defaults to "Songs". */
  backLabel?: string;
  children: ReactNode;
}

export default function PracticeLayout({
  title,
  subtitle,
  rightSlot,
  backHref,
  backLabel = 'Songs',
  children,
}: PracticeLayoutProps) {
  const href = backHref ?? songsIndex().url;

  return (
    <div className="dark relative flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      {/* Decorative ambient gradient that pulses gently behind the UI */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-lime-400/[0.07] blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-[480px] w-[480px] rounded-full bg-cyan-400/[0.05] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-purple-500/[0.05] blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/[0.06] bg-zinc-950/70 px-4 py-3 backdrop-blur-md lg:px-6">
        {/* Back link */}
        <Link
          href={href}
          className="group flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>

        {/* Brand mark */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-lime-300 to-green-500 text-zinc-900">
            <AppLogoIcon className="h-4 w-4" />
          </span>
          <span className="hidden text-sm font-black tracking-tight md:inline">
            NoteFlow
          </span>
        </Link>

        {/* Title */}
        <div className="ml-2 flex min-w-0 flex-1 flex-col">
          <div className="truncate text-base font-bold tracking-tight text-white">
            {title}
          </div>
          {subtitle && (
            <div className="truncate text-xs text-white/55">{subtitle}</div>
          )}
        </div>

        {/* Right slot for stats / MIDI / etc. */}
        {rightSlot && <div className="ml-auto flex items-center gap-3">{rightSlot}</div>}
      </header>

      {/* Main content: a single max-width column to keep the eye centered */}
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-[1480px] flex-1 px-3 py-4 lg:px-6 lg:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
