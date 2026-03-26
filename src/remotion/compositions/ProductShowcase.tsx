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

interface ProductShowcaseProps {
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

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = (content.bodyText || '').split('\n').filter(Boolean);
  if (features.length === 0 && content.bodyText) {
    features.push(content.bodyText);
  }

  // Bokeh circles
  const bokehCircles = Array.from({ length: 8 }, (_, i) => ({
    x: (i * 250 + 100) % 1920,
    y: (i * 180 + 80) % 1080,
    size: 20 + (i * 15) % 60,
    opacity: 0.05 + (i % 3) * 0.03,
    speed: 0.5 + (i % 4) * 0.3,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      {/* Background gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${brand.primaryColor}22 0%, transparent 60%)`,
        }}
      />

      {/* Bokeh particles */}
      {bokehCircles.map((circle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: circle.x,
            top: circle.y + Math.sin(frame / (20 + i * 5)) * 15,
            width: circle.size,
            height: circle.size,
            borderRadius: '50%',
            backgroundColor: brand.accentColor,
            opacity: circle.opacity,
            filter: 'blur(8px)',
          }}
        />
      ))}

      {/* Product image/media - left side */}
      <Sequence from={0} durationInFrames={250}>
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 80,
            width: 900,
            height: 920,
            borderRadius: 24,
            overflow: 'hidden',
          }}
        >
          {content.mediaUrls?.[0] ? (
            <MediaLayer src={content.mediaUrls[0]} effect="zoom-in" />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${brand.primaryColor}44, ${brand.secondaryColor}44)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid rgba(255,255,255,0.1)`,
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 24, fontFamily: brand.fontBody }}>
                Urun Gorseli
              </span>
            </div>
          )}
        </div>
      </Sequence>

      {/* Right side content */}
      <div
        style={{
          position: 'absolute',
          right: 80,
          top: 80,
          width: 800,
          height: 920,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 30,
        }}
      >
        {/* Logo */}
        <LogoReveal logoUrl={brand.logoUrl} size={60} startFrame={5} style={{ justifyContent: 'flex-start' }} />

        {/* Headline */}
        <Sequence from={15}>
          <AnimatedText
            text={content.headline}
            mode="words"
            charDelay={5}
            style={{
              fontFamily: brand.fontHeading,
              fontSize: 56,
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.15,
            }}
          />
        </Sequence>

        {/* Sub headline */}
        {content.subHeadline && (
          <Sequence from={45}>
            <AnimatedText
              text={content.subHeadline}
              mode="line"
              style={{
                fontFamily: brand.fontBody,
                fontSize: 28,
                color: brand.accentColor,
                fontWeight: 600,
              }}
            />
          </Sequence>
        )}

        {/* Feature bullets */}
        <Sequence from={60}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map((feature, i) => {
              const featureProgress = spring({
                frame: frame - 60 - i * 12,
                fps,
                config: { damping: 12, stiffness: 180 },
              });
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    opacity: featureProgress,
                    transform: `translateX(${(1 - featureProgress) * -40}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: brand.accentColor,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: brand.fontBody,
                      fontSize: 24,
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {feature}
                  </span>
                </div>
              );
            })}
          </div>
        </Sequence>
      </div>

      {/* CTA Bar at bottom */}
      <Sequence from={230}>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            backgroundColor: brand.accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${(1 - spring({ frame: frame - 230, fps, config: { damping: 12, stiffness: 200 } })) * 80}px)`,
          }}
        >
          <span
            style={{
              fontFamily: brand.fontBody,
              fontSize: 30,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {content.ctaText || 'Hemen Incele'}
          </span>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
