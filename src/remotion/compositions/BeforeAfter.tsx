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

interface BeforeAfterProps {
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

export const BeforeAfter: React.FC<BeforeAfterProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fonts = loadBrandFonts(brand?.fontHeading || 'Poppins', brand?.fontBody || 'Inter');

  const primaryColor = brand?.primaryColor || '#1E3A5F';
  const secondaryColor = brand?.secondaryColor || '#2D5A8E';
  const accentColor = brand?.accentColor || '#E63946';
  const headline = content?.headline || 'Dönüşümü Gör';
  const ctaText = content?.ctaText || 'İyileşme';

  // --- Title word animation ---
  const headlineWords = headline.split(' ');

  // --- Divider sweep: left to center ---
  const dividerProgress = interpolate(frame, [50, 160], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Divider travels from far left to center (540 = half of 1080)
  const dividerX = interpolate(dividerProgress, [0, 1], [-20, 500]);

  // --- Panel entrances ---
  const panelLeftOpacity = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 18, stiffness: 100 },
  });
  const panelLeftSlide = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const panelRightOpacity = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 18, stiffness: 100 },
  });
  const panelRightSlide = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // --- Label pill badges ---
  const labelBeforeSpring = spring({
    frame: Math.max(0, frame - 130),
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.6 },
  });
  const labelAfterSpring = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.6 },
  });

  // --- After panel glow ---
  const afterGlowPulse = frame > 160 ? 0.4 + Math.sin((frame - 160) / 6) * 0.3 : 0;

  // --- Counter animation ---
  const counterTarget = 95;
  const counterValue =
    frame > 180
      ? Math.min(
          counterTarget,
          Math.round(
            interpolate(frame, [180, 225], [0, counterTarget], {
              extrapolateRight: 'clamp',
            })
          )
        )
      : 0;

  const counterOpacity = spring({
    frame: Math.max(0, frame - 180),
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const counterScale = spring({
    frame: Math.max(0, frame - 180),
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  // --- Corner accents opacity ---
  const cornerOpacity = interpolate(frame, [0, 40], [0, 0.2], { extrapolateRight: 'clamp' });

  // Panel dimensions
  const panelW = 460;
  const panelH = 680;
  const panelGap = 30;
  const panelTop = 155;
  const panelLeftX = (1080 - panelW * 2 - panelGap) / 2;
  const panelRightX = panelLeftX + panelW + panelGap;

  return (
    <AbsoluteFill style={{ backgroundColor: '#08080E', overflow: 'hidden' }}>
      {/* Subtle radial ambient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${primaryColor}12 0%, transparent 60%)`,
        }}
      />

      {/* Decorative corner accents - top left L */}
      <div style={{ position: 'absolute', top: 20, left: 20, opacity: cornerOpacity }}>
        <div
          style={{
            width: 40,
            height: 3,
            backgroundColor: accentColor,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
        <div
          style={{
            width: 3,
            height: 40,
            backgroundColor: accentColor,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>

      {/* Top right L */}
      <div style={{ position: 'absolute', top: 20, right: 20, opacity: cornerOpacity }}>
        <div
          style={{
            width: 40,
            height: 3,
            backgroundColor: accentColor,
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        />
        <div
          style={{
            width: 3,
            height: 40,
            backgroundColor: accentColor,
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        />
      </div>

      {/* Bottom left L */}
      <div style={{ position: 'absolute', bottom: 20, left: 20, opacity: cornerOpacity }}>
        <div
          style={{
            width: 40,
            height: 3,
            backgroundColor: accentColor,
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}
        />
        <div
          style={{
            width: 3,
            height: 40,
            backgroundColor: accentColor,
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}
        />
      </div>

      {/* Bottom right L */}
      <div style={{ position: 'absolute', bottom: 20, right: 20, opacity: cornerOpacity }}>
        <div
          style={{
            width: 40,
            height: 3,
            backgroundColor: accentColor,
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        />
        <div
          style={{
            width: 3,
            height: 40,
            backgroundColor: accentColor,
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        />
      </div>

      {/* Title at top with spring word animation */}
      <Sequence from={5}>
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          {headlineWords.map((word, i) => {
            const wordSpring = spring({
              frame: Math.max(0, frame - 5 - i * 5),
              fps,
              config: { damping: 10, stiffness: 160, mass: 0.6 },
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 50,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  opacity: wordSpring,
                  transform: `translateY(${interpolate(wordSpring, [0, 1], [40, 0])}px)`,
                  display: 'inline-block',
                  textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </Sequence>

      {/* Before panel (left) */}
      <div
        style={{
          position: 'absolute',
          top: panelTop,
          left: panelLeftX,
          width: panelW,
          height: panelH,
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          opacity: panelLeftOpacity,
          transform: `translateX(${interpolate(panelLeftSlide, [0, 1], [-60, 0])}px)`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {content?.mediaUrls?.[0] ? (
          <Img
            src={content.mediaUrls[0]}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(170deg, ${secondaryColor}88 0%, #1a1a2e 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                color: 'rgba(255,255,255,0.15)',
                fontSize: 22,
                fontFamily: fonts.body,
                letterSpacing: 4,
                textTransform: 'uppercase',
              }}
            >
              \u00D6ncesi
            </span>
          </div>
        )}

        {/* Subtle dark overlay at bottom for label */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          }}
        />

        {/* "ÖNCESİ" label pill */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 24,
            padding: '10px 24px',
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 40,
            border: '1px solid rgba(255,255,255,0.1)',
            opacity: labelBeforeSpring,
            transform: `translateY(${interpolate(labelBeforeSpring, [0, 1], [20, 0])}px) scale(${labelBeforeSpring})`,
          }}
        >
          <span
            style={{
              fontFamily: fonts.heading,
              fontSize: 16,
              color: '#FFFFFF',
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            \u00D6NCES\u0130
          </span>
        </div>
      </div>

      {/* After panel (right) */}
      <div
        style={{
          position: 'absolute',
          top: panelTop,
          left: panelRightX,
          width: panelW,
          height: panelH,
          borderRadius: 20,
          overflow: 'hidden',
          border: `2px solid ${accentColor}${Math.round(afterGlowPulse * 255)
            .toString(16)
            .padStart(2, '0')}`,
          opacity: panelRightOpacity,
          transform: `translateX(${interpolate(panelRightSlide, [0, 1], [60, 0])}px)`,
          boxShadow:
            afterGlowPulse > 0
              ? `0 0 40px ${accentColor}44, 0 0 80px ${accentColor}18, 0 20px 60px rgba(0,0,0,0.4)`
              : '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {content?.mediaUrls?.[1] ? (
          <Img
            src={content.mediaUrls[1]}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(170deg, ${primaryColor} 0%, ${accentColor}88 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                color: 'rgba(255,255,255,0.15)',
                fontSize: 22,
                fontFamily: fonts.body,
                letterSpacing: 4,
                textTransform: 'uppercase',
              }}
            >
              Sonras\u0131
            </span>
          </div>
        )}

        {/* Subtle dark overlay at bottom for label */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          }}
        />

        {/* "SONRASI" label pill */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            padding: '10px 24px',
            backgroundColor: accentColor,
            borderRadius: 40,
            opacity: labelAfterSpring,
            transform: `translateY(${interpolate(labelAfterSpring, [0, 1], [20, 0])}px) scale(${labelAfterSpring})`,
            boxShadow: `0 4px 20px ${accentColor}66`,
          }}
        >
          <span
            style={{
              fontFamily: fonts.heading,
              fontSize: 16,
              color: '#FFFFFF',
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            SONRASI
          </span>
        </div>
      </div>

      {/* Center divider line - sweeps left to right */}
      <div
        style={{
          position: 'absolute',
          top: panelTop - 10,
          left: panelLeftX + dividerX,
          width: 4,
          height: panelH + 20,
          backgroundColor: '#FFFFFF',
          zIndex: 20,
          borderRadius: 2,
          boxShadow: '0 0 24px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.2)',
          opacity: interpolate(frame, [45, 55], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {/* Divider handle circle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 3,
            }}
          >
            <div style={{ width: 2, height: 14, backgroundColor: '#333', borderRadius: 1 }} />
            <div style={{ width: 2, height: 14, backgroundColor: '#333', borderRadius: 1 }} />
          </div>
        </div>
      </div>

      {/* Stats counter at bottom */}
      <Sequence from={180}>
        <div
          style={{
            position: 'absolute',
            bottom: 55,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 12,
            opacity: counterOpacity,
            transform: `scale(${counterScale})`,
          }}
        >
          <span
            style={{
              fontFamily: fonts.heading,
              fontSize: 56,
              fontWeight: 900,
              color: accentColor,
              textShadow: `0 0 30px ${accentColor}44`,
              lineHeight: 1,
            }}
          >
            %{counterValue}
          </span>
          <span
            style={{
              fontFamily: fonts.body,
              fontSize: 22,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 500,
              letterSpacing: 2,
            }}
          >
            {ctaText}
          </span>
        </div>
      </Sequence>

      {/* Noise/grain overlay */}
      <AbsoluteFill style={{ opacity: 0.04, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          <filter id="grain-ba">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-ba)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
