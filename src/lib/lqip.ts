/**
 * Bulanık önizleme (LQIP): görselin ~24px'lik minik bir kopyası, HTML'in içine gömülür.
 * Asıl görsel yüklenene kadar kutuda renkler ve kompozisyon görünür; ek istek yok (~300-600 bayt).
 */
import sharp from 'sharp';
import type { ImageMetadata } from 'astro';

const cache = new Map<string, string>();

export async function lqip(img: ImageMetadata | undefined): Promise<string | undefined> {
  // Astro, içe aktarılan görselin kaynak yolunu sunucu tarafında `fsPath` olarak tutar.
  const file = (img as (ImageMetadata & { fsPath?: string }) | undefined)?.fsPath;
  if (!file) return undefined;
  const hit = cache.get(file);
  if (hit) return hit;
  try {
    const buf = await sharp(file).resize(24).webp({ quality: 50 }).toBuffer();
    const uri = `data:image/webp;base64,${buf.toString('base64')}`;
    cache.set(file, uri);
    return uri;
  } catch {
    return undefined;
  }
}
