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

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
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
  const headline = content?.headline || '';
  const subHeadline = content?.subHeadline || '';
  const bodyText = content?.bodyText || '';
  const ctaText = content?.ctaText || '';
  const logoUrl = brand?.logoUrl || '';
  const brandName = brand?.name || '';
  const mediaUrl = content?.mediaUrls?.[0] || '';

  // Parse features from body text
  const features = bodyText
    .split('\n')
    .filter(Boolean);
  if (features.length === 0 && bodyText) {
    features.push(bodyText);
  }

  // Headline words
  const words = headline.split(' ').filter(Boolean);

  // Bokeh circles
  const bokehCircles = Array.from({ length: 10 }, (_, i) => ({
    x: ((i * 237 + 80) % 1920),
    y: ((i * 173 + 60) % 1080),
    size: 30 + ((i * 17) % 80),
    baseOpacity: 0.04 + (i % 4) * 0.02,
    blurAmount: 10 + (i % 3) * 8,
    color: i % 3 === 0 ? accent : i % 3 === 1 ? primary : secondary,
  }));

  // Product image parallax zoom
  const imgScale = interpolate(frame, [0, 300], [1.0, 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const imgY = interpolate(frame, [0, 300], [0, -20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Logo fade
  const logoIn = spring({
    frame: frame - 5,
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  // Horizontal accent line
  const lineProgress = interpolate(frame, [10, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // CTA card slide up
  const ctaSlide = spring({
    frame: frame - 220,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      {/* Background radial brand glow on left */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 25% 50%, ${primary}18 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, ${secondary}10 0%, transparent 40%)`,
        }}
      />

      {/* Film grain */}
      <AbsoluteFill
        style={{
          opacity: 0.03,
          mixBlendMode: 'overlay',
          zIndex: 50,
          pointerEvents: 'none',
        }}
      >
        <svg width="100%" height="100%">
          <filter id="grain-product">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              numOctaves={3}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-product)" />
        </svg>
      </AbsoluteFill>

      {/* Bokeh particles */}
      {bokehCircles.map((circle, i) => {
        const floatY = Math.sin(frame / (18 + i * 4)) * 12;
        const floatX = Math.cos(frame / (22 + i * 3)) * 6;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: circle.x + floatX,
              top: circle.y + floatY,
              width: circle.size,
              height: circle.size,
              borderRadius: '50%',
              backgroundColor: circle.color,
              opacity: circle.baseOpacity,
              filter: `blur(${circle.blurAmount}px)`,
            }}
          />
        );
      })}

      {/* Product image area -- left 55% */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 60,
          width: '52%',
          bottom: 60,
          borderRadius: 24,
          overflow: 'hidden',
        }}
      >
        {(() => {
          const containerIn = spring({
            frame,
            fps,
            config: { damping: 20, stiffness: 60 },
          });
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                opacity: containerIn,
                transform: `scale(${0.96 + containerIn * 0.04})`,
              }}
            >
              {mediaUrl ? (
                <Img
                  src={mediaUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${imgScale}) translateY(${imgY}px)`,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(135deg, ${primary}33, ${secondary}33)`,
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 22,
                      color: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    Product Image
                  </span>
                </div>
              )}
              {/* Subtle vignette */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(ellipse at center, transparent 50%, rgba(10,10,15,0.4) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          );
        })()}
      </div>

      {/* Right side content */}
      <div
        style={{
          position: 'absolute',
          right: 60,
          top: 60,
          width: '40%',
          bottom: 60,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 40,
          gap: 28,
        }}
      >
        {/* Logo small top-right */}
        {logoUrl ? (
          <div
            style={{
              opacity: logoIn,
              transform: `translateY(${(1 - logoIn) * -10}px)`,
              marginBottom: 12,
            }}
          >
            <Img
              src={logoUrl}
              style={{ width: 48, height: 48, objectFit: 'contain' }}
            />
          </div>
        ) : null}

        {/* Horizontal accent line */}
        <div
          style={{
            width: interpolate(lineProgress, [0, 1], [0, 50]),
            height: 3,
            backgroundColor: accent,
            borderRadius: 2,
          }}
        />

        {/* Headline -- stagger word reveal */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 14px' }}>
          {words.map((word, i) => {
            const wordIn = spring({
              frame: frame - 18 - i * 5,
              fps,
              config: { damping: 12, stiffness: 170 },
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 52,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                  opacity: wordIn,
                  transform: `translateY(${(1 - wordIn) * 20}px)`,
                  display: 'inline-block',
                  textShadow: '0 2px 16px rgba(0,0,0,0.3)',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Sub headline */}
        {subHeadline ? (
          <Sequence from={40}>
            {(() => {
              const subIn = spring({
                frame: frame - 40,
                fps,
                config: { damping: 15, stiffness: 90 },
              });
              return (
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 26,
                    color: accent,
                    fontWeight: 600,
                    opacity: subIn,
                    transform: `translateX(${(1 - subIn) * -20}px)`,
                  }}
                >
                  {subHeadline}
                </span>
              );
            })()}
          </Sequence>
        ) : null}

        {/* Feature bullets */}
        {features.length > 0 ? (
          <Sequence from={60}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {features.map((feature, i) => {
                const featureProgress = spring({
                  frame: frame - 65 - i * 10,
                  fps,
                  config: { damping: 13, stiffness: 160 },
                });
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      opacity: featureProgress,
                      transform: `translateX(${(1 - featureProgress) * -35}px)`,
                    }}
                  >
                    {/* Custom dot indicator */}
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: accent,
                        flexShrink: 0,
                        boxShadow: `0 0 12px ${accent}44`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: fonts.body,
                        fontSize: 22,
                        color: 'rgba(255,255,255,0.78)',
                        lineHeight: 1.4,
                      }}
                    >
                      {feature}
                    </span>
                  </div>
                );
              })}
            </div>
          </Sequence>
        ) : null}
      </div>

      {/* CTA glassmorphism card -- slides up from bottom */}
      {ctaText ? (
        <Sequence from={215}>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: 50,
              transform: `translateY(${(1 - ctaSlide) * 100}px)`,
              opacity: ctaSlide,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 20,
                padding: '20px 56px',
                borderRadius: 18,
                backgroundColor: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              }}
            >
              <span
                style={{
                  fontFamily: fonts.body,
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: 1,
                }}
              >
                {ctaText}
              </span>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: '#0A0A0F',
                  fontWeight: 900,
                }}
              >
                &#x2192;
              </div>
            </div>
          </div>
        </Sequence>
      ) : null}

      {/* Brand watermark bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 60,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 13,
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.12)',
            opacity: spring({
              frame: frame - 10,
              fps,
              config: { damping: 20, stiffness: 50 },
            }),
          }}
        >
          {brand?.slogan || brandName}
        </span>
      </div>
    </AbsoluteFill>
  );
};
