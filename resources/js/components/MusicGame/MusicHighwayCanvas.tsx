/**
 * Music Highway Canvas Component
 * Self-driven canvas that reads currentTime from a ref/getter on every frame.
 * Decoupled from React rendering so the animation stays at 60fps regardless
 * of the parent's render frequency.
 */

import { useEffect, useRef } from 'react';

import type {
  ChordEvent,
  GameTheme,
  HighwayLayout,
  NoteEvent,
  Particle,
} from '@/types/musicGame';
import {
  createHighwayLayout,
  getLaneCenterX,
  getStringX,
  projectEvent,
  VISIBLE_AHEAD_SECONDS,
} from '@/services/music/gameProjection';

interface MusicHighwayCanvasProps {
  chords: ChordEvent[];
  notes: NoteEvent[];
  /** Function returning the current playback time. Read on every frame. */
  getCurrentTime: () => number;
  /** Function returning live particles. Read on every frame. */
  getParticles: () => Particle[];
  theme: GameTheme;
}

const LANE_COUNT = 4;
const STRING_COUNT = 6;
const FRET_INTERVAL_SECONDS = 1;

const SPARKLES = Array.from({ length: 50 }, (_, i) => ({
  baseX: Math.random(),
  baseY: Math.random() * 0.55,
  size: 1 + Math.random() * 2.5,
  speed: 0.08 + Math.random() * 0.22,
  phase: Math.random() * Math.PI * 2,
  alpha: 0.25 + Math.random() * 0.45,
  hue: i % 3,
}));

export function MusicHighwayCanvas({
  chords,
  notes,
  getCurrentTime,
  getParticles,
  theme,
}: MusicHighwayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layoutRef = useRef<HighwayLayout | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Keep latest props in refs so the rAF loop never closes over stale data.
  const chordsRef = useRef(chords);
  const notesRef = useRef(notes);
  const themeRef = useRef(theme);
  const getCurrentTimeRef = useRef(getCurrentTime);
  const getParticlesRef = useRef(getParticles);

  chordsRef.current = chords;
  notesRef.current = notes;
  themeRef.current = theme;
  getCurrentTimeRef.current = getCurrentTime;
  getParticlesRef.current = getParticles;

  // Set canvas size and layout, both initially and on resize.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      layoutRef.current = createHighwayLayout(rect.width, rect.height);
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(canvas);
    window.addEventListener('resize', updateSize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Self-driven animation loop. Renders every frame using fresh refs.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const render = () => {
      const layout = layoutRef.current;
      if (!layout) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const centerX = width / 2;

      const currentTime = getCurrentTimeRef.current();
      const particles = getParticlesRef.current();
      const t = themeRef.current;

      ctx.clearRect(0, 0, width, height);

      drawBackground(ctx, width, height, t);
      drawBackgroundSparkles(ctx, width, height, currentTime, t);
      drawHighwayBase(ctx, width, height, layout, t);
      drawFretBars(ctx, width, height, layout, currentTime, t);
      drawHighwayEdges(ctx, width, height, layout, t);
      drawStrings(ctx, width, height, layout, t);

      chordsRef.current.forEach((chord) => {
        const timeToHit = chord.startTime - currentTime;
        const projection = projectEvent(timeToHit, layout);
        if (projection.isVisible) {
          drawChordPlate(ctx, chord, projection, centerX, t);
        }
      });

      notesRef.current.forEach((note) => {
        const timeToHit = note.startTime - currentTime;
        const projection = projectEvent(timeToHit, layout);
        if (projection.isVisible) {
          drawNoteCapsule(ctx, note, projection, centerX);
        }
      });

      drawDottedTrajectory(ctx, layout, centerX, currentTime, chordsRef.current);
      drawHitLine(ctx, width, layout);
      drawFeedbackParticles(ctx, particles);

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      style={{ display: 'block' }}
    />
  );
}

// ============================================================================
// Drawing helpers
// ============================================================================

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: GameTheme,
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, theme.bgTopColor);
  gradient.addColorStop(0.65, theme.bgBottomColor);
  gradient.addColorStop(1, '#76C620');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Top wave shape.
  ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.2);
  ctx.bezierCurveTo(
    width * 0.32,
    height * 0.06,
    width * 0.68,
    height * 0.34,
    width,
    height * 0.16,
  );
  ctx.lineTo(width, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  // Second softer wave.
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.32);
  ctx.bezierCurveTo(
    width * 0.22,
    height * 0.2,
    width * 0.78,
    height * 0.44,
    width,
    height * 0.3,
  );
  ctx.lineTo(width, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
}

