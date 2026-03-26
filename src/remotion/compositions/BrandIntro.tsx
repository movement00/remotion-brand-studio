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

interface BrandIntroProps {
  brand?: {
    name?: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontHeading?: string;
    fontBody?: string;
    slogan?: string;
  };
  content?: {
    headline?: string;
    subHeadline?: string;
    bodyText?: string;
    ctaText?: string;
    mediaUrls?: string[];
  };
}

// Seeded pseudo-random for deterministic particle placement
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const BrandIntro: React.FC<BrandIntroProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fonts = loadBrandFonts(brand?.fontHeading || 'Poppins', brand?.fontBody || 'Inter');

  const primaryColor = brand?.primaryColor || '#1E3A5F';
  const secondaryColor = brand?.secondaryColor || '#2D5A8E';
  const accentColor = brand?.accentColor || '#E63946';
  const brandName = brand?.name || 'Marka';
  const slogan = brand?.slogan || content?.headline || brandName;

  // --- Scene 1: Particles converge (0-50f) ---
  const particleCount = 24;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2 + seededRandom(i) * 0.5;
    const radius = 300 + seededRandom(i + 100) * 250;
    const convergence = spring({
      frame: Math.max(0, frame - i * 1.5),
      fps,
      config: { damping: 22, stiffness: 50, mass: 1.2 },
    });
    const startX = Math.cos(angle) * radius;
    const startY = Math.sin(angle) * radius;
    const size = 3 + seededRandom(i + 200) * 6;
    const isCircle = seededRandom(i + 300) > 0.5;
    const useAccent = seededRandom(i + 400) > 0.5;

    return {
      x: startX * (1 - convergence),
      y: startY * (1 - convergence),
      opacity: interpolate(convergence, [0, 0.3, 0.8, 1], [0, 0.8, 0.6, 0]),
      size,
      rotation: (1 - convergence) * (360 + seededRandom(i + 500) * 180),
      isCircle,
      color: useAccent ? accentColor : primaryColor,
    };
  });

  // --- Scene 2: Logo scales in (40-100f) ---
  const logoScale = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.8 },
  });

  const logoOpacity = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  // Logo glow halo
  const logoGlow = interpolate(
    spring({ frame: Math.max(0, frame - 45), fps, config: { damping: 20, stiffness: 60 } }),
    [0, 1],
    [0, 1]
  );

  // --- Scene 3: Breathing animation (90-130f) ---
  const breathe = frame > 90 ? 1 + Math.sin((frame - 90) / 18) * 0.018 : 1;

  // --- Scene 4: Slogan typewriter (110-160f) ---
  const sloganChars = slogan.split('');
  const sloganStartFrame = 110;

  // --- Scene 5: Accent line + gradient wash (140-180f) ---
  const lineWidth = interpolate(frame, [140, 170], [0, 300], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const washOpacity = interpolate(frame, [150, 180], [0, 0.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ambient glow behind logo
  const ambientGlow = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#050508', overflow: 'hidden' }}>
      {/* Very subtle ambient light behind logo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 46%, ${primaryColor}${Math.round(ambientGlow * 18)
            .toString(16)
            .padStart(2, '0')} 0%, transparent 45%)`,
        }}
      />

      {/* Scene 1: Converging particles */}
      {frame < 80 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {particles.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                opacity: p.opacity,
                transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`,
                borderRadius: p.isCircle ? '50%' : '1px',
                boxShadow: `0 0 ${p.size * 2}px ${p.color}66`,
              }}
            />
          ))}
        </AbsoluteFill>
      )}

      {/* Scene 2 & 3: Logo with glow halo */}
      {frame >= 38 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Glow halo behind logo */}
          <div
            style={{
              position: 'absolute',
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${primaryColor}${Math.round(logoGlow * 30)
                .toString(16)
                .padStart(2, '0')} 0%, transparent 70%)`,
              opacity: logoGlow,
              transform: `scale(${breathe})`,
            }}
          />

          {/* Logo */}
          {brand?.logoUrl ? (
            <Img
              src={brand.logoUrl}
              style={{
                width: 200,
                height: 200,
                objectFit: 'contain',
                opacity: logoOpacity,
                transform: `scale(${logoScale * breathe})`,
                filter: `drop-shadow(0 0 50px ${primaryColor}55) drop-shadow(0 0 100px ${primaryColor}22)`,
              }}
            />
          ) : (
            <div
              style={{
                opacity: logoOpacity,
                transform: `scale(${logoScale * breathe})`,
              }}
            >
              <span
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 88,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: -2,
                  textShadow: `0 0 60px ${primaryColor}66, 0 0 120px ${primaryColor}22`,
                }}
              >
                {brandName}
              </span>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* Scene 4: Slogan with character-by-character typewriter */}
      <Sequence from={sloganStartFrame}>
        <div
          style={{
            position: 'absolute',
            top: '62%',
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {sloganChars.map((char, i) => {
              const charFrame = frame - sloganStartFrame;
              const charDelay = i * 2;
              const charOpacity = interpolate(charFrame, [charDelay, charDelay + 4], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              return (
                <span
                  key={i}
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 30,
                    color: `rgba(255,255,255,${charOpacity * 0.65})`,
                    letterSpacing: 5,
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    minWidth: char === ' ' ? 10 : undefined,
                    textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Typewriter cursor */}
          {frame - sloganStartFrame < sloganChars.length * 2 + 20 && (
            <span
              style={{
                display: 'inline-block',
                width: 2,
                height: 28,
                backgroundColor: accentColor,
                marginLeft: 4,
                opacity: Math.sin(frame / 3) > 0 ? 0.8 : 0,
                verticalAlign: 'middle',
                boxShadow: `0 0 8px ${accentColor}88`,
              }}
            />
          )}
        </div>
      </Sequence>

      {/* Scene 5: Horizontal accent line expanding from center */}
      <div
        style={{
          position: 'absolute',
          top: '58%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: lineWidth,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          opacity: 0.6,
          boxShadow: `0 0 16px ${accentColor}33`,
        }}
      />

      {/* Scene 5: Gradient color wash overlay */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
          opacity: washOpacity,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Noise/grain overlay */}
      <AbsoluteFill style={{ opacity: 0.04, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          <filter id="grain-brand">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-brand)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
