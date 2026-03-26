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

interface TestimonialCardProps {
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

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  brand,
  content,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fonts = loadBrandFonts(
    brand?.fontHeading || 'Poppins',
    brand?.fontBody || 'Inter'
  );

  const primary = brand?.primaryColor || '#3B82F6';
  const secondary = brand?.secondaryColor || '#1E293B';
  const accent = brand?.accentColor || '#F59E0B';
  const brandName = brand?.name || '';

  const testimonial = content?.bodyText || content?.headline || '';
  const customerName = content?.subHeadline || '';
  const companyName = content?.ctaText || brandName;
  const stars = 5;

  // Floating particles behind card
  const particles = Array.from({ length: 8 }, (_, i) => {
    const baseX = ((i * 157 + 100) % 1080);
    const baseY = ((i * 131 + 80) % 1080);
    const floatY = Math.sin(frame / (15 + i * 3)) * 10;
    const floatX = Math.cos(frame / (20 + i * 4)) * 6;
    const size = 3 + (i % 4) * 2;
    return { x: baseX + floatX, y: baseY + floatY, size };
  });

  // Card entrance
  const cardIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 70 },
  });

  // Quote mark
  const quoteIn = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  // Typewriter effect for testimonial
  const typewriterDelay = 25; // frames before typing starts
  const charsPerFrame = 0.7;
  const visibleChars = Math.max(
    0,
    Math.floor((frame - typewriterDelay) * charsPerFrame)
  );
  const displayedText = testimonial.slice(0, visibleChars);
  const showCursor =
    frame >= typewriterDelay && visibleChars < testimonial.length;
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  // Brand name fade
  const brandIn = spring({
    frame: frame - 145,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      {/* Subtle brand gradient glow in center */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${primary}12 0%, transparent 50%), radial-gradient(circle at 30% 70%, ${secondary}0A 0%, transparent 40%)`,
        }}
      />

      {/* Film grain */}
      <AbsoluteFill
        style={{
          opacity: 0.035,
          mixBlendMode: 'overlay',
          zIndex: 50,
          pointerEvents: 'none',
        }}
      >
        <svg width="100%" height="100%">
          <filter id="grain-testimonial">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves={3}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#grain-testimonial)"
          />
        </svg>
      </AbsoluteFill>

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: i % 2 === 0 ? accent : primary,
            opacity: 0.08,
            filter: 'blur(2px)',
          }}
        />
      ))}

      {/* Subtle radial rings */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 800,
          height: 800,
          borderRadius: '50%',
          border: `1px solid ${primary}08`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: `1px solid ${accent}06`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Main card */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
        }}
      >
        <div
          style={{
            width: 900,
            backgroundColor: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            borderRadius: 32,
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '65px 70px',
            opacity: cardIn,
            transform: `scale(${0.94 + cardIn * 0.06}) translateY(${(1 - cardIn) * 20}px)`,
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            boxShadow: `0 24px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Inner glow at top */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '10%',
              right: '10%',
              height: 1,
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)`,
            }}
          />

          {/* Giant decorative quote mark */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 30,
              fontFamily: 'Georgia, serif',
              fontSize: 200,
              color: accent,
              lineHeight: 0.8,
              opacity: quoteIn * 0.12,
              transform: `scale(${quoteIn}) rotate(${(1 - quoteIn) * -10}deg)`,
              transformOrigin: 'top left',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            &#x201C;
          </div>

          {/* Testimonial text -- typewriter */}
          <Sequence from={typewriterDelay}>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 32,
                color: 'rgba(255,255,255,0.88)',
                lineHeight: 1.65,
                fontStyle: 'italic',
                minHeight: 180,
                position: 'relative',
                zIndex: 2,
                paddingTop: 10,
              }}
            >
              {displayedText}
              {showCursor && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 2,
                    height: 32,
                    backgroundColor: accent,
                    marginLeft: 2,
                    verticalAlign: 'text-bottom',
                    opacity: cursorBlink ? 1 : 0,
                  }}
                />
              )}
            </div>
          </Sequence>

          {/* Star rating */}
          <Sequence from={100}>
            <div style={{ display: 'flex', gap: 8, zIndex: 2 }}>
              {Array.from({ length: stars }).map((_, i) => {
                const starProgress = spring({
                  frame: frame - 100 - i * 5,
                  fps,
                  config: { damping: 8, stiffness: 200 },
                });
                return (
                  <span
                    key={i}
                    style={{
                      fontSize: 34,
                      opacity: starProgress,
                      transform: `scale(${starProgress}) rotate(${(1 - starProgress) * 200}deg)`,
                      display: 'inline-block',
                      color: '#F59E0B',
                      textShadow: '0 0 12px rgba(245,158,11,0.3)',
                    }}
                  >
                    &#x2605;
                  </span>
                );
              })}
            </div>
          </Sequence>

          {/* Divider line */}
          <Sequence from={125}>
            <div
              style={{
                width: interpolate(
                  spring({
                    frame: frame - 125,
                    fps,
                    config: { damping: 15, stiffness: 100 },
                  }),
                  [0, 1],
                  [0, 120]
                ),
                height: 1,
                backgroundColor: 'rgba(255,255,255,0.08)',
                zIndex: 2,
              }}
            />
          </Sequence>

          {/* Customer info */}
          <Sequence from={130}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                zIndex: 2,
              }}
            >
              {/* Customer name */}
              {(() => {
                const nameProgress = spring({
                  frame: frame - 132,
                  fps,
                  config: { damping: 13, stiffness: 140 },
                });
                return (
                  <span
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: 28,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      opacity: nameProgress,
                      transform: `translateY(${(1 - nameProgress) * 12}px)`,
                      display: 'inline-block',
                    }}
                  >
                    {customerName || 'Happy Customer'}
                  </span>
                );
              })()}

              {/* Company name */}
              {(() => {
                const companyProgress = spring({
                  frame: frame - 140,
                  fps,
                  config: { damping: 14, stiffness: 120 },
                });
                return (
                  <span
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 20,
                      color: accent,
                      opacity: companyProgress,
                      transform: `translateY(${(1 - companyProgress) * 10}px)`,
                      display: 'inline-block',
                      letterSpacing: 1,
                    }}
                  >
                    {companyName}
                  </span>
                );
              })()}
            </div>
          </Sequence>
        </div>
      </AbsoluteFill>

      {/* Brand watermark bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 13,
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.1)',
            opacity: brandIn,
          }}
        >
          {brand?.slogan || brandName}
        </span>
      </div>
    </AbsoluteFill>
  );
};
