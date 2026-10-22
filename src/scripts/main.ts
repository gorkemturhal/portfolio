/**
 * Sayfa davranışları. ClientRouter ile sayfa değişince DOM yenilenir;
 * bu yüzden her şey `astro:page-load`'da kurulur ve `astro:before-swap`'ta temizlenir.
 */

import { navigate } from 'astro:transitions/client';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let cleanups: Array<() => void> = [];
let isFirstLoad = true;

// Sayfa geçişinde <html> öznitelikleri yeni belgeden kopyalanır: `js` sınıfını koru,
// ilk açılış stagger'ını kapat (geçişi view transition üstlenir).
document.addEventListener('astro:before-swap', (e) => {
  const root = e.newDocument.documentElement;
  root.classList.add('js');
  root.classList.remove('first-load');
  cleanups.forEach((fn) => fn());
  cleanups = [];
});

// Yeni sayfa DOM'a girdi ama view transition henüz yeni hâlin görüntüsünü almadı.
// Ekranda kalacak öğeleri şimdi görünür yap; yoksa sayfa boş kutularla girer,
// görseller animasyon bittikten sonra "pat" diye belirir.
document.addEventListener('astro:after-swap', () => {
  const limit = window.innerHeight * 0.92;
  const inView = [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.top < limit && r.bottom > 0;
  });
  // Ölçüm stili zaten hesapladı (opacity: 0); geçişi kapatmazsak 0→1 animasyonu başlar.
  inView.forEach((el) => {
    el.style.transition = 'none';
    el.classList.add('is-visible');
  });
  document.body.offsetHeight;
  inView.forEach((el) => (el.style.transition = ''));
});

document.addEventListener('astro:page-load', () => {
  setupImageFade();
  setupReveal();
  setupVideos();
  setupScrollSpy();
  setupBackToTop();
  setupNextProject();
  setupCopyEmail();
  isFirstLoad = false;
});

/* ───────────── Görsel yüklenince yumuşak geçiş ───────────── */
function setupImageFade() {
  document.querySelectorAll<HTMLImageElement>('img[data-loading]').forEach((img) => {
    const done = () => img.removeAttribute('data-loading');
    if (img.complete && img.naturalWidth > 0) {
      // Önbellekten geldiyse animasyonsuz göster.
      img.style.transition = 'none';
      done();
      requestAnimationFrame(() => (img.style.transition = ''));
    } else {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }
  });
}

/* ───────────── Scroll ile beliren öğeler ───────────── */
function setupReveal() {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)');
  if (!items.length) return;

  let initialBatch = true;
  const io = new IntersectionObserver(
    (entries) => {
      // Aynı anda görünür olanları kısa aralıklarla (stagger) aç.
      let n = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);

        // Sayfa geçişinden sonra ilk ekrandaki öğeler zaten view transition ile giriyor;
        // ikinci kez canlandırma.
        if (initialBatch && !isFirstLoad) {
          el.style.transition = 'none';
          el.classList.add('is-visible');
          el.offsetHeight; // stil uygulansın
          el.style.transition = '';
          continue;
        }
        el.style.transitionDelay = `${Math.min(n, 4) * 60}ms`;
        el.classList.add('is-visible');
        el.addEventListener('transitionend', () => (el.style.transitionDelay = ''), { once: true });
        n++;
      }
      initialBatch = false;
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  items.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());
}

/* ───────────── Loop videolar ─────────────
 * - Yalnızca ekrandayken oynar; ekrandan çıkınca durur (pil, CPU, bant genişliği).
 * - Ekrana yaklaşınca yüklemeye başlar, böylece göründüğünde hazırdır.
 * - "Azaltılmış hareket" açıksa otomatik oynamaz; düğmeyle başlatılabilir.
 * - Kullanıcı durdurduysa, ekrana tekrar girince kendiliğinden başlamaz.
 */
