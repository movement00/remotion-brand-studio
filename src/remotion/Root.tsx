import React from 'react';
import { Composition } from 'remotion';
import { SocialPost } from './compositions/SocialPost';
import { StoryAd } from './compositions/StoryAd';
import { ProductShowcase } from './compositions/ProductShowcase';
import { TestimonialCard } from './compositions/TestimonialCard';
import { NewsHighlight } from './compositions/NewsHighlight';
import { CountdownPromo } from './compositions/CountdownPromo';
import { BeforeAfter } from './compositions/BeforeAfter';
import { BrandIntro } from './compositions/BrandIntro';

const defaultBrand = {
  name: 'Marka Adı',
  logoUrl: '',
  primaryColor: '#3B82F6',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',
  fontHeading: 'Poppins',
  fontBody: 'Inter',
  slogan: 'Markanızın Sloganı',
};

const defaultContent = {
  headline: 'Ana Başlık Buraya',
  subHeadline: 'Alt başlık metni',
  bodyText: 'Açıklama metni buraya gelecek.',
  ctaText: 'Hemen Keşfet',
  mediaUrls: [] as string[],
};

const defaultProps = { brand: defaultBrand, content: defaultContent };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const comp = (c: React.ComponentType<any>) => c;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="SocialPost"
      component={comp(SocialPost)}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={defaultProps}
    />
    <Composition
      id="StoryAd"
      component={comp(StoryAd)}
      durationInFrames={240}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
    />
    <Composition
      id="ProductShowcase"
      component={comp(ProductShowcase)}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={defaultProps}
    />
    <Composition
      id="TestimonialCard"
      component={comp(TestimonialCard)}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={defaultProps}
    />
    <Composition
      id="NewsHighlight"
      component={comp(NewsHighlight)}
      durationInFrames={210}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={defaultProps}
    />
    <Composition
      id="CountdownPromo"
      component={comp(CountdownPromo)}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
    />
    <Composition
      id="BeforeAfter"
      component={comp(BeforeAfter)}
      durationInFrames={240}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={defaultProps}
    />
    <Composition
      id="BrandIntro"
      component={comp(BrandIntro)}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={defaultProps}
    />
  </>
);
