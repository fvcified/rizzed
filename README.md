# rizzed

A rizzed kid — personal landing page built with **Next.js 15** + **React 19** + **TypeScript**.

## Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19
- **Language**: TypeScript
- **Styling**: CSS (globals.css)
- **Fonts**: Outfit + Inter via `next/font/google`
- **Deploy**: Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
rizzed/
├── app/
│   ├── layout.tsx       # Root layout + metadata
│   ├── page.tsx         # Home page
│   ├── globals.css      # Global styles
│   ├── icon.tsx         # Favicon
│   └── manifest.ts      # PWA manifest
├── components/
│   ├── TypedText.tsx    # Scramble typing animation
│   ├── TitleAnimator.tsx # Tab title animation
│   └── FooterIcon.tsx   # Social icon component
└── public/
    └── images/          # SVG icons + WebP images
```

## Deploy

Push to GitHub and import the repo in [Vercel](https://vercel.com) — zero config needed for Next.js.
