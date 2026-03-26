export interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_heading: string;
  font_body: string;
  slogan: string | null;
  sector: string | null;
  description: string | null;
  output_language: 'tr' | 'en';
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface BrandAsset {
  id: string;
  brand_id: string;
  type: 'image' | 'video' | 'audio' | 'font';
  url: string;
  filename: string;
  file_size: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
}