function drawBackgroundSparkles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  currentTime: number,
  theme: GameTheme,
) {
  for (const sp of SPARKLES) {
    const drift = (currentTime * sp.speed + sp.phase) % 1.4;
    const yOffset = drift * height * 0.3;
    const x = sp.baseX * width;
    const y = (sp.baseY * height + yOffset) % (height * 0.6);
    const sparkleAlpha = sp.alpha * (0.55 + Math.sin(currentTime * 1.8 + sp.phase) * 0.45);

    ctx.globalAlpha = Math.max(0, sparkleAlpha);
    ctx.fillStyle = sp.hue === 0 ? '#FFFFFF' : sp.hue === 1 ? theme.bgTopColor : '#E8FFCC';
    ctx.beginPath();
    ctx.arc(x, y, sp.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawHighwayBase(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  layout: HighwayLayout,
  theme: GameTheme,
) {
  const centerX = width / 2;
  const bottomY = height;
  const bottomWidth = layout.nearWidth * 1.05;

  const gradient = ctx.createLinearGradient(0, layout.farY, 0, bottomY);
  gradient.addColorStop(0, '#191B1A');
  gradient.addColorStop(0.5, theme.fretboardDark);
  gradient.addColorStop(1, theme.fretboardMid);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(centerX - layout.farWidth / 2, layout.farY);
  ctx.lineTo(centerX + layout.farWidth / 2, layout.farY);
  ctx.lineTo(centerX + bottomWidth / 2, bottomY);
  ctx.lineTo(centerX - bottomWidth / 2, bottomY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.13)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - layout.farWidth / 2, layout.farY);
  ctx.lineTo(centerX + layout.farWidth / 2, layout.farY);
  ctx.stroke();
}

function drawFretBars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  layout: HighwayLayout,
  currentTime: number,
  theme: GameTheme,
) {
  const centerX = width / 2;
  const totalDepth = layout.hitLineY - layout.farY;

  const offset = currentTime % FRET_INTERVAL_SECONDS;

  for (let t = -offset; t <= VISIBLE_AHEAD_SECONDS; t += FRET_INTERVAL_SECONDS) {
    const proj = projectEvent(t, layout);

    if (!proj.isVisible || proj.y < layout.farY || proj.y > layout.hitLineY) {
      continue;
    }

    const barWidth = proj.width;
    const depthRatio = (proj.y - layout.farY) / totalDepth;
    const barAlpha = 0.15 + depthRatio * 0.5;
    ctx.strokeStyle = `rgba(220, 230, 210, ${barAlpha})`;
    ctx.lineWidth = 1 + depthRatio * 2;

    ctx.beginPath();
    ctx.moveTo(centerX - barWidth / 2, proj.y);
    ctx.lineTo(centerX + barWidth / 2, proj.y);
    ctx.stroke();
  }

  ctx.strokeStyle = theme.gridColor;
  ctx.lineWidth = 1;

  for (let lane = 1; lane < LANE_COUNT; lane++) {
    const tFar = lane / LANE_COUNT;
    const topX = centerX - layout.farWidth / 2 + layout.farWidth * tFar;
    const bottomX = centerX - layout.nearWidth / 2 + layout.nearWidth * tFar;

    ctx.beginPath();
    ctx.moveTo(topX, layout.farY);
    ctx.lineTo(bottomX, height);
    ctx.stroke();
  }
}

function drawHighwayEdges(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  layout: HighwayLayout,
  theme: GameTheme,
) {
  const centerX = width / 2;
  const bottomWidth = layout.nearWidth * 1.05;

  ctx.strokeStyle = '#C8FF6A';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#C8FF6A';
  ctx.shadowBlur = 8;

  ctx.beginPath();
  ctx.moveTo(centerX - layout.farWidth / 2, layout.farY);
  ctx.lineTo(centerX - bottomWidth / 2, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX + layout.farWidth / 2, layout.farY);
  ctx.lineTo(centerX + bottomWidth / 2, height);
  ctx.stroke();

  ctx.shadowBlur = 0;
}

function drawStrings(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  layout: HighwayLayout,
  _theme: GameTheme,
) {
  const centerX = width / 2;
  const bottomWidth = layout.nearWidth * 1.05;

  for (let i = 1; i <= STRING_COUNT; i++) {
    const tFar = i / (STRING_COUNT + 1);
    const farX = centerX - layout.farWidth / 2 + layout.farWidth * tFar;
    const nearX = centerX - bottomWidth / 2 + bottomWidth * tFar;

    const gradient = ctx.createLinearGradient(0, layout.farY, 0, height);
    gradient.addColorStop(0, 'rgba(217, 217, 217, 0.3)');
    gradient.addColorStop(0.7, 'rgba(230, 230, 230, 0.78)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.92)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(farX, layout.farY);
    ctx.lineTo(nearX, height);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 0.5;
    const midDepth = 0.55;
    const midFarX = farX + (nearX - farX) * midDepth;
    const midFarY = layout.farY + (height - layout.farY) * midDepth;
    ctx.beginPath();
    ctx.moveTo(midFarX, midFarY);
    ctx.lineTo(nearX, height);
    ctx.stroke();
  }
}

function drawChordPlate(
  ctx: CanvasRenderingContext2D,
  chord: ChordEvent,
  projection: ReturnType<typeof projectEvent>,
  centerX: number,
  _theme: GameTheme,
) {
  const laneWidth = projection.width / LANE_COUNT;
  const laneX = getLaneCenterX(centerX, projection.width, chord.lane, LANE_COUNT);

  const plateWidth = laneWidth * 0.88;
  const plateHeight = 120 * projection.scale;

  const perspectiveTaper = 0.78;
  const topWidth = plateWidth * perspectiveTaper;
  const bottomWidth = plateWidth;

  const topY = projection.y - plateHeight / 2;
  const bottomY = projection.y + plateHeight / 2;

  ctx.globalAlpha = projection.opacity;

  // Shadow below plate.
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.moveTo(laneX - topWidth / 2 + 2, topY + 5);
  ctx.lineTo(laneX + topWidth / 2 + 2, topY + 5);
  ctx.lineTo(laneX + bottomWidth / 2 + 5, bottomY + 7);
  ctx.lineTo(laneX - bottomWidth / 2 + 5, bottomY + 7);
  ctx.closePath();
  ctx.fill();

  // Plate body.
  const plateGradient = ctx.createLinearGradient(0, topY, 0, bottomY);
  plateGradient.addColorStop(0, lightenColor(chord.color, 0.12));
  plateGradient.addColorStop(1, chord.color);

  ctx.fillStyle = plateGradient;
  ctx.beginPath();
  ctx.moveTo(laneX - topWidth / 2, topY);
  ctx.lineTo(laneX + topWidth / 2, topY);
  ctx.lineTo(laneX + bottomWidth / 2, bottomY);
  ctx.lineTo(laneX - bottomWidth / 2, bottomY);
  ctx.closePath();
  ctx.fill();

  // Top highlight strip.
  const highlightHeight = plateHeight * 0.18;
  const highlightGradient = ctx.createLinearGradient(0, topY, 0, topY + highlightHeight);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = highlightGradient;
  ctx.beginPath();
  ctx.moveTo(laneX - topWidth / 2, topY);
  ctx.lineTo(laneX + topWidth / 2, topY);
  const interpW = ((topWidth + bottomWidth) / 2) * 0.97;
  ctx.lineTo(laneX + interpW / 2, topY + highlightHeight);
  ctx.lineTo(laneX - interpW / 2, topY + highlightHeight);
  ctx.closePath();
  ctx.fill();

  // Diagonal stripe texture clipped to the plate shape.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(laneX - topWidth / 2, topY);
  ctx.lineTo(laneX + topWidth / 2, topY);
  ctx.lineTo(laneX + bottomWidth / 2, bottomY);
  ctx.lineTo(laneX - bottomWidth / 2, bottomY);
  ctx.closePath();
  ctx.clip();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  const stripeSpacing = 14;

  for (let s = -plateHeight; s < plateWidth * 2; s += stripeSpacing) {
    ctx.beginPath();
    ctx.moveTo(laneX - plateWidth / 2 + s, topY);
    ctx.lineTo(laneX - plateWidth / 2 + s - plateHeight, bottomY);
    ctx.stroke();
  }

  ctx.restore();

  // Bottom shadow line.
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(laneX - bottomWidth / 2, bottomY);
  ctx.lineTo(laneX + bottomWidth / 2, bottomY);
  ctx.stroke();

  // Hit-zone glow.
  if (projection.depth > 0.85) {
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 14;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(laneX - topWidth / 2, topY);
    ctx.lineTo(laneX + topWidth / 2, topY);
    ctx.lineTo(laneX + bottomWidth / 2, bottomY);
    ctx.lineTo(laneX - bottomWidth / 2, bottomY);
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Chord label.
  const fontSize = Math.max(22, 56 * projection.scale);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `900 ${fontSize}px "Inter", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;
  ctx.fillText(chord.label, laneX, projection.y);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.globalAlpha = 1;
}

function drawNoteCapsule(
  ctx: CanvasRenderingContext2D,
  note: NoteEvent,
  projection: ReturnType<typeof projectEvent>,
  centerX: number,
) {
  const stringX = getStringX(centerX, projection.width, note.string, STRING_COUNT);

  const capsuleWidth = 36 * projection.scale;
  const capsuleHeight = 22 * projection.scale;
  const radius = capsuleHeight / 2;

  ctx.globalAlpha = projection.opacity;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  drawRoundedRect(
    ctx,
    stringX - capsuleWidth / 2 + 1,
    projection.y - capsuleHeight / 2 + 2,
    capsuleWidth,
    capsuleHeight,
    radius,
  );
  ctx.fill();

  const gradient = ctx.createLinearGradient(
    0,
    projection.y - capsuleHeight / 2,
    0,
    projection.y + capsuleHeight / 2,
  );
  gradient.addColorStop(0, lightenColor(note.color, 0.18));
  gradient.addColorStop(1, note.color);

  ctx.fillStyle = gradient;
  drawRoundedRect(
    ctx,
    stringX - capsuleWidth / 2,
    projection.y - capsuleHeight / 2,
    capsuleWidth,
    capsuleHeight,
    radius,
  );
  ctx.fill();

  if (projection.depth > 0.88) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.5;
    drawRoundedRect(
      ctx,
      stringX - capsuleWidth / 2,
      projection.y - capsuleHeight / 2,
      capsuleWidth,
      capsuleHeight,
      radius,
    );
    ctx.stroke();
  }

  const fontSize = Math.max(11, 14 * projection.scale);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${fontSize}px "Inter", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(note.fret, stringX, projection.y);

  ctx.globalAlpha = 1;
}

function drawDottedTrajectory(
  ctx: CanvasRenderingContext2D,
  layout: HighwayLayout,
  centerX: number,
  currentTime: number,
  chords: ChordEvent[],
) {
  if (chords.length === 0) {
    return;
  }

  const dotsPerArc = 20;
  const arcLift = 60;

  const upcoming = chords
    .map((chord) => ({
      lane: chord.lane,
      projection: projectEvent(chord.startTime - currentTime, layout),
    }))
    .filter((p) => p.projection.isVisible && p.projection.depth > 0.05)
    .sort((a, b) => b.projection.depth - a.projection.depth)
    .slice(0, 4);

  for (let i = 0; i < upcoming.length - 1; i++) {
    const a = upcoming[i];
    const b = upcoming[i + 1];

    const ax = getLaneCenterX(centerX, a.projection.width, a.lane, LANE_COUNT);
    const ay = a.projection.y - 30 * a.projection.scale;
    const bx = getLaneCenterX(centerX, b.projection.width, b.lane, LANE_COUNT);
    const by = b.projection.y - 30 * b.projection.scale;

    for (let d = 0; d < dotsPerArc; d++) {
      const tRatio = d / (dotsPerArc - 1);
      const x = ax + (bx - ax) * tRatio;
      const lift =
        Math.sin(tRatio * Math.PI) * arcLift * Math.max(a.projection.scale, b.projection.scale);
      const y = ay + (by - ay) * tRatio - lift;
      const baseAlpha = i === 0 ? 0.85 : 0.45;

      ctx.globalAlpha = baseAlpha * (1 - tRatio * 0.35);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (upcoming.length > 0) {
    const head = upcoming[0];
    const hx = getLaneCenterX(centerX, head.projection.width, head.lane, LANE_COUNT);
    const hy = head.projection.y - 30 * head.projection.scale;
    const pulse = 1 + Math.sin(currentTime * 6) * 0.15;

    ctx.globalAlpha = 1;
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(hx, hy, 6 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.globalAlpha = 1;
}

function drawHitLine(
  ctx: CanvasRenderingContext2D,
  width: number,
  layout: HighwayLayout,
) {
  const centerX = width / 2;
  const nearWidth = layout.nearWidth * 1.05;

  ctx.shadowColor = '#FFFFFF';
  ctx.shadowBlur = 18;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX - nearWidth / 2, layout.hitLineY);
  ctx.lineTo(centerX + nearWidth / 2, layout.hitLineY);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(200, 255, 106, 0.7)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - nearWidth / 2, layout.hitLineY + 3);
  ctx.lineTo(centerX + nearWidth / 2, layout.hitLineY + 3);
  ctx.stroke();
}

function drawFeedbackParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
) {
  for (const particle of particles) {
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function lightenColor(hex: string, amount: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    return hex;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  const lerp = (channel: number) => Math.round(channel + (255 - channel) * amount);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');

  return `#${toHex(lerp(r))}${toHex(lerp(g))}${toHex(lerp(b))}`;
}
