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

interface NewsHighlightProps {
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

export const NewsHighlight: React.FC<NewsHighlightProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const fonts = loadBrandFonts(brand?.fontHeading || 'Poppins', brand?.fontBody || 'Inter');

  const primaryColor = brand?.primaryColor || '#1E3A5F';
  const accentColor = brand?.accentColor || '#E63946';
  const headline = content?.headline || 'Gelişen Haber';
  const subHeadline = content?.subHeadline || content?.bodyText || '';
  const brandName = brand?.name || 'Haber';
  const ctaText = content?.ctaText || 'Detaylar için takipte kalın';

  // --- Animations ---
  const bannerSlide = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.8 },
  });

  const headlineSlide = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 11, stiffness: 140, overshootClamping: false },
  });

  const subHeadlineOpacity = spring({
    frame: Math.max(0, frame - 70),
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const subLetterSpacing = interpolate(
    spring({ frame: Math.max(0, frame - 70), fps, config: { damping: 18, stiffness: 80 } }),
    [0, 1],
    [12, 1]
  );

  const accentLineWidth = interpolate(
    spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 16, stiffness: 120 } }),
    [0, 1],
    [0, 160]
  );

  const timestampOpacity = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const logoContainerOpacity = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const logoScale = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 10, stiffness: 140 },
  });

  // Ticker
  const tickerText = content?.bodyText || `${brandName} — ${headline} — ${ctaText}`;
  const tickerWidth = tickerText.length * 22;
  const tickerX = interpolate(frame, [0, 210], [width + 100, -tickerWidth * 2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ticker bar slide up
  const tickerBarSlide = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 16, stiffness: 160 },
  });

  // Category badge
  const badgeScale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // Decorative diagonal lines opacity
  const decorOpacity = interpolate(frame, [0, 30], [0, 0.15], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0C0C14', overflow: 'hidden' }}>
      {/* Dark textured background with grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Subtle vignette */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Decorative diagonal lines - top left */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 200,
          height: 200,
          opacity: decorOpacity,
          overflow: 'hidden',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={`tl-${i}`}
            style={{
              position: 'absolute',
              top: 20 + i * 18,
              left: -20 + i * 18,
              width: 80,
              height: 2,
              backgroundColor: accentColor,
              transform: 'rotate(-45deg)',
              transformOrigin: 'left center',
            }}
          />
        ))}
      </div>

      {/* Decorative diagonal lines - bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          right: 0,
          width: 200,
          height: 200,
          opacity: decorOpacity,
          overflow: 'hidden',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={`br-${i}`}
            style={{
              position: 'absolute',
              bottom: 20 + i * 18,
              right: -20 + i * 18,
              width: 80,
              height: 2,
              backgroundColor: primaryColor,
              transform: 'rotate(-45deg)',
              transformOrigin: 'right center',
            }}
          />
        ))}
      </div>

      {/* Red "SON DAKİKA" banner */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          height: 56,
          backgroundColor: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 36,
          paddingRight: 40,
          transform: `translateX(${interpolate(bannerSlide, [0, 1], [-500, 0])}px)`,
          zIndex: 10,
          boxShadow: '4px 4px 24px rgba(220, 38, 38, 0.4), 0 0 60px rgba(220, 38, 38, 0.15)',
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 100%, 0 100%)',
        }}
      >
        <span
          style={{
            fontFamily: fonts.heading,
            fontSize: 22,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: 4,
            textTransform: 'uppercase',
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          SON DAKİKA
        </span>
      </div>

      {/* Accent line below banner */}
      <div
        style={{
          position: 'absolute',
          top: 116,
          left: 0,
          width: accentLineWidth,
          height: 3,
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}00)`,
          boxShadow: `0 0 12px ${accentColor}66`,
        }}
      />

      {/* Logo with glassmorphism container - top right */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          right: 40,
          opacity: logoContainerOpacity,
          transform: `scale(${logoScale})`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          {brand?.logoUrl ? (
            <Img
              src={brand.logoUrl}
              style={{
                width: 52,
                height: 52,
                objectFit: 'contain',
              }}
            />
          ) : (
            <span
              style={{
                fontFamily: fonts.heading,
                fontSize: 28,
                fontWeight: 900,
                color: '#FFFFFF',
              }}
            >
              {brandName.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Timestamp top-right below logo */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          right: 40,
          opacity: timestampOpacity,
          textAlign: 'right',
        }}
      >
        <span
          style={{
            fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
            fontSize: 15,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: 1,
          }}
        >
          {new Date().toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}{' '}
          •{' '}
          <span style={{ color: '#DC2626', fontWeight: 700 }}>CANLI</span>
        </span>
      </div>

      {/* Main headline */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 80,
          right: 120,
          transform: `translateX(${interpolate(headlineSlide, [0, 1], [400, 0])}px)`,
          opacity: headlineSlide,
        }}
      >
        <h1
          style={{
            fontFamily: fonts.heading,
            fontSize: 76,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.08,
            maxWidth: 1100,
            margin: 0,
            textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)',
            letterSpacing: -1,
          }}
        >
          {headline}
        </h1>
      </div>

      {/* Sub-headline */}
      <Sequence from={65}>
        <div
          style={{
            position: 'absolute',
            top: 460,
            left: 80,
            right: 200,
            opacity: subHeadlineOpacity,
          }}
        >
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: 30,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6,
              maxWidth: 900,
              margin: 0,
              letterSpacing: subLetterSpacing,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            {subHeadline || 'Detaylar gelmeye devam ediyor...'}
          </p>
        </div>
      </Sequence>

      {/* Bottom ticker bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          backgroundColor: primaryColor,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          transform: `translateY(${interpolate(tickerBarSlide, [0, 1], [64, 0])}px)`,
          boxShadow: '0 -4px 30px rgba(0,0,0,0.4)',
        }}
      >
        {/* Category badge */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 140,
            height: '100%',
            backgroundColor: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            transform: `scale(${badgeScale})`,
            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 100%, 0 100%)',
            boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
          }}
        >
          <span
            style={{
              fontFamily: fonts.heading,
              fontSize: 14,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            GÜNDEM
          </span>
        </div>

        {/* Scrolling ticker text */}
        <div
          style={{
            position: 'absolute',
            left: tickerX,
            whiteSpace: 'nowrap',
            fontFamily: fonts.body,
            fontSize: 22,
            color: '#FFFFFF',
            fontWeight: 500,
            paddingLeft: 160,
            textShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        >
          {tickerText}
          {'   \u2022   '}
          {tickerText}
          {'   \u2022   '}
          {tickerText}
        </div>
      </div>

      {/* Noise/grain overlay */}
      <AbsoluteFill style={{ opacity: 0.04, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          <filter id="grain-news">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-news)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
