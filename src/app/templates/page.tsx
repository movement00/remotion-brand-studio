'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import type { VideoTemplate } from '@/types/template';
import { CATEGORY_LABELS } from '@/types/template';
import { LayoutGrid, Play, Clock, Monitor } from 'lucide-react';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('templates').select('*').order('created_at');
      setTemplates(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const categories = ['all', ...Object.keys(CATEGORY_LABELS)];
  const filtered = activeCategory === 'all'
    ? templates
    : templates.filter(t => t.category === activeCategory);

  const getAspectClass = (ratio: string) => {
    switch (ratio) {
      case '9:16': return { paddingTop: '177.78%' };
      case '16:9': return { paddingTop: '56.25%' };
      default: return { paddingTop: '100%' };
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Şablon Galerisi"
        subtitle="Premium video şablonları ile başlayın"
      />

      <div className="p-8">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: activeCategory === cat ? 'var(--accent-blue)' : 'var(--bg-elevated)',
                color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
              }}
            >
              {cat === 'all' ? 'Tümü' : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="glass rounded-2xl p-4 animate-pulse">
                <div className="aspect-square rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }} />
                <div className="h-4 rounded mt-3" style={{ backgroundColor: 'var(--bg-elevated)', width: '70%' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {filtered.map((template) => (
              <Link
                key={template.id}
                href={`/create?template=${template.slug}`}
                className="glass glass-hover rounded-2xl p-4 transition-all group"
              >
                {/* Thumbnail placeholder */}
                <div className="relative rounded-xl overflow-hidden mb-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <div style={getAspectClass(template.aspect_ratio)} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: 'var(--accent-blue)' }}
                    >
                      <Play size={20} color="white" fill="white" />
                    </div>
                  </div>
                  {/* Aspect ratio badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-mono"
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white' }}
                  >
                    {template.aspect_ratio}
                  </div>
                </div>

                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                  {template.name}
                </h3>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                  {template.description}
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{template.duration_seconds}s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Monitor size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{template.fps}fps</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
                    style={{ backgroundColor: 'var(--accent-amber)', color: 'black', fontSize: 10, fontWeight: 700 }}
                  >
                    {CATEGORY_LABELS[template.category] || template.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
