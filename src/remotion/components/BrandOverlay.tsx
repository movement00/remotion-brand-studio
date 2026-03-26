import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

interface BrandOverlayProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  gradientAngle?: number;
  animated?: boolean;
  startFrame?: number;
  children?: React.ReactNode;
}

export const BrandOverlay: React.FC<BrandOverlayProps> = ({
  primaryColor,
  secondaryColor,
  accentColor,
  gradientAngle = 135,
  animated = true,
  startFrame = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = animated
    ? spring({ frame: frame - startFrame, fps, config: { damping: 30, stiffness: 40 } })
    : 1;

  const angle = gradientAngle + (animated ? (1 - progress) * 45 : 0);
  const gradient = accentColor
    ? `linear-gradient(${angle}deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`
    : `linear-gradient(${angle}deg, ${primaryColor}, ${secondaryColor})`;

  return (
    <AbsoluteFill
      style={{
        background: gradient,
        opacity: progress,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
