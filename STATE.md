# ⭐ RESUME — fluxo-website (updated 2026-09-25)

- **Branch:** `feature/blog-why-fluxo` (local only, NOT pushed). main = `73ec157` (live on fluxo.com.sg). No DB/migrations.
- **Shipped this session (local, commits 70ebb0f → 2a0568f):**
  - /blog + article "Looking for a custom software developer in Singapore? Here is why SMEs choose Fluxo" (`src/content/posts.js`).
  - **Whole site prerendered**: `npm run build` = client build → SSR build of `src/entry-server.jsx` → `scripts/prerender.mjs` writes `dist/<route>/index.html` (title/description/canonical/OG/JSON-LD + full text). `dist/_spa.html` = untouched shell for the catch-all rewrite. vercel.json has explicit per-route rewrites. New public route ⇒ add it to `routes` in entry-server.jsx AND vercel.json AND sitemap.
  - Fluxo Platform → **Fluxo Products** (available now, Selka, real pricing Free / S$12.90 / S$39). Waitlist, 2027 roadmap, DiveCore removed.
  - Invented testimonials → `RealWork.jsx` (5 real, anonymised builds). Insurance example dashboard → HSE/compliance.
  - /privacy + /terms (PDPA-aligned drafts), footer links. WhatsApp +65 8214 7195 (`src/lib/contact.js`) on Contact, footer, blog CTA; telephone in JSON-LD.
  - OG share image `public/og-image.png`, logo `public/logo-512.png`; PSG keyword removed; `llms.txt`; IndexNow key `public/44c24ba40f8a6b64a5bdae3bb5cb984d.txt`.
- **Local preview:** `npm run build && npx vite preview --port 4173` (preview-routes plugin mimics vercel.json).
- **Next steps:**
  1. Jay reviews on localhost + reads Privacy/Terms → push branch, PR (CodeRabbit).
  2. After merge + deploy: curl live routes as GPTBot (expect full text, one <title>), check WhatsApp share preview.
  3. Submit: IndexNow ping (api.indexnow.org, key above, host fluxo.com.sg) for Bing; Jay adds sitemap in Google Search Console (domain already has google-site-verification TXT; DNS on Vercel).
- **Still open / needs Jay:**
  - Founder photos: hostinger CDN files are gone (404, no archive). Page shows initials. Need new headshots → put in `public/team/`.
  - "42 days" claim on About (`AboutPage.jsx` principle 02) unverified — confirm or remove.
  - Privacy page asserts providers are bound by contractual data protection terms (confirm Vercel/Supabase/Resend DPAs accepted) and that non-converting enquiries get deleted (HQ has no purge job yet). Consider registering DPO on BizFile+.
  - Studio column still says "24-month support minimum" and "4–8 weeks" — confirm these match current contracts.
  - Build log prints a harmless React warning (`offsetDistance` in ReportFlow SVG during SSR).
