import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  interpolate,
} from 'remotion';
import { loadBrandFonts } from '../utils/fonts';

interface CountdownPromoProps {
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

export const CountdownPromo: React.FC<CountdownPromoProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fonts = loadBrandFonts(brand?.fontHeading || 'Poppins', brand?.fontBody || 'Inter');

  const primaryColor = brand?.primaryColor || '#1E3A5F';
  const secondaryColor = brand?.secondaryColor || '#2D5A8E';
  const accentColor = brand?.accentColor || '#E63946';
  const brandName = brand?.name || 'Marka';
  const headline = content?.headline || 'Büyük Kampanya Başlıyor';
  const subText = content?.subHeadline || 'Gün Kaldı';
  const bodyText = content?.bodyText || 'Kampanyayı kaçırma!';
  const ctaText = content?.ctaText || 'Hemen Al';

  // --- Countdown logic ---
  const countdownValue = Math.max(0, 10 - Math.floor(frame / 30));
  const frameInCycle = frame % 30;

  // Number entrance spring per cycle
  const numberEntrance = spring({
    frame: frameInCycle,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.6 },
  });

  // Shake on number change
  const shakeIntensity = frameInCycle < 6 ? (6 - frameInCycle) / 6 : 0;
  const shakeX = Math.sin(frameInCycle * 14) * 4 * shakeIntensity;
  const shakeY = Math.cos(frameInCycle * 11) * 2 * shakeIntensity;

  // Urgency scale increases over time
  const urgencyScale = interpolate(frame, [0, 300], [1, 1.12], { extrapolateRight: 'clamp' });

  // Pulsing glow
  const glowPulse = Math.sin(frame / 7) * 0.4 + 0.6;

  // Pulsing ring around number
  const ringScale = 1 + Math.sin(frame / 10) * 0.06;
  const ringOpacity = 0.2 + Math.sin(frame / 8) * 0.15;

  // Background radial pulse
  const bgPulse = 1 + Math.sin(frame / 20) * 0.03;

  // Brand name entrance
  const brandNameOpacity = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 80 },
  });

  // Headline word-by-word reveal
  const headlineWords = headline.split(' ');

  // Body text fade
  const bodyFade = spring({
    frame: Math.max(0, frame - 60),
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  // CTA entrance
  const ctaScale = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 8, stiffness: 140, mass: 0.7 },
  });

  const ctaOpacity = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A12', overflow: 'hidden' }}>
      {/* Animated radial gradient background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${primaryColor}CC 0%, ${secondaryColor}66 40%, #0A0A1200 70%)`,
          transform: `scale(${bgPulse})`,
        }}
      />

      {/* Secondary ambient glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 55%, ${accentColor}18 0%, transparent 50%)`,
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Brand name top center */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: brandNameOpacity,
        }}
      >
        <span
          style={{
            fontFamily: fonts.heading,
            fontSize: 24,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: 8,
            textTransform: 'uppercase',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
          }}
        >
          {brandName}
        </span>
      </div>

      {/* Headline - word by word spring reveal */}
      <Sequence from={10}>
        <div
          style={{
            position: 'absolute',
            top: 260,
            left: 60,
            right: 60,
            textAlign: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0 14px',
          }}
        >
          {headlineWords.map((word, i) => {
            const wordSpring = spring({
              frame: Math.max(0, frame - 10 - i * 5),
              fps,
              config: { damping: 11, stiffness: 160, mass: 0.7 },
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 52,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  lineHeight: 1.25,
                  opacity: wordSpring,
                  transform: `translateY(${interpolate(wordSpring, [0, 1], [30, 0])}px)`,
                  display: 'inline-block',
                  textShadow: '0 4px 40px rgba(0,0,0,0.6)',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </Sequence>

      {/* Pulsing ring around countdown */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: 340,
            height: 340,
            borderRadius: '50%',
            border: `3px solid ${accentColor}`,
            opacity: ringOpacity,
            transform: `scale(${ringScale})`,
            boxShadow: `0 0 40px ${accentColor}33, inset 0 0 40px ${accentColor}11`,
          }}
        />
      </AbsoluteFill>

      {/* Second outer ring */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: 400,
            height: 400,
            borderRadius: '50%',
            border: `1px solid ${accentColor}44`,
            opacity: ringOpacity * 0.5,
            transform: `scale(${1 + Math.sin(frame / 14) * 0.04})`,
          }}
        />
      </AbsoluteFill>

      {/* MASSIVE countdown number */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${urgencyScale * numberEntrance}) translate(${shakeX}px, ${shakeY}px)`,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: fonts.heading,
              fontSize: 280,
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1,
              textShadow: `
                0 0 60px ${accentColor}${Math.round(glowPulse * 200)
                .toString(16)
                .padStart(2, '0')},
                0 0 120px ${accentColor}44,
                0 0 200px ${accentColor}22,
                0 4px 40px rgba(0,0,0,0.6)
              `,
              display: 'block',
            }}
          >
            {countdownValue}
          </span>

          {/* Subtext below number */}
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 34,
              color: 'rgba(255,255,255,0.7)',
              marginTop: -10,
              letterSpacing: 10,
              textTransform: 'uppercase',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            {subText}
          </div>
        </div>
      </AbsoluteFill>

      {/* Body text */}
      <Sequence from={60}>
        <div
          style={{
            position: 'absolute',
            bottom: 380,
            left: 60,
            right: 60,
            textAlign: 'center',
            opacity: bodyFade,
            transform: `translateY(${interpolate(bodyFade, [0, 1], [20, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: fonts.body,
              fontSize: 26,
              color: 'rgba(255,255,255,0.6)',
              textShadow: '0 2px 15px rgba(0,0,0,0.4)',
            }}
          >
            {bodyText}
          </span>
        </div>
      </Sequence>

      {/* CTA button */}
      <Sequence from={80}>
        <div
          style={{
            position: 'absolute',
            bottom: 220,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              padding: '24px 64px',
              backgroundColor: '#FFFFFF',
              borderRadius: 60,
              opacity: ctaOpacity,
              transform: `scale(${ctaScale})`,
              boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 60px ${accentColor}22`,
            }}
          >
            <span
              style={{
                fontFamily: fonts.heading,
                fontSize: 28,
                fontWeight: 800,
                color: primaryColor,
                letterSpacing: 1,
              }}
            >
              {ctaText}
            </span>
          </div>
        </div>
      </Sequence>

      {/* Noise/grain overlay */}
      <AbsoluteFill style={{ opacity: 0.04, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          <filter id="grain-countdown">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-countdown)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
