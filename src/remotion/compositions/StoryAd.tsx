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

  const fonts = loadBrandFonts(
    brand?.fontHeading || 'Poppins',
    brand?.fontBody || 'Inter'
  );

  const primary = brand?.primaryColor || '#3B82F6';
  const secondary = brand?.secondaryColor || '#1E293B';
  const accent = brand?.accentColor || '#F59E0B';
  const headline = content?.headline || '';
  const ctaText = content?.ctaText || '';
  const logoUrl = brand?.logoUrl || '';
  const brandName = brand?.name || '';
  const mediaUrl = content?.mediaUrls?.[0] || '';

  const words = headline.split(' ').filter(Boolean);

  // Particle system -- converge to center
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 400;
    const startX = Math.cos(angle) * radius;
    const startY = Math.sin(angle) * radius;
    const converge = spring({
      frame: frame - i * 2,
      fps,
      config: { damping: 18, stiffness: 40 },
    });
    return {
      x: startX * (1 - converge),
      y: startY * (1 - converge),
      opacity: converge * 0.6,
      size: 4 + (i % 4) * 2,
    };
  });

  // Logo reveal
  const logoScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, stiffness: 100 },
  });
  const glowRingScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 60 },
  });

  // Pulsing arrow
  const pulse = Math.sin(frame / 5) * 0.5 + 0.5;
  const arrowY = interpolate(pulse, [0, 1], [0, 12]);

  // Media Ken Burns
  const mediaScale = interpolate(frame, [140, 210], [1, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const mediaX = interpolate(frame, [140, 210], [0, -15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#08080E' }}>
      {/* Ambient brand glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${primary}22 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, ${secondary}18 0%, transparent 50%)`,
        }}
      />

      {/* Film grain */}
      <AbsoluteFill
        style={{ opacity: 0.035, mixBlendMode: 'overlay', zIndex: 50, pointerEvents: 'none' }}
      >
        <svg width="100%" height="100%">
          <filter id="grain-story">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves={4}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-story)" />
        </svg>
      </AbsoluteFill>

      {/* Subtle vertical scan lines */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)`,
          pointerEvents: 'none',
          zIndex: 49,
        }}
      />

      {/* ===== SCENE 1: Particles converge + Logo reveal (0-60f) ===== */}
      <Sequence from={0} durationInFrames={70}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Converging particles */}
          {particles.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                backgroundColor: i % 2 === 0 ? accent : primary,
                opacity: p.opacity,
                transform: `translate(${p.x}px, ${p.y}px)`,
                filter: 'blur(1px)',
              }}
            />
          ))}

          {/* Glow ring behind logo */}
          <div
            style={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '50%',
              border: `2px solid ${accent}33`,
              opacity: glowRingScale * 0.5,
              transform: `scale(${glowRingScale})`,
              boxShadow: `0 0 60px ${accent}22, inset 0 0 40px ${accent}11`,
            }}
          />

          {/* Logo */}
          {logoUrl ? (
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(16px)',
                boxShadow: `0 0 50px ${primary}22, 0 16px 40px rgba(0,0,0,0.4)`,
                opacity: logoScale,
                transform: `scale(${logoScale})`,
              }}
            >
              <Img
                src={logoUrl}
                style={{ width: 96, height: 96, objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div
              style={{
                opacity: logoScale,
                transform: `scale(${logoScale})`,
                fontFamily: fonts.heading,
                fontSize: 56,
                fontWeight: 800,
                color: '#FFFFFF',
                textShadow: `0 0 40px ${primary}55`,
              }}
            >
              {brandName}
            </div>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* ===== SCENE 2: Headline words enter alternating sides (50-150f) ===== */}
      <Sequence from={50} durationInFrames={110}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '0 60px',
          }}
        >
          {words.map((word, i) => {
            const direction = i % 2 === 0 ? -1 : 1;
            const wordProgress = spring({
              frame: frame - 55 - i * 10,
              fps,
              config: { damping: 11, stiffness: 150 },
            });
            // Blur to sharp transition
            const blurVal = interpolate(wordProgress, [0, 0.7, 1], [12, 2, 0]);
            const scaleVal = interpolate(wordProgress, [0, 0.8, 1], [1.15, 1.02, 1]);
            return (
              <div
                key={i}
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 76,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: -2,
                  opacity: wordProgress,
                  transform: `translateX(${(1 - wordProgress) * direction * 250}px) scale(${scaleVal})`,
                  filter: `blur(${blurVal}px)`,
                  textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                }}
              >
                {word}
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>

      {/* ===== SCENE 3: Media with Ken Burns + vignette (140-210f) ===== */}
      <Sequence from={140} durationInFrames={70}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 40px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 980,
              height: 900,
              borderRadius: 28,
              overflow: 'hidden',
              position: 'relative',
              opacity: spring({
                frame: frame - 140,
                fps,
                config: { damping: 15, stiffness: 90 },
              }),
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {mediaUrl ? (
              <Img
                src={mediaUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `scale(${mediaScale}) translateX(${mediaX}px)`,
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg, ${primary}55, ${secondary}55)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: fonts.heading,
                    fontSize: 48,
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 700,
                  }}
                >
                  {brandName}
                </span>
              </div>
            )}
            {/* Vignette overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ===== SCENE 4: CTA with frosted glass + animated arrow (195-240f) ===== */}
      <Sequence from={195} durationInFrames={45}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 140,
          }}
        >
          {/* Frosted glass CTA area */}
          {(() => {
            const ctaProgress = spring({
              frame: frame - 198,
              fps,
              config: { damping: 12, stiffness: 120 },
            });
            return (
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(24px)',
                  borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '36px 60px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                  opacity: ctaProgress,
                  transform: `translateY(${(1 - ctaProgress) * 40}px)`,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                }}
              >
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 34,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  {ctaText || brandName}
                </span>
                {/* Animated up-arrow */}
                <div
                  style={{
                    transform: `translateY(${-arrowY}px)`,
                    fontSize: 36,
                    color: accent,
                    lineHeight: 1,
                  }}
                >
                  &#x2191;
                </div>
              </div>
            );
          })()}
        </AbsoluteFill>
      </Sequence>

      {/* Top brand watermark */}
      <Sequence from={0}>
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: fonts.body,
              fontSize: 14,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.15)',
              opacity: spring({
                frame: frame - 5,
                fps,
                config: { damping: 20, stiffness: 60 },
              }),
            }}
          >
            {brandName}
          </span>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
