import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

interface AnimatedTextProps {
  text: string;
  startFrame?: number;
  style?: React.CSSProperties;
  charDelay?: number;
  className?: string;
  mode?: 'chars' | 'words' | 'line';
  springConfig?: { damping: number; stiffness: number };
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  startFrame = 0,
  style,
  charDelay = 2,
  className,
  mode = 'chars',
  springConfig = { damping: 12, stiffness: 180 },
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (mode === 'line') {
    const progress = spring({
      frame: frame - startFrame,
      fps,
      config: springConfig,
    });
    return (
      <div
        className={className}
        style={{
          ...style,
          opacity: progress,
          transform: `translateY(${(1 - progress) * 30}px)`,
        }}
      >
        {text}
      </div>
    );
  }

  const items = mode === 'words' ? text.split(' ') : text.split('');

  return (
    <div className={className} style={{ ...style, display: 'flex', flexWrap: 'wrap' }}>
      {items.map((item, i) => {
        const progress = spring({
          frame: frame - startFrame - i * charDelay,
          fps,
          config: springConfig,
        });
        return (
          <span
            key={i}
            style={{
              opacity: progress,
              transform: `translateY(${(1 - progress) * 20}px)`,
              display: 'inline-block',
            }}
          >
            {item}
            {mode === 'words' ? '\u00A0' : item === ' ' ? '\u00A0' : ''}
          </span>
        );
      })}
    </div>
  );
};
