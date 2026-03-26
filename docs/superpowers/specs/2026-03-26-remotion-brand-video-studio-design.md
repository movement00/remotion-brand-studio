# Remotion Brand Video Studio — Design Spec

## Overview

AI-powered, brand-aware programmatic video production platform. Users describe what they want in natural language, AI expands it into a professional Remotion composition prompt, and the system generates After Effects-quality video output.

Target: Turkish SMBs and digital agencies.

## Core Concept

This is NOT a fixed-template system. It's a **video generation pipeline** where:

1. User describes a video idea in plain text
2. AI (Gemini) expands the description into a detailed, Remotion-optimized video prompt
3. The system has 8+ premium starter compositions as examples/starting points
4. Users can customize everything: timing, animations, media, colors, text
5. The full power of Remotion is available — spring animations, particle effects, 3D transforms, character-level text animation, cinematic transitions, parallax, masking, etc.

## Architecture

```
User Input (text description)
    ↓
Gemini AI (expand → Remotion-optimized prompt)
    ↓
Brand Profile (inject colors, fonts, logo, tone)
    ↓
Remotion Composition (React component)
    ↓
Remotion Player (live preview in browser)
    ↓
Render Pipeline (MP4 export)
    ↓
Supabase Storage (save & deliver)
```

## Pages & UI

### 1. Dashboard (`/`)
- Overview cards: total brands, total videos, recent activity
- Quick actions: "Yeni Video Oluştur", "Marka Ekle"
- Recent videos grid with thumbnails
- Stats summary

### 2. Markalar (`/brands`)
- Brand cards grid with logo, colors preview, sector badge
- Create/edit brand profile:
  - Name, logo upload, slogan
  - Primary/secondary/accent colors (color picker)
  - Heading & body fonts (Google Fonts selector)
  - Sector (dropdown)
  - Output language: TR / EN
  - Description, social links
- Brand assets library (uploaded images, videos, audio)

### 3. Video Oluşturucu (`/create`)
The main creation flow:

**Step 1: Marka Seç** — Pick a brand profile
**Step 2: Videoyu Anlat** — Free-text description of desired video
  - Example: "Yeni sezon indirimini duyuran, ürün fotoğraflarının zoom-in ile gösterildiği, geri sayımlı bir Instagram story reklamı"
**Step 3: AI Genişletme** — Gemini expands into detailed video spec (scenes, timing, animations, transitions)
  - User can edit/refine the expanded prompt
**Step 4: Şablon Seç (opsiyonel)** — Pick a starter template or start from scratch
**Step 5: Editör** — Full video editor with:
  - Left: Remotion Player (live preview, play/pause/scrub)
  - Right: Property panels (tabbed):
    - Marka: auto-filled from brand, editable
    - Içerik: headline, body, CTA, custom texts
    - Medya: upload images/videos/audio, drag to timeline
    - Zamanlama: scene durations, transition timing
    - Animasyonlar: spring presets, easing, stagger controls
    - Ayarlar: aspect ratio (1:1, 9:16, 16:9), FPS, duration
**Step 6: Export** — Render to MP4, save to Supabase Storage

### 4. Şablon Galerisi (`/templates`)
- Premium starter templates with live previews
- Category filters: social, story, product, promo, brand, news
- Each template shows: thumbnail, name, aspect ratio, duration, description
- "Bu Şablonla Başla" button → goes to editor with template pre-loaded

### 5. AI Konu Üretici (`/topics`)
- Select brand → AI generates topic suggestions
- Each suggestion: topic, headline, body text, CTA, hashtags
- "Bu Konuyla Video Oluştur" → goes to create flow with pre-filled content

### 6. Videolarım (`/videos`)
- Grid of all generated videos
- Status badges: draft, rendering, completed, failed
- Re-edit, download, delete actions

## 8 Premium Starter Compositions

These serve as starting points and demonstrations of Remotion's capabilities:

### 1. SocialPost (1:1, 1080x1080, 5s, 30fps = 150 frames)
- Animated gradient background using brand colors
- Headline: character-by-character spring reveal from top
- Body text: fade-in with slide-up
- CTA button: scale-in with bounce
- Logo: corner position with subtle pulse
- Transitions: smooth opacity crossfades between scenes

### 2. StoryAd (9:16, 1080x1920, 8s, 30fps = 240 frames)
- Scene 1 (0-60f): Logo reveal — scale from 0 with spring bounce, particle burst
- Scene 2 (60-150f): Full-screen typography — headline splits into words, each word flies in from different direction
- Scene 3 (150-210f): Media showcase — uploaded image/video with ken burns effect
- Scene 4 (210-240f): Swipe-up CTA with pulsing arrow animation

### 3. ProductShowcase (16:9, 1920x1080, 10s, 30fps = 300 frames)
- Product image center-stage with zoom-in parallax
- Feature bullets stagger-reveal from left with spring
- Price tag slides up from bottom with emphasis animation
- Background: subtle particle/bokeh effect using brand colors
- CTA bar slides in at end

### 4. TestimonialCard (1:1, 1080x1080, 6s, 30fps = 180 frames)
- Quote marks animate in
- Testimonial text: typewriter effect (character by character)
- Star rating: stars pop in one-by-one with rotation
- Customer name & title: fade-in with delay
- Card frame with subtle shadow animation

### 5. NewsHighlight (16:9, 1920x1080, 7s, 30fps = 210 frames)
- Breaking news red banner slides in from left
- Main headline: large bold text, slide-in with spring
- Sub-headline fades in below
- Bottom ticker: scrolling text loop
- Timestamp in corner
- Professional news broadcast aesthetic

