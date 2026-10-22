/**
 * Medya kutularının sayfadaki genişlikleri. `sizes` doğru olursa tarayıcı
 * retina ekranlarda 2x dosyayı seçer; yanlış olursa bulanık ya da gereksiz büyük dosya iner.
 * Layout değişirse (global.css: --sidebar-w, --pad) burayı da güncelle.
 *
 *   ≥1280px  sol kolon 27.78vw (en fazla 480), padding 36
 *            → içerik = min(1200, 72.22vw − 72, 100vw − 552)
 *   ≥1024px  sol kolon 320, padding 36 → içerik = 100vw − 392
 *   <1024px  tek kolon, padding 16     → içerik = 100vw − 32
 */
export const MEDIA = {
  full: {
    widths: [640, 960, 1280, 1600, 2000, 2400],
    sizes:
      '(min-width: 1280px) min(1200px, calc(72.22vw - 72px), calc(100vw - 552px)), (min-width: 1024px) calc(100vw - 392px), calc(100vw - 32px)',
  },
  half: {
    widths: [400, 600, 800, 1000, 1200, 1600],
    sizes:
      '(min-width: 1280px) min(588px, calc(36.11vw - 48px), calc(50vw - 288px)), (min-width: 1024px) calc((100vw - 416px) / 2), (min-width: 640px) calc((100vw - 56px) / 2), calc(100vw - 32px)',
  },
  third: {
    widths: [320, 480, 640, 800, 1000, 1200],
    sizes:
      '(min-width: 1280px) min(384px, calc(24.07vw - 40px), calc(33.33vw - 200px)), (min-width: 1024px) calc((100vw - 440px) / 3), (min-width: 640px) calc((100vw - 80px) / 3), calc(100vw - 32px)',
  },
} as const;
