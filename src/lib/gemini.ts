import type { Brand } from '@/types/brand';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface TopicSuggestionResult {
  topic: string;
  headline: string;
  bodyText: string;
  ctaText: string;
  hashtags: string[];
  reasoning: string;
}

export interface VideoPromptResult {
  scenes: {
    duration: string;
    type: string;
    description: string;
    animation: string;
    text?: string;
  }[];
  style: string;
  transitions: string;
  mood: string;
}

export async function generateTopics(brand: Brand, count: number = 5): Promise<TopicSuggestionResult[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return mock data when API key is not set
    return getMockTopics(brand, count);
  }

  const lang = brand.output_language === 'en' ? 'English' : 'Türkçe';
  const prompt = `Sen bir sosyal medya içerik stratejistisin.
Aşağıdaki marka için ${count} adet video konusu öner:

Marka: ${brand.name}
Sektör: ${brand.sector || 'Genel'}
Slogan: ${brand.slogan || 'Yok'}
Açıklama: ${brand.description || 'Yok'}

Her konu için şunları ver:
- topic: Konu başlığı
- headline: Video'da görünecek ana başlık (kısa, çarpıcı)
- bodyText: Alt metin (1-2 cümle)
- ctaText: Harekete geçirici metin
- hashtags: 5 adet hashtag
- reasoning: Neden bu konuyu önerdiğin (1 cümle)

JSON array formatında yanıt ver. ${lang} yaz.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  } catch {
    return getMockTopics(brand, count);
  }
}

export async function expandVideoPrompt(
  description: string,
  brand: Brand
): Promise<VideoPromptResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return getMockVideoPrompt(description);
  }

  const lang = brand.output_language === 'en' ? 'English' : 'Türkçe';
  const prompt = `Sen bir profesyonel video prodüksiyon yönetmenisin.
Kullanıcı aşağıdaki videoyu istiyor. Bunu detaylı bir sahne-sahne video spesifikasyonuna çevir.

İstenen Video: ${description}

Marka: ${brand.name}
Sektör: ${brand.sector || 'Genel'}
Slogan: ${brand.slogan || 'Yok'}

JSON formatında yanıt ver:
{
  "scenes": [
    {
      "duration": "2s",
      "type": "logo-reveal | headline | media-showcase | text-animation | cta | transition | custom",
      "description": "Sahne açıklaması",
      "animation": "spring-bounce | fade-in | slide-left | slide-up | scale-in | typewriter | stagger-reveal | ken-burns | flip | pulse | shake | rotate",
      "text": "Gösterilecek metin (varsa)"
    }
  ],
  "style": "energetic | elegant | minimal | cinematic | playful | professional | dramatic",
  "transitions": "smooth-crossfade | cut | slide | zoom | dissolve",
  "mood": "Genel mood/ton açıklaması"
}

${lang} yaz. Profesyonel, After Effects kalitesinde düşün.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  } catch {
    return getMockVideoPrompt(description);
  }
}

function getMockTopics(brand: Brand, count: number): TopicSuggestionResult[] {
  const topics: TopicSuggestionResult[] = [
    {
      topic: 'Yeni Sezon Lansmanı',
      headline: `${brand.name} Yeni Sezon`,
      bodyText: 'Bu sezonun en trend ürünleri sizleri bekliyor. Hemen keşfedin!',
      ctaText: 'Keşfet',
      hashtags: ['#yenisezon', '#trend', `#${brand.name?.toLowerCase().replace(/\s/g, '')}`, '#kampanya', '#indirim'],
      reasoning: 'Sezon lansmanları her marka için yüksek etkileşim sağlar.',
    },
    {
      topic: 'Müşteri Hikayesi',
      headline: 'Müşterilerimiz Anlatıyor',
      bodyText: 'Gerçek müşterilerimizin deneyimlerini dinleyin. Memnuniyet garantisi!',
      ctaText: 'Hikayeyi İzle',
      hashtags: ['#müşterimemnuniyeti', '#review', '#testimonial', `#${brand.name?.toLowerCase().replace(/\s/g, '')}`, '#güven'],
      reasoning: 'Sosyal kanıt, satın alma kararlarını güçlü şekilde etkiler.',
    },
    {
      topic: 'Ürün Karşılaştırma',
      headline: 'Farkı Görün',
      bodyText: 'Öncesi ve sonrası ile ürünlerimizin farkını kendiniz görün.',
      ctaText: 'Karşılaştır',
      hashtags: ['#oncesisonrasi', '#karsilastirma', '#beforeafter', '#kalite', `#${brand.name?.toLowerCase().replace(/\s/g, '')}`],
      reasoning: 'Before/after içerikleri görsel medyada en çok etkileşim alan formattır.',
    },
    {
      topic: 'Flash İndirim',
      headline: 'Son 24 Saat!',
      bodyText: 'Kaçırılmayacak fırsatlar sadece bugün! Stoklar sınırlı.',
      ctaText: 'Hemen Al',
      hashtags: ['#indirim', '#flashsale', '#firsat', '#songun', `#${brand.name?.toLowerCase().replace(/\s/g, '')}`],
      reasoning: 'Urgency (aciliyet) içerikleri hızlı aksiyon almayı tetikler.',
    },
    {
      topic: 'Marka Hikayesi',
      headline: `${brand.name} Hikayesi`,
      bodyText: 'Vizyonumuz, misyonumuz ve sizin için neler yapıyoruz. Bizi tanıyın.',
      ctaText: 'Bizi Tanı',
      hashtags: ['#markahikayesi', '#brandstory', '#hakkimizda', `#${brand.name?.toLowerCase().replace(/\s/g, '')}`, '#vizyon'],
      reasoning: 'Marka bilinirliği ve güven oluşturmak için önemli bir içerik türü.',
    },
  ];
  return topics.slice(0, count);
}

function getMockVideoPrompt(description: string): VideoPromptResult {
  return {
    scenes: [
      { duration: '2s', type: 'logo-reveal', description: 'Logo merkeze spring animasyonla gelir', animation: 'spring-bounce' },
      { duration: '3s', type: 'headline', description: 'Ana başlık büyük fontla belirir', animation: 'typewriter', text: 'Ana Başlık' },
      { duration: '3s', type: 'media-showcase', description: 'Medya içeriği ken burns efektiyle gösterilir', animation: 'ken-burns' },
      { duration: '2s', type: 'cta', description: 'CTA butonu pulse efektiyle belirir', animation: 'pulse', text: 'Hemen İncele' },
    ],
    style: 'professional',
    transitions: 'smooth-crossfade',
    mood: `Kullanıcının istediği: "${description}" — Profesyonel ve etkileyici bir video.`,
  };
}
