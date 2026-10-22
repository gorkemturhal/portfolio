/**
 * Ana sayfadaki proje dışı tüm içerik burada.
 * Projeler için: src/content/projects/*.md
 */
import type { ImageMetadata } from 'astro';

import avatar from '../assets/avatar.jpg';

import iconPen from '../assets/icons/icon-pen.svg';
import iconAnimation from '../assets/icons/icon-animation.svg';
import iconBolt from '../assets/icons/icon-bolt.svg';
import iconSparkles from '../assets/icons/icon-sparkles.svg';

import figma from '../assets/icons/figma.svg';
import claude from '../assets/icons/claude.svg';
import openai from '../assets/icons/openai.svg';
import mobbin from '../assets/icons/mobbin.svg';
import cursor from '../assets/icons/cursor.svg';
import framer from '../assets/icons/framer.svg';
import github from '../assets/icons/github.svg';

import logoSensat from '../assets/logos/logo-sensat.svg';
import logoMaxitech from '../assets/logos/logo-maxitech.svg';
import logoBilyoner from '../assets/logos/logo-bilyoner.svg';
import logoKd from '../assets/logos/logo-kd.svg';
import logoVs from '../assets/logos/logo-vs.svg';
import logoPinarMask from '../assets/logos/logo2-mask.png';

import shotHeroPoster from '../assets/shots/creatorline-hero-poster.png';
import shotPromapperPaywall from '../assets/shots/promapper-paywall-half.png';
import shotPromapperHome from '../assets/shots/promapper-home-half.png';
import shotKdHome from '../assets/shots/kd-home-full.png';
import shotOrgnlPoster from '../assets/shots/orgnl-writing-poster.png';
import shotSensat1 from '../assets/shots/sensat-create-1-half.png';
import shotSensat2 from '../assets/shots/sensat-create-2-half.png';

