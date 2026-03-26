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
import { GradientBackground } from '../components/GradientBackground';

interface CountdownPromoProps {
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

export const CountdownPromo: React.FC<CountdownPromoProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Countdown from 10 to 0 over 300 frames
  const countdownValue = Math.max(0, 10 - Math.floor(frame / 30));
  const frameInSecond = frame % 30;

  // Number flip animation
  const flipProgress = spring({
    frame: frameInSecond,
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  // Pulse glow
  const pulse = Math.sin(frame / 8) * 0.3 + 0.7;

  // Urgency increases as countdown decreases
  const urgencyScale = interpolate(frame, [0, 300], [1, 1.15], {
    extrapolateRight: 'clamp',
  });

  // Shake when number changes (first few frames of each second)
  const shake = frameInSecond < 5 ? Math.sin(frameInSecond * 10) * 3 : 0;

  return (
    <AbsoluteFill>
      <GradientBackground
        colors={[brand.primaryColor, '#DC2626', brand.accentColor]}
        pattern="radial"
        animated
      />

      {/* Dark overlay for readability */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />

      {/* Brand name top */}
      <Sequence from={0}>
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
          <AnimatedText
            text={brand.name}
            mode="line"
            style={{
              fontFamily: brand.fontHeading,
              fontSize: 28,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}
          />
        </div>
      </Sequence>

      {/* Headline */}
      <Sequence from={10}>
        <div
          style={{
            position: 'absolute',
            top: 250,
            left: 60,
            right: 60,
            textAlign: 'center',
          }}
        >
          <AnimatedText
            text={content.headline}
            mode="words"
            charDelay={5}
            style={{
              fontFamily: brand.fontHeading,
              fontSize: 56,
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.2,
              textShadow: '0 4px 40px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </Sequence>

      {/* Big countdown number */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${urgencyScale * flipProgress}) translateX(${shake}px)`,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: brand.fontHeading,
              fontSize: 300,
              fontWeight: 900,
              color: '#FFFFFF',
              textShadow: `0 0 60px ${brand.accentColor}${Math.round(pulse * 255).toString(16).padStart(2, '0')}, 0 0 120px ${brand.accentColor}44`,
              lineHeight: 1,
            }}
          >
            {countdownValue}
          </span>
          <div
            style={{
              fontFamily: brand.fontBody,
              fontSize: 36,
              color: 'rgba(255,255,255,0.8)',
              marginTop: -20,
              letterSpacing: 8,
              textTransform: 'uppercase',
            }}
          >
            {content.subHeadline || 'Gün Kaldı'}
          </div>
        </div>
      </AbsoluteFill>

      {/* Body text */}
      <Sequence from={60}>
        <div
          style={{
            position: 'absolute',
            bottom: 350,
            left: 60,
            right: 60,
            textAlign: 'center',
          }}
        >
          <AnimatedText
            text={content.bodyText || 'Kampanyayı kaçırma!'}
            mode="line"
            style={{
              fontFamily: brand.fontBody,
              fontSize: 28,
              color: 'rgba(255,255,255,0.7)',
            }}
          />
        </div>
      </Sequence>

      {/* CTA */}
      <Sequence from={80}>
        <div
          style={{
            position: 'absolute',
            bottom: 180,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              padding: '22px 60px',
              backgroundColor: '#FFFFFF',
              borderRadius: 50,
              opacity: spring({ frame: frame - 80, fps, config: { damping: 12, stiffness: 150 } }),
              transform: `scale(${spring({ frame: frame - 80, fps, config: { damping: 8, stiffness: 150 } })})`,
            }}
          >
            <span
              style={{
                fontFamily: brand.fontBody,
                fontSize: 28,
                fontWeight: 800,
                color: brand.primaryColor,
              }}
            >
              {content.ctaText || 'Hemen Al'}
            </span>
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