### 6. CountdownPromo (9:16, 1080x1920, 10s, 30fps = 300 frames)
- Large countdown numbers (animating from 10 to 0) with flip/morph effect
- Campaign headline with pulse glow effect
- Urgency colors: brand accent with red/orange flash
- "Son X Gün!" text with shake animation
- CTA at bottom with gradient background

### 7. BeforeAfter (1:1, 1080x1080, 8s, 30fps = 240 frames)
- Split screen: left "Öncesi", right "Sonrası"
- Center divider line sweeps from left to right revealing "after"
- Labels fade in with spring
- Result highlight: border glow + scale emphasis
- Stats/numbers with counting animation

### 8. BrandIntro (16:9, 1920x1080, 6s, 30fps = 180 frames)
- Cinematic dark opening
- Geometric shapes/particles assemble into logo
- Logo holds with subtle breathe animation
- Slogan typewriter reveal below
- Brand colors gradient wash sweeps across screen
- Fade to end card

## Visual Design (Cinema Studio Theme)

### Colors
- Background: `#0A0A0F` (deep black)
- Surface: `#111118` (panel background)
- Surface elevated: `#1A1A24` (cards, modals)
- Border: `rgba(255,255,255,0.05)`
- Primary accent: `#3B82F6` (electric blue)
- Secondary accent: `#F59E0B` (amber)
- Success: `#10B981`
- Error: `#EF4444`
- Text primary: `#F8FAFC`
- Text secondary: `#94A3B8`
- Text muted: `#475569`

### Typography
- Display/Headings: "Clash Display" (via Google Fonts or local)
- Body: "Satoshi" (via Google Fonts or local)
- Mono (code/technical): "JetBrains Mono"

### Effects
- Glassmorphism panels: `backdrop-blur-xl bg-white/5`
- Subtle border glow on hover: `box-shadow: 0 0 20px rgba(59,130,246,0.1)`
- Grid overlay texture on backgrounds
- Smooth transitions: 200ms ease-out default

### Icons
- Lucide React throughout

## Data Model (Supabase)

### brands
```sql
id uuid PK
name text NOT NULL
logo_url text
primary_color text DEFAULT '#3B82F6'
secondary_color text DEFAULT '#1E293B'
accent_color text DEFAULT '#F59E0B'
font_heading text DEFAULT 'Poppins'
font_body text DEFAULT 'Inter'
slogan text
sector text
description text
output_language text DEFAULT 'tr' -- 'tr' | 'en'
social_links jsonb DEFAULT '{}'
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

### brand_assets
```sql
id uuid PK
brand_id uuid FK → brands.id
type text NOT NULL -- 'image' | 'video' | 'audio' | 'font'
url text NOT NULL
filename text NOT NULL
file_size bigint
metadata jsonb DEFAULT '{}'
created_at timestamptz DEFAULT now()
```

### templates
```sql
id uuid PK
name text NOT NULL
slug text UNIQUE NOT NULL
description text
category text NOT NULL -- 'social' | 'story' | 'product' | 'promo' | 'brand' | 'news'
aspect_ratio text NOT NULL -- '1:1' | '9:16' | '16:9'
duration_seconds integer NOT NULL
fps integer DEFAULT 30
thumbnail_url text
schema jsonb -- describes accepted props
is_premium boolean DEFAULT false
created_at timestamptz DEFAULT now()
```

### generated_videos
```sql
id uuid PK
brand_id uuid FK → brands.id
template_id uuid FK → templates.id (nullable — custom videos)
title text NOT NULL
description text -- original user description
ai_prompt text -- AI-expanded prompt
props jsonb NOT NULL -- full composition props
render_status text DEFAULT 'draft' -- 'draft' | 'rendering' | 'completed' | 'failed'
output_url text
aspect_ratio text NOT NULL
duration_seconds integer
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

### topic_suggestions
```sql
id uuid PK
brand_id uuid FK → brands.id
topic text NOT NULL
headline text
body_text text
cta_text text
hashtags text[]
status text DEFAULT 'suggested' -- 'suggested' | 'approved' | 'used'
created_at timestamptz DEFAULT now()
```

## Storage Buckets (Supabase)
- `brand-logos` — brand logo files
- `brand-assets` — uploaded media (images, videos, audio)
- `rendered-videos` — completed video exports

## Technical Decisions
- Next.js 14+ App Router with `src/app/`
- Remotion 4.x with Tailwind v4 (`@remotion/tailwind-v4`)
- Google Fonts via `@remotion/google-fonts`
- Player loaded via `next/dynamic` with `{ ssr: false }`
- All Remotion Player components marked `"use client"`
- Single user — no auth
- Gemini 2.5 Flash — placeholder (API key later)
- Deploy: Netlify with `@netlify/plugin-nextjs`

## Gemini AI Integration (Placeholder)

Two AI functions:

### 1. Video Prompt Expander
Input: user's plain text description + brand profile
Output: detailed scene-by-scene video specification

```
User: "Yeni sezon indirimi için Instagram story reklamı"
↓ Gemini expands to:
{
  scenes: [
    { duration: 2s, type: "logo-reveal", animation: "scale-spring-bounce" },
    { duration: 3s, type: "headline", text: "YENİ SEZON", animation: "word-fly-in" },
    { duration: 2s, type: "media-showcase", animation: "ken-burns-zoom" },
    { duration: 1s, type: "cta", text: "Yukarı Kaydır", animation: "pulse-arrow" }
  ],
  style: "energetic",
  transitions: "smooth-crossfade"
}
```

### 2. Topic Generator
Input: brand profile (sector, slogan, description)
Output: array of topic suggestions with headline, body, CTA, hashtags

Both functions return placeholder/mock data until API key is provided.

## Out of Scope (v1)
- User authentication / multi-tenancy
- Payment system
- Remotion Lambda rendering (local/server-side only)
- Real-time collaboration
- Video versioning/history
