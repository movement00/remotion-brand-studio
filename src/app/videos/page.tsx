'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import type { GeneratedVideo } from '@/types/video';
import { Film, Download, Trash2, RotateCcw, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function VideosPage() {
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    const { data } = await supabase.from('generated_videos').select('*').order('created_at', { ascending: false });
    setVideos(data || []);
    setLoading(false);
  }

  async function deleteVideo(id: string) {
    if (!confirm('Bu videoyu silmek istediğinize emin misiniz?')) return;
    await supabase.from('generated_videos').delete().eq('id', id);
    setVideos(videos.filter(v => v.id !== id));
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Taslak', color: 'var(--text-muted)', bg: 'var(--bg-elevated)' },
    rendering: { label: 'İşleniyor', color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.1)' },
    completed: { label: 'Tamamlandı', color: 'var(--accent-green)', bg: 'rgba(16,185,129,0.1)' },
    failed: { label: 'Başarısız', color: 'var(--accent-red)', bg: 'rgba(239,68,68,0.1)' },
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Videolarım"
        subtitle="Oluşturduğunuz tüm videolar"
        actions={
          <Link href="/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            <PlusCircle size={16} /> Yeni Video
          </Link>
        }
      />

      <div className="p-8">
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="glass rounded-2xl animate-pulse">
                <div className="aspect-video" style={{ backgroundColor: 'var(--bg-elevated)' }} />
                <div className="p-4">
                  <div className="h-4 rounded" style={{ backgroundColor: 'var(--bg-elevated)', width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <Film size={48} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Henüz video yok</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              İlk videonuzu oluşturarak başlayın.
            </p>
            <Link href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
            >
              <PlusCircle size={16} /> Video Oluştur
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {videos.map((video) => {
              const status = statusConfig[video.render_status] || statusConfig.draft;
              return (
                <div key={video.id} className="glass rounded-2xl overflow-hidden group transition-all glass-hover">
                  {/* Thumbnail area */}
                  <div className="aspect-video flex items-center justify-center relative"
                    style={{ backgroundColor: 'var(--bg-elevated)' }}
                  >
                    <Film size={32} style={{ color: 'var(--text-muted)' }} />
                    {/* Status badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: status.bg, color: status.color }}
                    >
                      {status.label}
                    </div>
                    {/* Aspect ratio */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-mono"
                      style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white' }}
                    >
                      {video.aspect_ratio}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>
                        {video.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(video.created_at).toLocaleDateString('tr-TR')}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {video.output_url && (
                          <a href={video.output_url} target="_blank" rel="noreferrer"
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: 'var(--bg-hover)' }}
                          >
                            <Download size={12} style={{ color: 'var(--accent-green)' }} />
                          </a>
                        )}
                        <button onClick={() => deleteVideo(video.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: 'var(--bg-hover)' }}
                        >
                          <Trash2 size={12} style={{ color: 'var(--accent-red)' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
