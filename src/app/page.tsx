'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import type { Brand } from '@/types/brand';
import type { GeneratedVideo } from '@/types/video';
import {
  Palette, Film, Sparkles, PlusCircle, ArrowRight,
  TrendingUp, Clock, CheckCircle2
} from 'lucide-react';

export default function DashboardPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [brandsRes, videosRes] = await Promise.all([
        supabase.from('brands').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('generated_videos').select('*').order('created_at', { ascending: false }).limit(6),
      ]);
      setBrands(brandsRes.data || []);
      setVideos(videosRes.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const stats = [
    { label: 'Toplam Marka', value: brands.length, icon: Palette, color: 'var(--accent-blue)' },
    { label: 'Toplam Video', value: videos.length, icon: Film, color: 'var(--accent-amber)' },
    { label: 'Tamamlanan', value: videos.filter(v => v.render_status === 'completed').length, icon: CheckCircle2, color: 'var(--accent-green)' },
    { label: 'Taslak', value: videos.filter(v => v.render_status === 'draft').length, icon: Clock, color: 'var(--text-muted)' },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Marka video üretim merkeziniz"
        actions={
          <Link
            href="/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            <PlusCircle size={16} />
            Yeni Video
          </Link>
        }
      />

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass rounded-2xl p-6 glass-hover transition-all cursor-default">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                    <Icon size={20} style={{ color: stat.color }} />
                  </div>
                  <TrendingUp size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  {loading ? '—' : stat.value}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { href: '/create', icon: PlusCircle, label: 'Yeni Video Oluştur', desc: 'AI ile video üret', color: 'var(--accent-blue)' },
            { href: '/brands/new', icon: Palette, label: 'Marka Ekle', desc: 'Yeni marka profili oluştur', color: 'var(--accent-amber)' },
            { href: '/topics', icon: Sparkles, label: 'Konu Üret', desc: 'AI ile içerik konuları bul', color: 'var(--accent-green)' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="glass glass-hover rounded-2xl p-6 flex items-center gap-4 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <Icon size={22} style={{ color: action.color }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{action.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{action.desc}</p>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            );
          })}
        </div>

        {/* Recent Brands */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Son Markalar</h2>
            <Link href="/brands" className="text-sm flex items-center gap-1" style={{ color: 'var(--accent-blue)' }}>
              Tümünü Gör <ArrowRight size={14} />
            </Link>
          </div>
          {brands.length === 0 && !loading ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Palette size={40} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
              <p style={{ color: 'var(--text-secondary)' }}>Henüz marka eklenmemiş</p>
              <Link href="/brands/new" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
              >
                <PlusCircle size={14} /> İlk Markayı Ekle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-3">
              {brands.map((brand) => (
                <Link key={brand.id} href={`/brands/${brand.id}`}
                  className="glass glass-hover rounded-xl p-4 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: brand.primary_color, color: 'white' }}
                    >
                      {brand.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{brand.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{brand.sector || 'Genel'}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[brand.primary_color, brand.secondary_color, brand.accent_color].map((c, i) => (
                      <div key={i} className="w-6 h-3 rounded-sm" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Videos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Son Videolar</h2>
            <Link href="/videos" className="text-sm flex items-center gap-1" style={{ color: 'var(--accent-blue)' }}>
              Tümünü Gör <ArrowRight size={14} />
            </Link>
          </div>
          {videos.length === 0 && !loading ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Film size={40} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
              <p style={{ color: 'var(--text-secondary)' }}>Henüz video oluşturulmamış</p>
              <Link href="/create" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
              >
                <PlusCircle size={14} /> İlk Videoyu Oluştur
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {videos.map((video) => (
                <div key={video.id} className="glass glass-hover rounded-xl p-4 transition-all">
                  <div className="aspect-video rounded-lg mb-3 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--bg-elevated)' }}
                  >
                    <Film size={24} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{video.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      backgroundColor: video.render_status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color: video.render_status === 'completed' ? 'var(--accent-green)' : 'var(--accent-amber)',
                    }}>
                      {video.render_status === 'completed' ? 'Tamamlandı' : video.render_status === 'draft' ? 'Taslak' : video.render_status}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{video.aspect_ratio}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
