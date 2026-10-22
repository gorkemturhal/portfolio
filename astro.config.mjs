// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO: Vercel'deki gerçek alan adınla değiştir (OG etiketleri ve sitemap için).
  site: 'https://gorkemturhal.com',
  trailingSlash: 'never',
  // Kart üzerine gelindiğinde proje sayfasını önceden yükle; detaydaki görseller hazır olur.
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: {
    // Figma'dan gelen @3x PNG'ler büyük; sharp'ın piksel limitine takılmasın.
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
        // UI ekran görüntülerinde renkli metin ve ince çizgiler keskin kalsın:
        // AVIF'te renk bilgisini tam çözünürlükte tut (4:4:4), WebP'de akıllı alt örnekleme kullan.
        avif: { chromaSubsampling: '4:4:4', effort: 6 },
        webp: { smartSubsample: true, effort: 6 },
      },
    },
  },
});
