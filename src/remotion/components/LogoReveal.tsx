import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, Img } from 'remotion';

interface LogoRevealProps {
  logoUrl: string;
  startFrame?: number;
  size?: number;
  style?: React.CSSProperties;
  springConfig?: { damping: number; stiffness: number };
}

export const LogoReveal: React.FC<LogoRevealProps> = ({
  logoUrl,
  startFrame = 0,
  size = 120,
  style,
  springConfig = { damping: 10, stiffness: 150 },
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: springConfig,
  });

  const rotation = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  if (!logoUrl) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <Img
        src={logoUrl}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          opacity: scale,
          transform: `scale(${scale}) rotate(${(1 - rotation) * 10}deg)`,
        }}
      />
    </div>
  );
};
