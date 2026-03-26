import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { description, brand } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !description) {
    return NextResponse.json({
      headline: description?.slice(0, 40) || '',
      subHeadline: '',
      bodyText: description || '',
      ctaText: 'Hemen Keşfet',
    });
  }

  const brandInfo = brand
    ? `Marka: ${brand.name}, Sektör: ${brand.sector || 'Genel'}, Slogan: ${brand.slogan || 'Yok'}`
    : 'Marka bilgisi yok';

  const lang = brand?.output_language === 'en' ? 'English' : 'Türkçe';

  const prompt = `Sen profesyonel bir video içerik yazarısın. Kullanıcı bir video fikri verdi, bunu video için uygun kısa ve çarpıcı metinlere çevir.

Kullanıcının isteği: "${description}"
${brandInfo}

JSON formatında yanıt ver:
{
  "headline": "Kısa, çarpıcı ana başlık (max 6 kelime)",
  "subHeadline": "Alt başlık (max 10 kelime)",
  "bodyText": "Kısa açıklama (1-2 cümle)",
  "ctaText": "Harekete geçirici buton metni (2-3 kelime)"
}

${lang} yaz. Kısa ve güçlü ol.`;

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
    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      headline: description.slice(0, 40),
      subHeadline: '',
      bodyText: description,
      ctaText: 'Hemen Keşfet',
    });
  }
}
