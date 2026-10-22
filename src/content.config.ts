import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) => {
    /**
     * Tek bir görsel ya da video.
     * - image:  ./klasor/dosya.png  (build sırasında AVIF/WebP + srcset üretilir)
     * - video:  /videos/proje/dosya (uzantısız; public/ altındaki .mp4 / .webm / .hevc.mp4 otomatik bulunur)
     * - poster: video yüklenene kadar görünen kare (videonun ilk karesi önerilir)
     * - label:  henüz medya yoksa gri kutuda görünen yer tutucu metni
     */
    const media = z.object({
      image: image().optional(),
      video: z.string().optional(),
      poster: image().optional(),
      alt: z.string().default(''),
      /** Görselin altında görünen kısa açıklama (ekranın ne olduğu). */
      caption: z.string().optional(),
      label: z.string().optional(),
      /** Kutunun oranı, örn. "5/4" ya da "3/4". Görsellerde varsayılan olarak dosyanın kendi oranı kullanılır. */
      aspect: z.string().optional(),
    });

    return z.object({
      title: z.string(),
      /** Ana sayfadaki kartta görünen isim (boşsa title kullanılır). */
      cardTitle: z.string().optional(),
      summary: z.string(),
      description: z.string(),
      overview: z.string(),
      tags: z.array(z.string()).default([]),
      order: z.number().default(0),
      draft: z.boolean().default(false),
      /** Yakında: kart ana sayfada görünür ama tıklanmaz, detay sayfası üretilmez. */
      soon: z.boolean().default(false),
      meta: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .default([]),
      cover: media,
      /** Her öğe tam genişlik bir medya ya da `row` ile yan yana 2-3 medya. */
      gallery: z.array(z.union([z.object({ row: z.array(media).min(2).max(3) }), media])).default([]),
    });
  },
});

export const collections = { projects };
