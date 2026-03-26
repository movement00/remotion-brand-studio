import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { brand } = await request.json();

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Return mock data
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
    return NextResponse.json({ topics });
  }

  const lang = brand.output_language === 'en' ? 'English' : 'Türkçe';
  const prompt = `Sen bir sosyal medya içerik stratejistisin.
Aşağıdaki marka için 5 adet video konusu öner:

Marka: ${brand.name}
Sektör: ${brand.sector || 'Genel'}
Slogan: ${brand.slogan || 'Yok'}
Açıklama: ${brand.description || 'Yok'}

Her konu için şunları ver:
- topic: Konu başlığı
- headline: Video'da görünecek ana başlık (kısa, çarpıcı)
- body_text: Alt metin (1-2 cümle)
- cta_text: Harekete geçirici metin
- hashtags: 5 adet hashtag

JSON array formatında yanıt ver. ${lang} yaz.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    const data = await response.json();
    const topics = JSON.parse(data.candidates[0].content.parts[0].text);
    return NextResponse.json({ topics });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate topics' }, { status: 500 });
  }
}