function setupVideos() {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-loop-video]');
  if (!videos.length) return;

  const userPaused = new WeakSet<HTMLVideoElement>();

  const markReady = (v: HTMLVideoElement) => v.setAttribute('data-ready', '');
  const setToggle = (v: HTMLVideoElement, paused: boolean) => {
    const btn = v.parentElement?.querySelector<HTMLButtonElement>('[data-video-toggle]');
    if (!btn) return;
    btn.toggleAttribute('data-paused', paused);
    btn.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
  };

  const tryPlay = (v: HTMLVideoElement) => {
    if (reducedMotion.matches || userPaused.has(v)) return;
    v.play().catch(() => setToggle(v, true));
  };

  videos.forEach((v) => {
    v.addEventListener('playing', () => markReady(v));
    v.addEventListener('loadeddata', () => {
      // Azaltılmış harekette ilk kare görünsün (poster yoksa boş kalmasın).
      if (reducedMotion.matches) markReady(v);
    });
    v.addEventListener('play', () => setToggle(v, false));
    v.addEventListener('pause', () => setToggle(v, true));
    if (reducedMotion.matches) {
      setToggle(v, true);
      v.preload = 'metadata';
    }

    const btn = v.parentElement?.querySelector<HTMLButtonElement>('[data-video-toggle]');
    btn?.addEventListener('click', () => {
      if (v.paused) {
        userPaused.delete(v);
        v.play().catch(() => {});
      } else {
        userPaused.add(v);
        v.pause();
      }
    });
  });

  // Yaklaşınca yükle.
  const preloader = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const v = e.target as HTMLVideoElement;
        if (v.preload === 'none') {
          v.preload = 'auto';
          v.load();
        }
        preloader.unobserve(v);
      }
    },
    { rootMargin: '600px 0px' },
  );

  // Görünürken oynat, değilken durdur.
  const player = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) tryPlay(v);
        else if (!v.paused) {
          v.pause();
          setToggle(v, userPaused.has(v));
        }
      }
    },
    { threshold: 0.25 },
  );

  videos.forEach((v) => {
    preloader.observe(v);
    player.observe(v);
  });

  // Sekme arka plana geçince dur, dönünce devam et.
  const onVisibility = () => {
    videos.forEach((v) => {
      if (document.hidden) v.pause();
    });
    if (!document.hidden) {
      player.disconnect();
      videos.forEach((v) => player.observe(v));
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  cleanups.push(() => {
    preloader.disconnect();
    player.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    videos.forEach((v) => v.pause());
  });
}

/* ───────────── Sol navigasyon: aktif bölüm ───────────── */
function setupScrollSpy() {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
  const dot = document.querySelector<HTMLElement>('[data-nav-dot]');
  if (!links.length || !dot) return;

  const sections = links
    .map((a) => document.getElementById(a.dataset.navLink!))
    .filter((s): s is HTMLElement => !!s);

  let current = '';
  const setActive = (id: string) => {
    if (id === current) return;
    current = id;
    links.forEach((a) => {
      const on = a.dataset.navLink === id;
      if (on) {
        a.setAttribute('aria-current', 'true');
        const y = a.parentElement!.offsetTop;
        dot.style.setProperty('--dot-y', `${y}px`);
      } else a.removeAttribute('aria-current');
    });
  };

  // Ekranın üst üçte birindeki son bölüm aktiftir; en alta inildiyse sonuncusu.
  let ticking = false;
  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.33;
    let active = sections[0].id;
    for (const s of sections) {
      if (s.getBoundingClientRect().top - line <= 0) active = s.id;
    }
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) active = sections[sections.length - 1].id;
    setActive(active);
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  // İlk konumda nokta kaymadan yerine otursun.
  dot.style.transition = 'none';
  update();
  dot.offsetHeight;
  dot.style.transition = '';

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  cleanups.push(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  });
}

/* ───────────── Mobilde "başa dön" ───────────── */
function setupBackToTop() {
  const btn = document.querySelector<HTMLElement>('[data-to-top]');
  if (!btn) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    // Sayfa sonundaki iletişim düğmesinin üstüne binmesin.
    const nearEnd =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - window.innerHeight * 0.6;
    btn.toggleAttribute('data-visible', window.scrollY > window.innerHeight * 1.2 && !nearEnd);
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', onScroll));
}

