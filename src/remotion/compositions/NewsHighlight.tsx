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

interface NewsHighlightProps {
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

export const NewsHighlight: React.FC<NewsHighlightProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Red banner slide
  const bannerSlide = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });

  // Headline slide from right
  const headlineSlide = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 160 } });

  // Ticker scroll
  const tickerText = content.bodyText || `${brand.name} — ${content.headline} — ${content.ctaText || 'Detaylar için takipte kalın'}`;
  const tickerWidth = tickerText.length * 20;
  const tickerX = interpolate(frame, [0, 210], [width, -tickerWidth], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#111118' }}>
      {/* Background texture */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Red breaking news banner */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          height: 50,
          backgroundColor: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 30,
          paddingRight: 30,
          transform: `translateX(${(1 - bannerSlide) * -400}px)`,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: brand.fontHeading,
            fontSize: 22,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          SON DAKİKA
        </span>
      </div>

      {/* Logo */}
      <div style={{ position: 'absolute', top: 40, right: 40 }}>
        <LogoReveal logoUrl={brand.logoUrl} size={60} startFrame={10} />
      </div>

      {/* Timestamp */}
      <Sequence from={15}>
        <div
          style={{
            position: 'absolute',
            top: 100,
            right: 40,
            opacity: spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 100 } }),
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 16,
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {new Date().toLocaleDateString('tr-TR')} • CANLI
          </span>
        </div>
      </Sequence>

      {/* Main headline */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 80,
          right: 80,
          transform: `translateX(${(1 - headlineSlide) * 300}px)`,
          opacity: headlineSlide,
        }}
      >
        <h1
          style={{
            fontFamily: brand.fontHeading,
            fontSize: 72,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.1,
            maxWidth: 1200,
          }}
        >
          {content.headline}
        </h1>
      </div>

      {/* Sub headline */}
      <Sequence from={70}>
        <div
          style={{
            position: 'absolute',
            top: 450,
            left: 80,
            right: 80,
          }}
        >
          <AnimatedText
            text={content.subHeadline || content.bodyText || ''}
            mode="line"
            style={{
              fontFamily: brand.fontBody,
              fontSize: 32,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.5,
              maxWidth: 1000,
            }}
          />
        </div>
      </Sequence>

      {/* Accent line */}
      <div
        style={{
          position: 'absolute',
          top: 160,
          left: 80,
          width: 100 * bannerSlide,
          height: 4,
          backgroundColor: brand.accentColor,
        }}
      />

      {/* Bottom ticker */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: brand.primaryColor,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 120,
            height: '100%',
            backgroundColor: brand.accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: brand.fontHeading,
              fontSize: 14,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: 2,
            }}
          >
            GÜNDEM
          </span>
        </div>
        <div
          style={{
            position: 'absolute',
            left: tickerX,
            whiteSpace: 'nowrap',
            fontFamily: brand.fontBody,
            fontSize: 22,
            color: '#FFFFFF',
            paddingLeft: 140,
          }}
        >
          {tickerText} {'  •  '} {tickerText}
        </div>
      </div>
    </AbsoluteFill>
  );
};
