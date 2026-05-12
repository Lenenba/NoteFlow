import type { SVGAttributes } from 'react';

/**
 * NoteFlow brand icon.
 * Combines a musical note head with a flowing tail to evoke "note in motion".
 */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Flowing stem with a gentle curve */}
      <path
        d="M22 28V8c0-1.1.9-2 2-2h6c1.7 0 3 1.3 3 3v0c0 1.7-1.3 3-3 3h-4v14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Note head — a filled ellipse */}
      <ellipse
        cx="14"
        cy="28"
        rx="8"
        ry="6"
        fill="currentColor"
        transform="rotate(-18 14 28)"
      />
      {/* Tiny dot decoration to imply "flow" */}
      <circle cx="34" cy="14" r="1.6" fill="currentColor" />
    </svg>
  );
}
