# Görkem Turhal — Portfolio

Astro ile statik site. Ana sayfa + proje detay sayfası, Figma dosyasına birebir:
[Portfolio (Figma)](https://www.figma.com/design/sYpdi8i0ymTVoa7r41ch3u/Portfolio)

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # dist/ — Vercel bunu otomatik yapar
npm run preview   # build çıktısını yerelde dene
```

## Klasör yapısı

```
src/
  content/projects/          ← her proje bir .md dosyası + aynı adlı görsel klasörü
    villa-sepeti.md
    villa-sepeti/*.png
  data/site.ts               ← profil, linkler, logolar, shots, skills, experience, about
  components/Media.astro     ← görsel / video / yer tutucu (kalite ayarları burada)
  lib/media.ts               ← medya kutularının genişlikleri (srcset için)
  scripts/main.ts            ← scroll reveal, video oynatma, aktif bölüm göstergesi
  styles/global.css          ← renk/tipografi/easing değişkenleri, layout, animasyonlar
public/videos/               ← loop videolar (sıkıştırılmadan olduğu gibi sunulur)
scripts/encode-video.sh      ← videoyu web için yüksek kaliteyle hazırlar
```

## Yeni proje eklemek

1. `src/content/projects/yeni-proje.md` oluştur (`villa-sepeti.md`'yi kopyala).
2. Görselleri `src/content/projects/yeni-proje/` klasörüne koy.
3. Sayfa otomatik oluşur: `/work/yeni-proje`. Ana sayfadaki sırayı `order` belirler.

Galeri öğeleri:

```yaml
gallery:
  - image: ./yeni-proje/ekran.png          # tam genişlik görsel
    alt: Açıklama
  - video: /videos/yeni-proje/akis         # tam genişlik loop video (uzantısız)
    poster: ./yeni-proje/akis-poster.png
  - row:                                   # yan yana 2 (ya da 3) öğe
      - image: ./yeni-proje/sol.png
      - video: /videos/yeni-proje/sag
        poster: ./yeni-proje/sag-poster.png
```

## Görsel ve video kalitesi

**Görseller.** PNG'leri Figma'dan **@3x** export et (tam genişlik 3600×2880, yarım 1764×2352).
Build sırasında her biri AVIF + WebP olarak, kalite 90 ve renk alt örneklemesi kapalı (4:4:4)
şekilde birden çok genişlikte üretilir. Tarayıcı ekranın piksel yoğunluğuna göre doğru dosyayı
seçer: retina ekranda 2x, telefonda 3x. Orijinalden büyük dosya asla üretilmez.

**Videolar.** Sitede yeniden sıkıştırılmaz; ne koyarsan o oynar. Bu yüzden export kalitesi önemli:

```bash
brew install ffmpeg
./scripts/encode-video.sh ~/Desktop/akis.mov public/videos/villa-sepeti/akis
mv public/videos/villa-sepeti/akis-poster.png src/content/projects/villa-sepeti/
```

- `.mp4` (H.264) her yerde oynar; `.webm` (AV1) varsa destekleyen tarayıcı onu seçer.
- Kaynağı gösterim boyutunun 2 katında kaydet (tam: 2400×1920, yarım: 1176×1568).
- Poster = videonun ilk karesi. Video yüklenirken poster görünür, sonra video üstüne yumuşakça gelir.
- Videolar yalnızca ekrandayken oynar, ekrandan çıkınca durur; ekrana yaklaşınca yüklenmeye başlar.
- "Hareketi azalt" açık kullanıcılarda otomatik oynamaz; köşedeki düğmeyle başlatılabilir.

## Animasyon kuralları

Emil Kowalski'nin tasarım mühendisliği ilkeleri uygulandı:

| Nerede | Ne | Neden |
| --- | --- | --- |
| İlk açılış | Sol kolon ve başlıklar 50ms aralıklarla, 8px aşağıdan, 500ms `ease-out` | Bir kez görülür; içerik sırayla okunur |
| Scroll | Kartlar/medya görünür alana girince 16px yukarı + fade, bir kez | Uzun sayfada ritim; tekrar oynamaz |
| Sayfa geçişi | Eski sayfa 140ms'de çıkar, yeni sayfa 360ms'de girer (+2px blur) | Çıkış hızlı, giriş yumuşak; blur iki sayfanın üst üste binmesini gizler |
| Kart hover | Kapak `scale(1.02)`, başlıkta ok belirir | Sadece gerçek imleçte (`hover: hover`) |
| Kart basma | `scale(0.985)`, 160ms | Arayüz tıklamayı "duyar" |
| Navigasyon | Aktif noktası bölümler arasında kayar, `ease-in-out` | Ekranda hareket eden öğe |
| Görsel yükleme | 400ms opacity | Boş kutu birden dolmaz |

Tüm easing'ler `global.css`'te: `--ease-out`, `--ease-in-out`, `--ease-drawer`.
Yalnızca `transform` ve `opacity` canlandırılır. `prefers-reduced-motion` açıkken
hareketler kalkar, sadece opacity geçişleri kalır.

## Yayın (Vercel)

1. Projeyi GitHub'a gönder.
2. vercel.com → New Project → repo'yu seç. Framework otomatik "Astro" algılanır.
3. `astro.config.mjs` içindeki `site` adresini gerçek alan adınla güncelle.

`vercel.json` build dosyalarını 1 yıl, videoları 1 gün önbellekte tutar.
Aynı adla yeni video yüklersen tarayıcılar en geç 1 gün içinde yenisini alır;
anında güncellenmesi için dosya adını değiştir (`akis-v2`).

## Yapılacaklar

- [ ] `src/data/site.ts`: gerçek LinkedIn / Resume bağlantıları, About metni, eğitim satırı açıklaması
- [ ] `public/resume.pdf`
- [ ] `src/assets/logos/logo-kd-shot.png` ve `logo-vs-shot.png` Figma'dan 1x geldi; SVG'leriyle değiştir
- [ ] `project-2/3/4.md` yer tutucuları gerçek projelerle değiştir
- [ ] Loop videoları ve shots
