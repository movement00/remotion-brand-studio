import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from 'remotion';
import { AnimatedText } from '../components/AnimatedText';

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

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const quoteIn = spring({ frame: frame - 20, fps, config: { damping: 10, stiffness: 120 } });
  const stars = 5;
  const customerName = content.subHeadline || 'Mutlu Musteri';
  const testimonial = content.bodyText || content.headline;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      {/* Subtle brand color glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${brand.primaryColor}15 0%, transparent 60%)`,
        }}
      />

      {/* Card */}
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
            backgroundColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: 30,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 70,
            opacity: cardIn,
            transform: `scale(${0.95 + cardIn * 0.05})`,
            display: 'flex',
            flexDirection: 'column',
            gap: 30,
          }}
        >
          {/* Quote marks */}
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 120,
              color: brand.accentColor,
              lineHeight: 0.5,
              opacity: quoteIn,
              transform: `scale(${quoteIn})`,
            }}
          >
            &ldquo;
          </div>

          {/* Testimonial text - typewriter */}
          <Sequence from={30}>
            <AnimatedText
              text={testimonial}
              mode="chars"
              charDelay={1}
              style={{
                fontFamily: brand.fontBody,
                fontSize: 34,
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}
            />
          </Sequence>

          {/* Star rating */}
          <Sequence from={100}>
            <div style={{ display: 'flex', gap: 8 }}>
              {Array.from({ length: stars }).map((_, i) => {
                const starProgress = spring({
                  frame: frame - 100 - i * 6,
                  fps,
                  config: { damping: 8, stiffness: 200 },
                });
                return (
                  <span
                    key={i}
                    style={{
                      fontSize: 36,
                      opacity: starProgress,
                      transform: `scale(${starProgress}) rotate(${(1 - starProgress) * 180}deg)`,
                      display: 'inline-block',
                      color: brand.accentColor,
                    }}
                  >
                    ★
                  </span>
                );
              })}
            </div>
          </Sequence>

          {/* Customer info */}
          <Sequence from={130}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <AnimatedText
                text={customerName}
                mode="line"
                style={{
                  fontFamily: brand.fontHeading,
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              />
              <AnimatedText
                text={content.ctaText || brand.name}
                mode="line"
                startFrame={5}
                style={{
                  fontFamily: brand.fontBody,
                  fontSize: 20,
                  color: brand.primaryColor,
                }}
              />
            </div>
          </Sequence>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
