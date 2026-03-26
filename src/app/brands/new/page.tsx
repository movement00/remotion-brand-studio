'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import { SECTORS, GOOGLE_FONTS } from '@/lib/constants';
import { Save, Palette } from 'lucide-react';

export default function NewBrandPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
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
    output_language: 'tr' as 'tr' | 'en',
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);

    const { error } = await supabase.from('brands').insert([form]);
    if (!error) {
      router.push('/brands');
    }
    setSaving(false);
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

  return (
    <div className="min-h-screen">
      <Header title="Yeni Marka" subtitle="Marka profili oluşturun" />

      <form onSubmit={handleSubmit} className="p-8 max-w-3xl">
        <div className="glass rounded-2xl p-8 space-y-6">
          {/* Name & Slogan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Marka Adı *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Marka adını girin"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Slogan</label>
              <input
                type="text"
                value={form.slogan}
                onChange={(e) => updateField('slogan', e.target.value)}
                placeholder="Markanızın sloganı"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Sector & Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Sektör</label>
              <select
                value={form.sector}
                onChange={(e) => updateField('sector', e.target.value)}
                style={inputStyle}
              >
                <option value="">Sektör seçin</option>
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Çıktı Dili</label>
              <select
                value={form.output_language}
                onChange={(e) => updateField('output_language', e.target.value)}
                style={inputStyle}
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Colors */}
          <div>
            <label style={labelStyle}>Marka Renkleri</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'primary_color', label: 'Ana Renk' },
                { key: 'secondary_color', label: 'İkincil Renk' },
                { key: 'accent_color', label: 'Vurgu Rengi' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <input
                    type="color"
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                    style={{ backgroundColor: 'transparent' }}
                  />
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                    <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {(form as Record<string, string>)[key]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Başlık Fontu</label>
              <select
                value={form.font_heading}
                onChange={(e) => updateField('font_heading', e.target.value)}
                style={inputStyle}
              >
                {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Gövde Fontu</label>
              <select
                value={form.font_body}
                onChange={(e) => updateField('font_body', e.target.value)}
                style={inputStyle}
              >
                {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Açıklama</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Marka hakkında kısa açıklama (AI konu üretimi için kullanılır)"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Preview */}
          <div>
            <label style={labelStyle}>Önizleme</label>
            <div className="rounded-xl p-6 flex items-center gap-6"
              style={{ background: `linear-gradient(135deg, ${form.primary_color}22, ${form.secondary_color}22)`, border: '1px solid var(--border-subtle)' }}
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: form.primary_color, color: 'white' }}
              >
                {form.name ? form.name.charAt(0) : <Palette size={24} />}
              </div>
              <div>
                <p className="text-lg font-bold" style={{ fontFamily: form.font_heading, color: 'var(--text-primary)' }}>
                  {form.name || 'Marka Adı'}
                </p>
                <p className="text-sm" style={{ fontFamily: form.font_body, color: form.accent_color }}>
                  {form.slogan || 'Slogan'}
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: form.primary_color }} />
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: form.secondary_color }} />
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: form.accent_color }} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || !form.name.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            <Save size={16} />
            {saving ? 'Kaydediliyor...' : 'Markayı Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