export const profile = {
  name: 'Görkem Turhal',
  title: 'Senior Product Designer',
  avatar,
  bio: '9 years designing mobile and web products, from first flows to final handoff, using AI to move from idea to working prototype faster.',
  status: 'Open to new roles · İzmir / Remote',
  links: [
    { label: 'Resume', href: '/resume.pdf' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gorkem-turhal/' },
    // copy: tıklanınca adresi panoya kopyalar ve kısa süre 'Email copied' gösterir (pano yoksa mailto açılır).
    { label: 'Email', href: 'mailto:gorkemturhal@gmail.com', copy: 'gorkemturhal@gmail.com' },
  ],
};

export const sections = [
  { id: 'works', label: '01 Work' },
  { id: 'shots', label: '02 Shots' },
  { id: 'how-i-work', label: '03 How I work' },
  { id: 'experience', label: '04 Experience' },
  { id: 'about', label: '05 About' },
] as const;

/**
 * "Worked with" logoları. Tek renkli SVG wordmark'lar en iyi sonucu verir.
 * `mask: true` olan logolar gri (#595959) renge boyanır.
 */
export const clients: { name: string; src: ImageMetadata; width: number; height: number; mask?: boolean }[] = [
  { name: 'Villa Sepeti', src: logoVs, width: 70, height: 22 },
  { name: 'Pınar Online', src: logoPinarMask, width: 78, height: 12.42, mask: true },
  { name: 'KoçDigital', src: logoKd, width: 78, height: 16.62, mask: true },
  { name: 'sensat.com', src: logoSensat, width: 78, height: 13.63 },
  { name: 'Maxitech', src: logoMaxitech, width: 78, height: 14.36 },
  { name: 'Bilyoner', src: logoBilyoner, width: 70.4, height: 22.07 },
];

type Tool = { name: string; src: ImageMetadata; width: number; height: number };
const tool = {
  figma: { name: 'Figma', src: figma, width: 22, height: 32 },
  claude: { name: 'Claude', src: claude, width: 32, height: 32 },
  openai: { name: 'ChatGPT', src: openai, width: 32, height: 32 },
  mobbin: { name: 'Mobbin', src: mobbin, width: 32, height: 15 },
  cursor: { name: 'Cursor', src: cursor, width: 28, height: 32 },
  framer: { name: 'Framer', src: framer, width: 21, height: 32 },
  github: { name: 'GitHub', src: github, width: 32, height: 32 },
} satisfies Record<string, Tool>;

/**
 * "How I work": eski Skills kartlarının yerine, aynı yetenekleri bir iş akışı olarak anlatır.
 * TODO: Metinler senin beceri etiketlerinden türetilmiş taslaklar; kendi cümlelerinle düzelt.
 * En güçlü kanıt: kendi kurduğun bir aracın/iş akışının somut örneği (proje linki ya da video).
 */
export const howIWork: {
  title: string;
  icon: ImageMetadata;
  text: string;
  skills: string[];
  tools: Tool[];
}[] = [
  {
    title: 'Frame the problem',
    icon: iconPen,
    text: 'Strategy and research first, then flows and UI that hold up inside a design system.',
    skills: ['Product Strategy', 'UX Research', 'UI Design', 'Design Systems'],
    tools: [tool.figma, tool.mobbin],
  },
  {
    title: 'Work AI-native',
    icon: iconSparkles,
    text: 'An AI-native workflow with Claude and Figma MCP takes over the repetitive parts of design, from screen variants to copy checks. The loops on this site are rendered straight from Figma with it.',
    skills: ['AI-assisted Product Building', 'Figma MCP Workflows', 'Prompt & Skill Design'],
    tools: [tool.claude, tool.openai, tool.figma],
  },
  {
    title: 'Show it moving',
    icon: iconAnimation,
    text: 'Prototypes, micro-interactions and loop videos, so decisions are made on how it feels, not on static frames.',
    skills: ['Advanced Prototyping', 'Micro-interactions', 'Loop & Scroll Videos'],
    tools: [tool.figma, tool.claude],
  },
  {
    title: 'Ship it as code',
    icon: iconBolt,
    text: 'HTML, CSS and JS fluency, so handoff is a working component instead of a spec to interpret.',
    skills: ['Design-to-Code', 'Production-ready UI', 'Working with Developers'],
    tools: [tool.cursor, tool.framer, tool.github],
  },
];

export const experience = [
  {
    role: 'Senior Product Designer',
    place: 'Brew Interactive · İzmir, Türkiye',
    period: '2017 – 2026',
    text: 'End-to-end product design for clients across travel, e-commerce, fintech, sports betting and enterprise, from research and design systems to prototypes and developer handoff.',
  },
  {
    role: 'UI/UX Designer',
    place: 'Freelance',
    period: '2016 – 2017',
    text: 'Web and mobile products for startups and small businesses, from requirements to final UI.',
  },
  {
    role: 'B.Sc. Computer Engineering',
    place: 'Yaşar University · İzmir',
    period: '2011 – 2016',
    text: 'Studied how software is built, which still shapes how I design and hand off.',
  },
];

export const about: string[] = [
  "I'm a senior product designer with 9 years of experience and a background in computer engineering. I design mobile and web products end to end, for consumer apps and complex internal tools alike, from the first flows to the details that ship.",
  "My focus is making products that do a lot feel simple to use: clear structure, plain language and interactions that respond the way people expect.",
  "I work with an AI-native workflow: Claude and Figma MCP take on the repetitive parts of design, so more of my time goes into the product itself. On the side, I design small concepts to test ideas and new tools end to end.",
  "I'm based in İzmir, Türkiye, and open to remote work.",
];

/**
 * Shots: tek ekranlar ve etkileşimler (half: 3:4, 588 × 784 export; full: 5:4, 1200 × 960, iki sütunu kaplar).
 * Video için: public/videos/shots/<ad>.mp4 koy, `video: '/videos/shots/<ad>'` yaz,
 * ilk kareyi src/assets/shots/ altına koyup `poster` olarak import et.
 */
export const shots: {
  label: string;
  alt?: string;
  image?: ImageMetadata;
  video?: string;
  poster?: ImageMetadata;
  full?: boolean;
}[] = [
  {
    label: 'Full loop · Creatorline hero',
    video: '/videos/shots/creatorline-hero',
    poster: shotHeroPoster,
    alt: 'Creatorline landing page hero: a trending video slides to the centre, takes on a platform frame and is wiped into the creator reshot',
    full: true,
  },
  {
    label: 'Half still · ProMapper paywall',
    image: shotPromapperPaywall,
    alt: 'ProMapper paywall: effect previews, three Pro benefits and the yearly plan with a one-week free trial',
  },
  {
    label: 'Half still · ProMapper home',
    image: shotPromapperHome,
    alt: 'ProMapper home: empty state for creating the first projection project and example effects',
  },
  {
    label: 'Full loop · Orgnl AI writing',
    video: '/videos/shots/orgnl-writing',
    poster: shotOrgnlPoster,
    alt: 'Orgnl editor: AI writes a paragraph word by word, the user accepts it, then selects it and uses Make shorter to rewrite it',
    full: true,
  },
  {
    label: 'Full still · KoçDigital home',
    image: shotKdHome,
    alt: 'KoçDigital website home with the Platform360 hero slider and the data analytics, AI and Industry 4.0 section below',
    full: true,
  },
  {
    label: 'Half still · Sensat listing type',
    image: shotSensat1,
    alt: 'sensat.com listing creation, first step: choose the vehicle type to start a listing for sale or rent',
  },
  {
    label: 'Half still · Sensat vehicle details',
    image: shotSensat2,
    alt: 'sensat.com listing creation: make, model, year and trim details filled in for the selected car',
  },
];
