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
import { GradientBackground } from '../components/GradientBackground';

interface SocialPostProps {
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

export const SocialPost: React.FC<SocialPostProps> = ({ brand, content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaScale = spring({
    frame: frame - 100,
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  return (
    <AbsoluteFill>
      <GradientBackground
        colors={[brand.primaryColor, brand.secondaryColor, brand.accentColor]}
        pattern="mesh"
        animated
      />

      {/* Grid overlay */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Logo top-right */}
      <div style={{ position: 'absolute', top: 40, right: 40 }}>
        <LogoReveal logoUrl={brand.logoUrl} size={80} startFrame={5} />
      </div>

      {/* Main Content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
        }}
      >
        {/* Headline */}
        <Sequence from={20}>
          <AnimatedText
            text={content.headline}
            mode="words"
            charDelay={4}
            style={{
              fontFamily: brand.fontHeading,
              fontSize: 72,
              fontWeight: 800,
              color: '#FFFFFF',
              textAlign: 'center',
              lineHeight: 1.1,
              textShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}
          />
        </Sequence>

        {/* Body text */}
        <Sequence from={60}>
          <AnimatedText
            text={content.bodyText || ''}
            mode="line"
            startFrame={0}
            style={{
              fontFamily: brand.fontBody,
              fontSize: 32,
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'center',
              marginTop: 30,
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          />
        </Sequence>

        {/* CTA Button */}
        {content.ctaText && (
          <Sequence from={90}>
            <div
              style={{
                marginTop: 50,
                padding: '18px 50px',
                backgroundColor: brand.accentColor,
                borderRadius: 50,
                opacity: ctaScale,
                transform: `scale(${ctaScale})`,
              }}
            >
              <span
                style={{
                  fontFamily: brand.fontBody,
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: 1,
                }}
              >
                {content.ctaText}
              </span>
            </div>
          </Sequence>
        )}
      </AbsoluteFill>

      {/* Brand name bottom */}
      <Sequence from={110}>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <AnimatedText
            text={brand.slogan || brand.name}
            mode="line"
            style={{
              fontFamily: brand.fontBody,
              fontSize: 20,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
