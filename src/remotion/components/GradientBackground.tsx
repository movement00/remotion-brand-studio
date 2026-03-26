import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface GradientBackgroundProps {
  colors: string[];
  animated?: boolean;
  pattern?: 'linear' | 'radial' | 'conic' | 'mesh';
  children?: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors,
  animated = true,
  pattern = 'linear',
  children,
}) => {
  const frame = useCurrentFrame();
  const angle = animated ? interpolate(frame, [0, 300], [0, 360]) : 135;

  const getGradient = (): string => {
    switch (pattern) {
      case 'radial':
        return `radial-gradient(ellipse at ${animated ? 50 + Math.sin(frame / 30) * 20 : 50}% ${animated ? 50 + Math.cos(frame / 30) * 20 : 50}%, ${colors.join(', ')})`;
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${colors.join(', ')})`;
      case 'mesh': {
        const c = colors;
        return `
          radial-gradient(at ${animated ? 20 + Math.sin(frame / 40) * 10 : 20}% ${animated ? 20 + Math.cos(frame / 40) * 10 : 20}%, ${c[0]}44 0%, transparent 50%),
          radial-gradient(at ${animated ? 80 + Math.sin(frame / 50) * 10 : 80}% ${animated ? 20 + Math.cos(frame / 50) * 10 : 20}%, ${c[1] || c[0]}44 0%, transparent 50%),
          radial-gradient(at ${animated ? 50 + Math.sin(frame / 60) * 10 : 50}% ${animated ? 80 + Math.cos(frame / 60) * 10 : 80}%, ${c[2] || c[0]}44 0%, transparent 50%),
          linear-gradient(135deg, ${c[0]}, ${c[1] || c[0]})
        `;
      }
      default:
        return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
    }
  };

  return (
    <AbsoluteFill style={{ background: getGradient() }}>
      {children}
    </AbsoluteFill>
  );
};
