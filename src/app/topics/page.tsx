'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import type { Brand } from '@/types/brand';
import type { TopicSuggestion } from '@/types/video';
import { Sparkles, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';

// Import mock function for when API key is not set
function getMockTopics(brand: Brand, count: number) {
  const topics = [
    {
      topic: 'Yeni Sezon Lansmanı',
      headline: `${brand.name} Yeni Sezon`,
      body_text: 'Bu sezonun en trend ürünleri sizleri bekliyor. Hemen keşfedin!',
      cta_text: 'Keşfet',
      hashtags: ['#yenisezon', '#trend', `#${brand.name?.toLowerCase().replace(/\s/g, '')}`, '#kampanya', '#indirim'],
    },
    {
      topic: 'Müşteri Hikayesi',
      headline: 'Müşterilerimiz Anlatıyor',
      body_text: 'Gerçek müşterilerimizin deneyimlerini dinleyin.',
      cta_text: 'Hikayeyi İzle',
      hashtags: ['#müşterimemnuniyeti', '#review', '#testimonial', `#${brand.name?.toLowerCase().replace(/\s/g, '')}`, '#güven'],
    },
    {
      topic: 'Ürün Karşılaştırma',
      headline: 'Farkı Görün',
      body_text: 'Öncesi ve sonrası ile ürünlerimizin farkını kendiniz görün.',
      cta_text: 'Karşılaştır',
      hashtags: ['#oncesisonrasi', '#karsilastirma', '#beforeafter', '#kalite', `#${brand.name?.toLowerCase().replace(/\s/g, '')}`],
    },
    {
      topic: 'Flash İndirim',
      headline: 'Son 24 Saat!',
      body_text: 'Kaçırılmayacak fırsatlar sadece bugün!',
      cta_text: 'Hemen Al',
      hashtags: ['#indirim', '#flashsale', '#firsat', '#songun', `#${brand.name?.toLowerCase().replace(/\s/g, '')}`],
    },
    {
      topic: 'Marka Hikayesi',
      headline: `${brand.name} Hikayesi`,
      body_text: 'Vizyonumuz, misyonumuz ve sizin için neler yapıyoruz.',
      cta_text: 'Bizi Tanı',
      hashtags: ['#markahikayesi', '#brandstory', '#hakkimizda', `#${brand.name?.toLowerCase().replace(/\s/g, '')}`, '#vizyon'],
    },
  ];
  return topics.slice(0, count);
}

export default function TopicsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [topics, setTopics] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('brands').select('*').order('name');
      setBrands(data || []);
      setLoading(false);
    }
    load();
  }, []);

  async function generateTopics() {
    if (!selectedBrand) return;
    setGenerating(true);
    const brand = brands.find(b => b.id === selectedBrand);
    if (!brand) return;

    try {
      const res = await fetch('/api/gemini/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand }),
      });
      if (res.ok) {
        const data = await res.json();
        setTopics(data.topics || []);
      } else {
        // Fallback to mock
        setTopics(getMockTopics(brand, 5));
      }
    } catch {
      const brand = brands.find(b => b.id === selectedBrand);
      if (brand) setTopics(getMockTopics(brand, 5));
    }
    setGenerating(false);
  }

  return (
    <div className="min-h-screen">
      <Header
        title="AI Konu Üretici"
        subtitle="Markanız için içerik konuları üretin"
      />

      <div className="p-8">
        {/* Brand Selection + Generate */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                Marka Seçin
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: 12,
                  padding: '10px 16px',
                  fontSize: 14,
                }}
              >
                <option value="">Marka seçin...</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <button
              onClick={generateTopics}
              disabled={!selectedBrand || generating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
            >
              {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {generating ? 'Üretiliyor...' : 'Konu Üret'}
            </button>
          </div>

          {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
            <p className="text-xs mt-3" style={{ color: 'var(--accent-amber)' }}>
              Gemini API key henüz eklenmedi — mock data gösterilecek.
            </p>
          )}
        </div>

        {/* Topic Results */}
        {topics.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Önerilen Konular
              </h2>
              <button onClick={generateTopics} disabled={generating}
                className="flex items-center gap-2 text-sm" style={{ color: 'var(--accent-blue)' }}
              >
                <RefreshCw size={14} /> Yenile
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {topics.map((topic, i) => (
                <div key={i} className="glass glass-hover rounded-xl p-5 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
                        >
                          {i + 1}
                        </span>
                        <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                          {topic.topic}
                        </h3>
                      </div>
                      <p className="text-lg font-semibold mb-1" style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-display)' }}>
                        {topic.headline}
                      </p>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        {topic.body_text || topic.bodyText}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(topic.hashtags || []).map((tag: string, j: number) => (
                          <span key={j} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--accent-blue)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/create?brand=${selectedBrand}&headline=${encodeURIComponent(topic.headline)}&body=${encodeURIComponent(topic.body_text || topic.bodyText || '')}&cta=${encodeURIComponent(topic.cta_text || topic.ctaText || '')}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ml-4 flex-shrink-0 transition-all"
                      style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--accent-blue)' }}
                    >
                      Video Oluştur <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {topics.length === 0 && !generating && (
          <div className="glass rounded-2xl p-16 text-center">
            <Sparkles size={48} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              AI ile Konu Üretin
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Bir marka seçin ve AI&apos;ın markanız için en uygun video konularını önermasini sağlayın.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
