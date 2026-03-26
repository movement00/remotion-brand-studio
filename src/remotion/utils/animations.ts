import { spring, interpolate } from 'remotion';

export const SPRING_FAST = { config: { damping: 12, stiffness: 200 } };
export const SPRING_SMOOTH = { config: { damping: 15, stiffness: 100 } };
export const SPRING_BOUNCY = { config: { damping: 8, stiffness: 150 } };
export const SPRING_GENTLE = { config: { damping: 20, stiffness: 80 } };

export function fadeIn(frame: number, startFrame: number = 0, duration: number = 15): number {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

export function slideUp(frame: number, fps: number, delay: number = 0): { opacity: number; translateY: number } {
  const progress = spring({ frame: frame - delay, fps, ...SPRING_SMOOTH });
  return {
    opacity: progress,
    translateY: (1 - progress) * 40,
  };
}

export function slideIn(
  frame: number,
  fps: number,
  direction: 'left' | 'right' | 'up' | 'down' = 'left',
  delay: number = 0
): { opacity: number; transform: string } {
  const progress = spring({ frame: frame - delay, fps, ...SPRING_FAST });
  const distance = 60;
  const transforms: Record<string, string> = {
    left: `translateX(${(1 - progress) * -distance}px)`,
    right: `translateX(${(1 - progress) * distance}px)`,
    up: `translateY(${(1 - progress) * -distance}px)`,
    down: `translateY(${(1 - progress) * distance}px)`,
  };
  return {
    opacity: progress,
    transform: transforms[direction],
  };
}

export function scaleIn(frame: number, fps: number, delay: number = 0): { opacity: number; transform: string } {
  const progress = spring({ frame: frame - delay, fps, ...SPRING_BOUNCY });
  return {
    opacity: progress,
    transform: `scale(${progress})`,
  };
}

export function staggerDelay(index: number, baseDelay: number = 8): number {
  return index * baseDelay;
}

export function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function brandGradient(primary: string, secondary: string, angle: number = 135): string {
  return `linear-gradient(${angle}deg, ${primary}, ${secondary})`;
}
