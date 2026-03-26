'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import type { Brand } from '@/types/brand';
import type { VideoTemplate } from '@/types/template';
import { ASPECT_DIMENSIONS } from '@/types/template';
import {
  Sparkles, Save, Play, Pause, RotateCcw,
  Type, Image, Settings, Palette, Wand2, Loader2
} from 'lucide-react';

// Dynamically import compositions
const SocialPost = dynamic(() => import('@/remotion/compositions/SocialPost').then(m => ({ default: m.SocialPost })), { ssr: false });
const StoryAd = dynamic(() => import('@/remotion/compositions/StoryAd').then(m => ({ default: m.StoryAd })), { ssr: false });
const ProductShowcase = dynamic(() => import('@/remotion/compositions/ProductShowcase').then(m => ({ default: m.ProductShowcase })), { ssr: false });
const TestimonialCard = dynamic(() => import('@/remotion/compositions/TestimonialCard').then(m => ({ default: m.TestimonialCard })), { ssr: false });
const NewsHighlight = dynamic(() => import('@/remotion/compositions/NewsHighlight').then(m => ({ default: m.NewsHighlight })), { ssr: false });
const CountdownPromo = dynamic(() => import('@/remotion/compositions/CountdownPromo').then(m => ({ default: m.CountdownPromo })), { ssr: false });
const BeforeAfter = dynamic(() => import('@/remotion/compositions/BeforeAfter').then(m => ({ default: m.BeforeAfter })), { ssr: false });
const BrandIntro = dynamic(() => import('@/remotion/compositions/BrandIntro').then(m => ({ default: m.BrandIntro })), { ssr: false });

// Dynamically import Player
const Player = dynamic(
  () => import('@remotion/player').then((m) => m.Player),
  { ssr: false }
);

const TEMPLATE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'social-post': SocialPost,
  'story-ad': StoryAd,
  'product-showcase': ProductShowcase,
  'testimonial-card': TestimonialCard,
  'news-highlight': NewsHighlight,
  'countdown-promo': CountdownPromo,
  'before-after': BeforeAfter,
  'brand-intro': BrandIntro,
};

const TEMPLATE_CONFIGS: Record<string, { fps: number; duration: number; ratio: string }> = {
  'social-post': { fps: 30, duration: 150, ratio: '1:1' },
  'story-ad': { fps: 30, duration: 240, ratio: '9:16' },
  'product-showcase': { fps: 30, duration: 300, ratio: '16:9' },
  'testimonial-card': { fps: 30, duration: 180, ratio: '1:1' },
  'news-highlight': { fps: 30, duration: 210, ratio: '16:9' },
  'countdown-promo': { fps: 30, duration: 300, ratio: '9:16' },
  'before-after': { fps: 30, duration: 240, ratio: '1:1' },
  'brand-intro': { fps: 30, duration: 180, ratio: '16:9' },
};

