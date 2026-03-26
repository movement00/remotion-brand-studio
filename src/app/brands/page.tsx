'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import type { Brand } from '@/types/brand';
import { PlusCircle, Palette, Settings, Trash2 } from 'lucide-react';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    const { data } = await supabase.from('brands').select('*').order('created_at', { ascending: false });
    setBrands(data || []);
    setLoading(false);
  }

  async function deleteBrand(id: string) {
    if (!confirm('Bu markayı silmek istediğinize emin misiniz?')) return;
    await supabase.from('brands').delete().eq('id', id);
    setBrands(brands.filter(b => b.id !== id));
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Markalar"
        subtitle="Marka profillerinizi yönetin"
        actions={
          <Link href="/brands/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            <PlusCircle size={16} /> Yeni Marka
          </Link>
        }
      />

      <div className="p-8">
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }} />
                <div className="h-4 rounded mt-4" style={{ backgroundColor: 'var(--bg-elevated)', width: '60%' }} />
                <div className="h-3 rounded mt-2" style={{ backgroundColor: 'var(--bg-elevated)', width: '40%' }} />
              </div>
            ))}
          </div>
        ) : brands.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <Palette size={48} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Henüz marka yok</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              İlk markanızı ekleyerek video üretmeye başlayın.
            </p>
            <Link href="/brands/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
            >
              <PlusCircle size={16} /> İlk Markayı Ekle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {brands.map((brand) => (
              <div key={brand.id} className="glass glass-hover rounded-2xl p-6 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {brand.logo_url ? (
                      <img src={brand.logo_url} alt={brand.name} className="w-14 h-14 rounded-xl object-contain"
                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold"
                        style={{ backgroundColor: brand.primary_color, color: 'white' }}
                      >
                        {brand.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{brand.name}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{brand.sector || 'Genel'}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/brands/${brand.id}`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--bg-elevated)' }}
                    >
                      <Settings size={14} style={{ color: 'var(--text-secondary)' }} />
                    </Link>
                    <button onClick={() => deleteBrand(brand.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--bg-elevated)' }}
                    >
                      <Trash2 size={14} style={{ color: 'var(--accent-red)' }} />
                    </button>
                  </div>
                </div>

                {brand.slogan && (
                  <p className="text-sm italic mb-3" style={{ color: 'var(--text-secondary)' }}>
                    &ldquo;{brand.slogan}&rdquo;
                  </p>
                )}

                <div className="flex gap-2 mb-3">
                  {[brand.primary_color, brand.secondary_color, brand.accent_color].map((c, i) => (
                    <div key={i} className="flex-1 h-2 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                    >
                      {brand.font_heading}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                    >
                      {brand.output_language === 'en' ? 'EN' : 'TR'}
                    </span>
                  </div>
                  <Link href={`/create?brand=${brand.id}`}
                    className="text-xs font-medium"
                    style={{ color: 'var(--accent-blue)' }}
                  >
                    Video Oluştur →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
