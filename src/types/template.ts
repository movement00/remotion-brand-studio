export interface VideoTemplate {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: 'social' | 'story' | 'product' | 'promo' | 'brand' | 'news';
  aspect_ratio: '1:1' | '9:16' | '16:9';
  duration_seconds: number;
  fps: number;
  thumbnail_url: string | null;
  schema: Record<string, unknown> | null;
  is_premium: boolean;
  created_at: string;
}

export const ASPECT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  '1:1': { width: 1080, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '16:9': { width: 1920, height: 1080 },
};

export const CATEGORY_LABELS: Record<string, string> = {
  social: 'Sosyal Medya',
  story: 'Story/Reels',
  product: 'Ürün Tanıtım',
  promo: 'Kampanya',
  brand: 'Marka',
  news: 'Haber/Duyuru',
};
