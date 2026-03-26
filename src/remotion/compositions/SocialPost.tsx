import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  interpolate,
  Img,
} from 'remotion';
import { loadBrandFonts } from '../utils/fonts';

interface SocialPostProps {
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

export const SocialPost: React.FC<SocialPostProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fonts = loadBrandFonts(
    brand?.fontHeading || 'Poppins',
    brand?.fontBody || 'Inter'
  );

  const primary = brand?.primaryColor || '#3B82F6';
  const secondary = brand?.secondaryColor || '#1E293B';
  const accent = brand?.accentColor || '#F59E0B';
  const headline = content?.headline || '';
  const bodyText = content?.bodyText || '';
  const ctaText = content?.ctaText || '';
  const logoUrl = brand?.logoUrl || '';
  const brandName = brand?.name || '';

  // Noise grain SVG filter
  const grainOpacity = 0.04;

  // Background gradient animation
  const bgAngle = interpolate(frame, [0, 150], [120, 160]);

  // Decorative accent circle
  const circleScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 20, stiffness: 60 },
  });
  const circle2Scale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 25, stiffness: 50 },
  });

  // Logo glow
  const logoIn = spring({
    frame: frame - 8,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  // Headline words
  const words = headline.split(' ');

  // CTA
  const ctaIn = spring({
    frame: frame - 95,
    fps,
    config: { damping: 8, stiffness: 140 },
  });

  // Bottom line
  const lineWidth = interpolate(frame, [110, 140], [0, 300], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Brand name
  const nameIn = spring({
    frame: frame - 115,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill>
      {/* Animated gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${bgAngle}deg, ${primary}, ${secondary} 60%, ${primary}88)`,
        }}
      />

      {/* Noise/grain overlay */}
      <AbsoluteFill style={{ opacity: grainOpacity, mixBlendMode: 'overlay' }}>
        <svg width="100%" height="100%">
          <filter id="grain-social">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves={3}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-social)" />
        </svg>
      </AbsoluteFill>

      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          border: `2px solid ${accent}22`,
          transform: `scale(${circleScale})`,
          opacity: circleScale * 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}11 0%, transparent 70%)`,
          transform: `scale(${circle2Scale})`,
        }}
      />

      {/* Subtle grid lines */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${primary}08 1px, transparent 1px), linear-gradient(90deg, ${primary}08 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          opacity: 0.5,
        }}
      />

      {/* Logo with glow */}
      {logoUrl ? (
        <div style={{ position: 'absolute', top: 50, right: 50, zIndex: 10 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: `0 0 40px ${primary}33`,
              opacity: logoIn,
              transform: `scale(${logoIn})`,
            }}
          >
            <Img
              src={logoUrl}
              style={{ width: 56, height: 56, objectFit: 'contain' }}
            />
          </div>
        </div>
      ) : null}

      {/* Main content area */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 70px',
        }}
      >
        {/* Accent line above headline */}
        <Sequence from={10}>
          <div
            style={{
              width: interpolate(
                spring({
                  frame: frame - 10,
                  fps,
                  config: { damping: 15, stiffness: 120 },
                }),
                [0, 1],
                [0, 60]
              ),
              height: 4,
              backgroundColor: accent,
              borderRadius: 2,
              marginBottom: 30,
            }}
          />
        </Sequence>

        {/* Headline -- word by word */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16px' }}>
          {words.map((word, i) => {
            const wordIn = spring({
              frame: frame - 20 - i * 6,
              fps,
              config: { damping: 11, stiffness: 160 },
            });
            const rotation = (1 - wordIn) * (i % 2 === 0 ? -3 : 3);
            return (
              <span
                key={i}
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 68,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                  opacity: wordIn,
                  transform: `translateY(${(1 - wordIn) * 25}px) rotate(${rotation}deg)`,
                  display: 'inline-block',
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Body text */}
        {bodyText ? (
          <Sequence from={55}>
            <p
              style={{
                fontFamily: fonts.body,
                fontSize: 28,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.5,
                marginTop: 24,
                maxWidth: 800,
                opacity: spring({
                  frame: frame - 55,
                  fps,
                  config: { damping: 15, stiffness: 80 },
                }),
                letterSpacing: interpolate(
                  spring({
                    frame: frame - 55,
                    fps,
                    config: { damping: 15, stiffness: 80 },
                  }),
                  [0, 1],
                  [4, 0]
                ),
              }}
            >
              {bodyText}
            </p>
          </Sequence>
        ) : null}

        {/* CTA Button */}
        {ctaText ? (
          <Sequence from={85}>
            <div style={{ marginTop: 40 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '16px 44px',
                  borderRadius: 50,
                  background: accent,
                  boxShadow: `0 8px 32px ${accent}44, 0 0 0 1px ${accent}`,
                  opacity: ctaIn,
                  transform: `scale(${ctaIn}) translateY(${(1 - ctaIn) * 15}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 24,
                    fontWeight: 700,
                    color: primary,
                    letterSpacing: 0.5,
                  }}
                >
                  {ctaText}
                </span>
              </div>
            </div>
          </Sequence>
        ) : null}
      </AbsoluteFill>

      {/* Bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: 70,
          right: 70,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Separator line */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.2)',
          }}
        />
        {/* Brand name */}
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 16,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: nameIn,
            whiteSpace: 'nowrap',
          }}
        >
          {brand?.slogan || brandName}
        </span>
      </div>
    </AbsoluteFill>
  );
};
