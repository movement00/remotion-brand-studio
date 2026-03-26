import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  interpolate,
} from 'remotion';
import { AnimatedText } from '../components/AnimatedText';
import { MediaLayer } from '../components/MediaLayer';

interface BeforeAfterProps {
  brand: {
    name: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontHeading: string;
    fontBody: string;
    slogan?: string;
  };
  content: {
    headline: string;
    subHeadline?: string;
    bodyText?: string;
    ctaText?: string;
    mediaUrls?: string[];
  };
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Divider sweep from 0% to 50% (center)
  const dividerPosition = interpolate(frame, [50, 150], [0, 540], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Label animations
  const labelBefore = spring({ frame: frame - 140, fps, config: { damping: 12, stiffness: 150 } });
  const labelAfter = spring({ frame: frame - 155, fps, config: { damping: 12, stiffness: 150 } });

  // Result glow
  const glowPulse = frame > 180 ? Math.sin((frame - 180) / 6) * 0.3 + 0.7 : 0;

  // Counter animation
  const counterTarget = 95; // percentage improvement
  const counterValue = frame > 180
    ? Math.min(counterTarget, Math.round(interpolate(frame, [180, 220], [0, counterTarget], { extrapolateRight: 'clamp' })))
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      {/* Title at top */}
      <Sequence from={5}>
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <AnimatedText
            text={content.headline}
            mode="words"
            charDelay={4}
            style={{
              fontFamily: brand.fontHeading,
              fontSize: 48,
              fontWeight: 800,
              color: '#FFFFFF',
            }}
          />
        </div>
      </Sequence>

      {/* Before panel (left) */}
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 40,
          width: 480,
          height: 780,
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {content.mediaUrls?.[0] ? (
          <MediaLayer src={content.mediaUrls[0]} effect="none" />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(180deg, ${brand.secondaryColor}, #1a1a2e)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 24, fontFamily: brand.fontBody }}>Öncesi</span>
          </div>
        )}

        {/* Before label */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            padding: '8px 20px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: 8,
            opacity: labelBefore,
            transform: `translateY(${(1 - labelBefore) * 20}px)`,
          }}
        >
          <span style={{ fontFamily: brand.fontBody, fontSize: 20, color: '#FFFFFF', fontWeight: 600 }}>
            Öncesi
          </span>
        </div>
      </div>

      {/* After panel (right) */}
      <div
        style={{
          position: 'absolute',
          top: 140,
          right: 40,
          width: 480,
          height: 780,
          borderRadius: 20,
          overflow: 'hidden',
          border: `2px solid ${brand.accentColor}${Math.round(glowPulse * 255).toString(16).padStart(2, '0')}`,
          boxShadow: glowPulse > 0 ? `0 0 30px ${brand.accentColor}44` : 'none',
        }}
      >
        {content.mediaUrls?.[1] ? (
          <MediaLayer src={content.mediaUrls[1]} effect="none" />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(180deg, ${brand.primaryColor}, ${brand.accentColor})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 24, fontFamily: brand.fontBody }}>Sonrası</span>
          </div>
        )}

        {/* After label */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            padding: '8px 20px',
            backgroundColor: brand.accentColor,
            borderRadius: 8,
            opacity: labelAfter,
            transform: `translateY(${(1 - labelAfter) * 20}px)`,
          }}
        >
          <span style={{ fontFamily: brand.fontBody, fontSize: 20, color: '#FFFFFF', fontWeight: 600 }}>
            Sonrası
          </span>
        </div>
      </div>

      {/* Center divider line */}
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 40 + dividerPosition,
          width: 4,
          height: 780,
          backgroundColor: '#FFFFFF',
          zIndex: 5,
          boxShadow: '0 0 20px rgba(255,255,255,0.5)',
        }}
      />

      {/* Stats counter at bottom */}
      <Sequence from={180}>
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: brand.fontHeading,
              fontSize: 40,
              fontWeight: 900,
              color: brand.accentColor,
            }}
          >
            %{counterValue}
          </span>
          <span
            style={{
              fontFamily: brand.fontBody,
              fontSize: 24,
              color: 'rgba(255,255,255,0.6)',
              marginLeft: 10,
            }}
          >
            {content.ctaText || 'İyileşme'}
          </span>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
