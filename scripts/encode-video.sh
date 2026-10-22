#!/usr/bin/env bash
# Loop/scroll videolarını web için yüksek kaliteyle hazırlar.
#
# Kullanım:
#   ./scripts/encode-video.sh <kaynak.mov|mp4> <çıktı-yolu-uzantısız>
#   ./scripts/encode-video.sh ~/Desktop/search.mov public/videos/villa-sepeti/search
#
# Üretilenler:
#   <çıktı>.mp4        H.264, her tarayıcıda oynar (zorunlu)
#   <çıktı>.webm       AV1, aynı kalitede ~%30-50 daha küçük (destekleyen tarayıcılar önce bunu seçer)
#   <çıktı>-poster.png İlk kare. src/content/projects/<proje>/ altına taşıyıp `poster:` olarak kullan.
#
# Kalite notları:
# - Kaynağı ekranda gösterileceği genişliğin 2 katında export et:
#     tam genişlik 2400×1920, yarım 1176×1568 (ya da 1200×960 / 588×784 tasarımın @2x'i).
# - CRF ne kadar düşükse kalite o kadar yüksek. UI kayıtları için 18 neredeyse kayıpsızdır.
#   Dosya çok büyük gelirse 20-22'ye çık; 16 altına inmeye gerek yok.
# - Ses kanalı kaldırılır (loop'lar zaten sessiz oynar; sessiz video otomatik oynatılabilir).
# - `+faststart`: video tamamen inmeden oynamaya başlar.
#
# Gereken: ffmpeg (brew install ffmpeg)
set -euo pipefail

if [[ $# -lt 2 ]]; then
  sed -n '2,8p' "$0"
  exit 1
fi

IN="$1"
OUT="$2"
CRF_H264="${CRF_H264:-18}"
CRF_AV1="${CRF_AV1:-28}"

command -v ffmpeg >/dev/null || { echo "ffmpeg bulunamadı: brew install ffmpeg"; exit 1; }
mkdir -p "$(dirname "$OUT")"

# Genişlik/yükseklik çift sayı olmalı (yuv420p şartı); ölçekleme yapılmaz.
VF="scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos,format=yuv420p"

echo "→ H.264  $OUT.mp4"
ffmpeg -hide_banner -loglevel error -y -i "$IN" -an \
  -vf "$VF" -c:v libx264 -preset slow -crf "$CRF_H264" -tune animation \
  -profile:v high -tag:v avc1 -movflags +faststart \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  "$OUT.mp4"

if ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libsvtav1; then
  echo "→ AV1    $OUT.webm"
  ffmpeg -hide_banner -loglevel error -y -i "$IN" -an \
    -vf "$VF" -c:v libsvtav1 -preset 4 -crf "$CRF_AV1" -g 240 \
    -svtav1-params tune=0 \
    -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
    "$OUT.webm"
else
  echo "! libsvtav1 yok, AV1 atlandı (sadece .mp4 kullanılacak)."
fi

echo "→ Poster $OUT-poster.png"
ffmpeg -hide_banner -loglevel error -y -i "$IN" -frames:v 1 "$OUT-poster.png"

ls -lh "$OUT".* "$OUT-poster.png"