function CreatePageContent() {
  const searchParams = useSearchParams();
  const templateSlug = searchParams.get('template') || 'social-post';
  const brandId = searchParams.get('brand') || '';
  const prefillHeadline = searchParams.get('headline') || '';
  const prefillBody = searchParams.get('body') || '';
  const prefillCta = searchParams.get('cta') || '';

  const [brands, setBrands] = useState<Brand[]>([]);
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [selectedBrand, setSelectedBrand] = useState(brandId);
  const [selectedTemplate, setSelectedTemplate] = useState(templateSlug);
  const [activeTab, setActiveTab] = useState('content');
  const [saving, setSaving] = useState(false);
  const [aiExpanding, setAiExpanding] = useState(false);
  const [description, setDescription] = useState('');

  const [brandProps, setBrandProps] = useState({
    name: 'Marka',
    logoUrl: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E293B',
    accentColor: '#F59E0B',
    fontHeading: 'Poppins',
    fontBody: 'Inter',
    slogan: '',
  });

  const [contentProps, setContentProps] = useState({
    headline: prefillHeadline || 'Ana Başlık Buraya',
    subHeadline: '',
    bodyText: prefillBody || 'Açıklama metni buraya gelecek.',
    ctaText: prefillCta || 'Hemen Keşfet',
    mediaUrls: [] as string[],
  });

  useEffect(() => {
    async function load() {
      const [brandsRes, templatesRes] = await Promise.all([
        supabase.from('brands').select('*').order('name'),
        supabase.from('templates').select('*').order('name'),
      ]);
      setBrands(brandsRes.data || []);
      setTemplates(templatesRes.data || []);
    }
    load();
  }, []);

  // When brand changes, update brandProps
  useEffect(() => {
    if (selectedBrand) {
      const brand = brands.find(b => b.id === selectedBrand);
      if (brand) {
        setBrandProps({
          name: brand.name,
          logoUrl: brand.logo_url || '',
          primaryColor: brand.primary_color,
          secondaryColor: brand.secondary_color,
          accentColor: brand.accent_color,
          fontHeading: brand.font_heading,
          fontBody: brand.font_body,
          slogan: brand.slogan || '',
        });
      }
    }
  }, [selectedBrand, brands]);

  const config = TEMPLATE_CONFIGS[selectedTemplate] || TEMPLATE_CONFIGS['social-post'];
  const dimensions = ASPECT_DIMENSIONS[config.ratio] || ASPECT_DIMENSIONS['1:1'];
  const CompositionComponent = TEMPLATE_COMPONENTS[selectedTemplate] || SocialPost;

  const inputProps = useMemo(() => ({
    brand: brandProps,
    content: contentProps,
  }), [brandProps, contentProps]);

  async function handleAIExpand() {
    if (!description.trim()) return;
    setAiExpanding(true);
    // For now, mock the expansion
    setTimeout(() => {
      setContentProps(prev => ({
        ...prev,
        headline: description.split(' ').slice(0, 5).join(' '),
        bodyText: description,
        ctaText: 'Hemen İncele',
      }));
      setAiExpanding(false);
    }, 1500);
  }

  async function handleSave() {
    setSaving(true);
    await supabase.from('generated_videos').insert([{
      brand_id: selectedBrand || null,
      template_id: templates.find(t => t.slug === selectedTemplate)?.id || null,
      title: contentProps.headline || 'Untitled Video',
      description: description || null,
      props: inputProps,
      aspect_ratio: config.ratio,
      duration_seconds: config.duration / config.fps,
      render_status: 'draft',
    }]);
    setSaving(false);
    alert('Video taslak olarak kaydedildi!');
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    borderRadius: 10,
    padding: '8px 14px',
    fontSize: 13,
    width: '100%',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: 4,
    display: 'block',
  };

  // Calculate preview container sizing
  const previewMaxHeight = 600;
  const aspectRatio = dimensions.width / dimensions.height;
  let previewWidth: number;
  let previewHeight: number;
  if (aspectRatio >= 1) {
    previewHeight = Math.min(previewMaxHeight, 500);
    previewWidth = previewHeight * aspectRatio;
  } else {
    previewHeight = previewMaxHeight;
    previewWidth = previewHeight * aspectRatio;
  }

  const tabs = [
    { id: 'content', icon: Type, label: 'İçerik' },
    { id: 'brand', icon: Palette, label: 'Marka' },
    { id: 'media', icon: Image, label: 'Medya' },
    { id: 'settings', icon: Settings, label: 'Ayarlar' },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Video Oluştur"
        subtitle="AI ile profesyonel video üretin"
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            <Save size={16} />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        }
      />

      <div className="flex h-[calc(100vh-85px)]">
        {/* Left: Preview */}
        <div className="flex-1 flex flex-col items-center justify-center p-6"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          {/* AI Description bar */}
          <div className="w-full max-w-2xl mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nasıl bir video istiyorsunuz? Açıklayın..."
                style={{ ...inputStyle, flex: 1 }}
                onKeyDown={(e) => e.key === 'Enter' && handleAIExpand()}
              />
              <button
                onClick={handleAIExpand}
                disabled={aiExpanding || !description.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent-amber)', color: 'black' }}
              >
                {aiExpanding ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                AI Genişlet
              </button>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Videonuzu doğal dilde anlatın, AI detaylandırsın
            </p>
          </div>

          {/* Player */}
          <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}>
            {typeof window !== 'undefined' && CompositionComponent && (
              <Player
                component={CompositionComponent}
                compositionWidth={dimensions.width}
                compositionHeight={dimensions.height}
                durationInFrames={config.duration}
                fps={config.fps}
                inputProps={inputProps}
                style={{ width: previewWidth, height: previewHeight }}
                controls
                autoPlay
                loop
              />
            )}
          </div>
        </div>

        {/* Right: Editor Panel */}
        <div className="w-96 border-l flex flex-col"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
        >
          {/* Template & Brand selectors */}
          <div className="p-4 space-y-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <label style={labelStyle}>Şablon</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                style={inputStyle}
              >
                {Object.keys(TEMPLATE_COMPONENTS).map(slug => (
                  <option key={slug} value={slug}>
                    {templates.find(t => t.slug === slug)?.name || slug}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Marka</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={inputStyle}
              >
                <option value="">Marka seçin...</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all"
                  style={{
                    color: activeTab === tab.id ? 'var(--accent-blue)' : 'var(--text-muted)',
                    borderBottom: activeTab === tab.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'content' && (
              <>
                <div>
                  <label style={labelStyle}>Ana Başlık</label>
                  <input
                    type="text"
                    value={contentProps.headline}
                    onChange={(e) => setContentProps(p => ({ ...p, headline: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Alt Başlık</label>
                  <input
                    type="text"
                    value={contentProps.subHeadline}
                    onChange={(e) => setContentProps(p => ({ ...p, subHeadline: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Gövde Metni</label>
                  <textarea
                    value={contentProps.bodyText}
                    onChange={(e) => setContentProps(p => ({ ...p, bodyText: e.target.value }))}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>CTA Metni</label>
                  <input
                    type="text"
                    value={contentProps.ctaText}
                    onChange={(e) => setContentProps(p => ({ ...p, ctaText: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            {activeTab === 'brand' && (
              <>
                <div>
                  <label style={labelStyle}>Marka Adı</label>
                  <input
                    type="text"
                    value={brandProps.name}
                    onChange={(e) => setBrandProps(p => ({ ...p, name: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Slogan</label>
                  <input
                    type="text"
                    value={brandProps.slogan}
                    onChange={(e) => setBrandProps(p => ({ ...p, slogan: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Renkler</label>
                  <div className="space-y-2">
                    {[
                      { key: 'primaryColor' as const, label: 'Ana' },
                      { key: 'secondaryColor' as const, label: 'İkincil' },
                      { key: 'accentColor' as const, label: 'Vurgu' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandProps[key]}
                          onChange={(e) => setBrandProps(p => ({ ...p, [key]: e.target.value }))}
                          className="w-8 h-8 rounded cursor-pointer border-0"
                        />
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                        <span className="text-xs font-mono ml-auto" style={{ color: 'var(--text-muted)' }}>
                          {brandProps[key]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Logo URL</label>
                  <input
                    type="text"
                    value={brandProps.logoUrl}
                    onChange={(e) => setBrandProps(p => ({ ...p, logoUrl: e.target.value }))}
                    placeholder="https://..."
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            {activeTab === 'media' && (
              <div>
                <label style={labelStyle}>Medya URL&apos;leri</label>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  Resim veya video URL&apos;lerini ekleyin (her satıra bir URL)
                </p>
                <textarea
                  value={contentProps.mediaUrls.join('\n')}
                  onChange={(e) => setContentProps(p => ({
                    ...p,
                    mediaUrls: e.target.value.split('\n').filter(Boolean),
                  }))}
                  rows={5}
                  placeholder="https://example.com/image.jpg"
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  Supabase Storage entegrasyonu yakında eklenecek.
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <>
                <div>
                  <label style={labelStyle}>Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1:1', '9:16', '16:9'].map(ratio => {
                      const templateForRatio = Object.entries(TEMPLATE_CONFIGS).find(
                        ([slug]) => slug === selectedTemplate
                      );
                      const currentRatio = templateForRatio ? templateForRatio[1].ratio : '1:1';
                      return (
                        <button
                          key={ratio}
                          className="py-2 rounded-lg text-xs font-medium transition-all"
                          style={{
                            backgroundColor: currentRatio === ratio ? 'var(--accent-blue)' : 'var(--bg-elevated)',
                            color: currentRatio === ratio ? 'white' : 'var(--text-secondary)',
                          }}
                        >
                          {ratio}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Süre</label>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {config.duration / config.fps} saniye ({config.duration} frame @ {config.fps}fps)
                  </p>
                </div>
                <div>
                  <label style={labelStyle}>Çözünürlük</label>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {dimensions.width} × {dimensions.height}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-blue)' }} />
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  );
}
