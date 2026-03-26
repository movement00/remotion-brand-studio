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
import { AnimatedText } from '../components/AnimatedText';

interface BrandIntroProps {
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

export const BrandIntro: React.FC<BrandIntroProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Geometric particles that converge
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const radius = 400;
    const convergence = spring({ frame: frame - i * 2, fps, config: { damping: 20, stiffness: 60 } });
    const startX = Math.cos(angle) * radius;
    const startY = Math.sin(angle) * radius;
    return {
      x: startX * (1 - convergence),
      y: startY * (1 - convergence),
      opacity: convergence,
      size: 4 + (i % 3) * 3,
      rotation: (1 - convergence) * 360,
    };
  });

  // Logo animation
  const logoScale = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 120 } });

  // Breathing animation (subtle scale oscillation after logo appears)
  const breathe = frame > 90
    ? 1 + Math.sin((frame - 90) / 15) * 0.02
    : 1;

  // Gradient wash sweep
  const washProgress = interpolate(frame, [150, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#050508' }}>
      {/* Subtle ambient glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${brand.primaryColor}0A 0%, transparent 50%)`,
        }}
      />

      {/* Geometric particles */}
      <Sequence from={0} durationInFrames={80}>
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {particles.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                backgroundColor: i % 2 === 0 ? brand.primaryColor : brand.accentColor,
                opacity: p.opacity * 0.8,
                transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`,
                borderRadius: i % 3 === 0 ? '50%' : '2px',
              }}
            />
          ))}
        </AbsoluteFill>
      </Sequence>

      {/* Logo */}
      <Sequence from={40} durationInFrames={120}>
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {brand.logoUrl ? (
            <Img
              src={brand.logoUrl}
              style={{
                width: 200,
                height: 200,
                objectFit: 'contain',
                opacity: logoScale,
                transform: `scale(${logoScale * breathe})`,
                filter: `drop-shadow(0 0 40px ${brand.primaryColor}44)`,
              }}
            />
          ) : (
            <div
              style={{
                opacity: logoScale,
                transform: `scale(${logoScale * breathe})`,
              }}
            >
              <span
                style={{
                  fontFamily: brand.fontHeading,
                  fontSize: 80,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: -2,
                }}
              >
                {brand.name}
              </span>
            </div>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* Slogan typewriter */}
      <Sequence from={110}>
        <div
          style={{
            position: 'absolute',
            bottom: 350,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <AnimatedText
            text={brand.slogan || content.headline || brand.name}
            mode="chars"
            charDelay={2}
            style={{
              fontFamily: brand.fontBody,
              fontSize: 32,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          />
        </div>
      </Sequence>

      {/* Gradient wash sweep */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.secondaryColor}, ${brand.accentColor})`,
          opacity: washProgress * 0.15,
        }}
      />

      {/* Bottom line */}
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          left: '50%',
          transform: 'translateX(-50%)',
          width: interpolate(frame, [130, 160], [0, 200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          height: 2,
          backgroundColor: brand.accentColor,
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};
