import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Img, interpolate } from 'remotion';
import { OffthreadVideo } from 'remotion';

interface MediaLayerProps {
  src: string;
  type?: 'image' | 'video';
  effect?: 'ken-burns' | 'zoom-in' | 'fade' | 'parallax' | 'none';
  startFrame?: number;
  style?: React.CSSProperties;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export const MediaLayer: React.FC<MediaLayerProps> = ({
  src,
  type = 'image',
  effect = 'ken-burns',
  startFrame = 0,
  style,
  objectFit = 'cover',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const getTransform = (): string => {
    switch (effect) {
      case 'ken-burns': {
        const scale = interpolate(frame, [startFrame, durationInFrames], [1, 1.15], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const translateX = interpolate(frame, [startFrame, durationInFrames], [0, -20], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return `scale(${scale}) translateX(${translateX}px)`;
      }
      case 'zoom-in': {
        const progress = spring({ frame: frame - startFrame, fps, config: { damping: 20, stiffness: 40 } });
        return `scale(${1 + progress * 0.2})`;
      }
      case 'parallax': {
        const y = interpolate(frame, [0, durationInFrames], [10, -10], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return `translateY(${y}px) scale(1.1)`;
      }
      default:
        return 'none';
    }
  };

  const opacity = effect === 'fade'
    ? spring({ frame: frame - startFrame, fps, config: { damping: 15, stiffness: 80 } })
    : 1;

  const mediaStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    transform: getTransform(),
    opacity,
    ...style,
  };

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {type === 'video' ? (
        <OffthreadVideo src={src} style={mediaStyle} />
      ) : (
        <Img src={src} style={mediaStyle} />
      )}
    </AbsoluteFill>
  );
};