/* ───────────── Sonraki proje: tıkla ya da sayfanın sonunda kaydırmaya devam et ───────────── */
function setupNextProject() {
  const link = document.querySelector<HTMLAnchorElement>('[data-next]');
  if (!link) return;
  const href = link.getAttribute('href') ?? '/';

  // İlk kez tamamen görününce dolgu bir kez kısaca dolup boşalır: "kaydırmaya devam edebilirsin".
  if (!reducedMotion.matches) {
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        link.setAttribute('data-hinting', '');
        const t = window.setTimeout(() => link.removeAttribute('data-hinting'), 560);
        cleanups.push(() => clearTimeout(t));
      },
      { threshold: 1 },
    );
    io.observe(link);
    cleanups.push(() => io.disconnect());
  }

  // Kaydırarak geçiş: sadece fare/trackpad ile ve hareket azaltma kapalıyken.
  if (reducedMotion.matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // Sona getiren kaydırmanın ataleti dolguyu doldurmamalı; ama düzenli kaydırmaya devam eden kullanıcıyı da engellememeli.
  // Atalet hızla sönümlenir, kullanıcının kendi kaydırması aynı hızda sürer: ikisini hızın davranışından ayırırız.
  const QUIET = 160; // sonda bu kadar duraklayıp yeniden kaydırmak = yeni, bilinçli bir hareket
  const SETTLE = 300; // sona aynı hızda kaydırarak gelinmişse bu süreden sonra sayılır...
  const KEEP = 0.5; // ...hız, sona ulaşılan andaki hızın en az yarısıysa (sönümlenen atalet bunu sağlamaz)
  const RELEASE = 350; // kaydırma bu kadar durursa dolgu geri çekilir (fare tekerleği tıkları arasında boşalmasın)
  let progress = 0;
  let armed = false;
  let going = false;
  let lastWheel = 0;
  let arrivedAt = 0;
  let arrivalSpeed = 0;
  let releaseTimer = 0;

  const atBottom = () =>
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  const setProgress = (p: number) => {
    progress = Math.min(1, Math.max(0, p));
    link.style.setProperty('--p', String(progress));
  };
  const release = () => {
    if (going) return;
    link.removeAttribute('data-pulling');
    setProgress(0);
  };

  const onWheel = (e: WheelEvent) => {
    if (going) return;
    const now = performance.now();
    const gap = now - lastWheel;
    lastWheel = now;
    if (!atBottom()) {
      armed = false;
      arrivedAt = 0;
      if (progress > 0) release();
      return;
    }
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // yatay kaydırma sayılmaz
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    const dy = e.deltaY * unit;
    if (!arrivedAt) {
      arrivedAt = now;
      arrivalSpeed = Math.abs(dy);
    }
    if (!armed) {
      const paused = gap >= QUIET;
      const steady = now - arrivedAt >= SETTLE && Math.abs(dy) >= Math.max(2, arrivalSpeed * KEEP);
      if (!paused && !steady) return;
      armed = true;
    }
    const distance = Math.max(700, window.innerHeight * 1.1);
    setProgress(progress + dy / distance);
    link.toggleAttribute('data-pulling', progress > 0);
    clearTimeout(releaseTimer);
    releaseTimer = window.setTimeout(release, RELEASE);
    if (progress >= 1) {
      going = true;
      clearTimeout(releaseTimer);
      navigate(href);
    }
  };

  window.addEventListener('wheel', onWheel, { passive: true });
  cleanups.push(() => {
    window.removeEventListener('wheel', onWheel);
    clearTimeout(releaseTimer);
  });
}

/* ───────────── E-posta: tıklayınca kopyala ─────────────
   Adres panoya kopyalanır, link kısa süre "Email copied" der (ekran okuyucuya da duyurulur).
   Pano erişimi yoksa (izin, eski tarayıcı) normal mailto davranışına düşer. */
function setupCopyEmail() {
  const links = document.querySelectorAll<HTMLAnchorElement>('a[data-copy]');
  if (!links.length) return;
  const live = document.createElement('span');
  live.className = 'sr-only';
  live.setAttribute('aria-live', 'polite');
  document.body.append(live);
  const timers = new Map<HTMLElement, number>();
  const onClick = async (e: MouseEvent) => {
    const link = e.currentTarget as HTMLAnchorElement;
    const text = link.dataset.copy;
    if (!text || !navigator.clipboard) return; // mailto açılır
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.location.href = link.href;
      return;
    }
    link.setAttribute('data-copied', '');
    live.textContent = 'Email copied';
    window.clearTimeout(timers.get(link));
    timers.set(
      link,
      window.setTimeout(() => {
        link.removeAttribute('data-copied');
        live.textContent = '';
      }, 1600),
    );
  };
  links.forEach((l) => l.addEventListener('click', onClick));
  cleanups.push(() => {
    links.forEach((l) => l.removeEventListener('click', onClick));
    timers.forEach((t) => window.clearTimeout(t));
    live.remove();
  });
}
