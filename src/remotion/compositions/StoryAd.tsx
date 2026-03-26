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
import { LogoReveal } from '../components/LogoReveal';
import { MediaLayer } from '../components/MediaLayer';

interface StoryAdProps {
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

export const StoryAd: React.FC<StoryAdProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = content.headline.split(' ');

  // Pulsing arrow for CTA
  const pulse = Math.sin(frame / 5) * 0.5 + 0.5;
  const arrowY = interpolate(pulse, [0, 1], [0, 10]);

  // Decorative circles animation
  const circles = Array.from({ length: 6 }, (_, i) => {
    const delay = i * 5;
    const scale = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 80 } });
    const x = Math.cos((i * Math.PI * 2) / 6) * 200;
    const y = Math.sin((i * Math.PI * 2) / 6) * 200;
    return { x, y, scale, delay };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      {/* Gradient wash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${brand.primaryColor}33 0%, transparent 70%)`,
        }}
      />

      {/* Scene 1: Logo + decorative circles */}
      <Sequence from={0} durationInFrames={70}>
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {circles.map((circle, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: `2px solid ${brand.accentColor}33`,
                transform: `translate(${circle.x * circle.scale}px, ${circle.y * circle.scale}px) scale(${circle.scale})`,
                opacity: circle.scale * 0.6,
              }}
            />
          ))}
          <LogoReveal
            logoUrl={brand.logoUrl}
            size={160}
            startFrame={10}
            springConfig={{ damping: 8, stiffness: 120 }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Headline words fly in */}
      <Sequence from={50} durationInFrames={110}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: 60,
          }}
        >
          {words.map((word, i) => {
            const direction = i % 2 === 0 ? -1 : 1;
            const wordProgress = spring({
              frame: frame - 50 - i * 10,
              fps,
              config: { damping: 12, stiffness: 160 },
            });
            return (
              <div
                key={i}
                style={{
                  fontFamily: brand.fontHeading,
                  fontSize: 80,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: -2,
                  opacity: wordProgress,
                  transform: `translateX(${(1 - wordProgress) * direction * 200}px)`,
                }}
              >
                {word}
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Media or brand pattern */}
      <Sequence from={140} durationInFrames={70}>
        {content.mediaUrls?.[0] ? (
          <MediaLayer src={content.mediaUrls[0]} effect="ken-burns" />
        ) : (
          <AbsoluteFill
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 600,
                height: 600,
                borderRadius: 30,
                background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor})`,
                opacity: spring({ frame: frame - 140, fps, config: { damping: 15, stiffness: 100 } }),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: brand.fontHeading,
                  fontSize: 48,
                  color: '#FFFFFF',
                  fontWeight: 700,
                }}
              >
                {brand.name}
              </span>
            </div>
          </AbsoluteFill>
        )}
      </Sequence>

      {/* Scene 4: CTA with pulsing arrow */}
      <Sequence from={190} durationInFrames={50}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 120,
          }}
        >
          <AnimatedText
            text={content.ctaText || 'Kesfet'}
            mode="line"
            style={{
              fontFamily: brand.fontBody,
              fontSize: 36,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: 2,
            }}
          />
          <div
            style={{
              marginTop: 20,
              transform: `translateY(${arrowY}px)`,
              fontSize: 40,
              color: brand.accentColor,
            }}
          >
            ↑
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
