export interface BrandVideoProps {
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
  settings: {
    aspectRatio: '1:1' | '9:16' | '16:9';
    durationInFrames: number;
    fps: number;
  };
}

export interface GeneratedVideo {
  id: string;
  brand_id: string | null;
  template_id: string | null;
  title: string;
  description: string | null;
  ai_prompt: string | null;
  props: Record<string, unknown>;
  render_status: 'draft' | 'rendering' | 'completed' | 'failed';
  output_url: string | null;
  aspect_ratio: string;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export interface TopicSuggestion {
  id: string;
  brand_id: string;
  topic: string;
  headline: string | null;
  body_text: string | null;
  cta_text: string | null;
  hashtags: string[] | null;
  status: 'suggested' | 'approved' | 'used';
  created_at: string;
}
