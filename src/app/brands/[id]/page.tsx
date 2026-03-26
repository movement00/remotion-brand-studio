'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import { SECTORS, GOOGLE_FONTS } from '@/lib/constants';
import type { Brand } from '@/types/brand';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BrandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    slogan: '',
    sector: '',
    description: '',
    primary_color: '#3B82F6',
    secondary_color: '#1E293B',
    accent_color: '#F59E0B',
    font_heading: 'Poppins',
    font_body: 'Inter',
    output_language: 'tr',
  });

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('brands').select('*').eq('id', params.id).single();
      if (data) {
        setForm({
          name: data.name || '',
          slogan: data.slogan || '',
          sector: data.sector || '',
          description: data.description || '',
          primary_color: data.primary_color || '#3B82F6',
          secondary_color: data.secondary_color || '#1E293B',
          accent_color: data.accent_color || '#F59E0B',
          font_heading: data.font_heading || 'Poppins',
          font_body: data.font_body || 'Inter',
          output_language: data.output_language || 'tr',
        });
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from('brands').update(form).eq('id', params.id);
    setSaving(false);
    router.push('/brands');
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    borderRadius: 12,
    padding: '10px 16px',
    fontSize: 14,
    width: '100%',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: 6,
    display: 'block',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Markayı Düzenle"
        subtitle={form.name}
        actions={
          <Link href="/brands" className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} /> Geri Dön
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="p-8 max-w-3xl">
        <div className="glass rounded-2xl p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Marka Adı *</label>
              <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Slogan</label>
              <input type="text" value={form.slogan} onChange={(e) => updateField('slogan', e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Sektör</label>
              <select value={form.sector} onChange={(e) => updateField('sector', e.target.value)} style={inputStyle}>
                <option value="">Sektör seçin</option>
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Çıktı Dili</label>
              <select value={form.output_language} onChange={(e) => updateField('output_language', e.target.value)} style={inputStyle}>
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Marka Renkleri</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'primary_color', label: 'Ana Renk' },
                { key: 'secondary_color', label: 'İkincil Renk' },
                { key: 'accent_color', label: 'Vurgu Rengi' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <input type="color" value={(form as Record<string,string>)[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                    <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{(form as Record<string,string>)[key]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Başlık Fontu</label>
              <select value={form.font_heading} onChange={(e) => updateField('font_heading', e.target.value)} style={inputStyle}>
                {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Gövde Fontu</label>
              <select value={form.font_body} onChange={(e) => updateField('font_body', e.target.value)} style={inputStyle}>
                {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Açıklama</label>
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)}
              rows={3} style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <button type="submit" disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            <Save size={16} /> {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
