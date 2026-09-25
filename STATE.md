# ⭐ RESUME — fluxo-website (updated 2026-09-25)

- **Branch:** `feature/blog-why-fluxo` (local only, NOT pushed). main = `73ec157` (live on fluxo.com.sg). No DB/migrations.
- **Shipped this session (local):** /blog + first article "Looking for a custom software developer in Singapore? Here is why SMEs choose Fluxo". Content in `src/content/posts.js`; `scripts/prerender-blog.js` writes static HTML for /blog routes at build time so AI crawlers (GPTBot etc.) see the full text + BlogPosting/FAQPage JSON-LD. vercel.json has explicit /blog rewrites. sitemap + `public/llms.txt` added.
- **Local preview:** `npm run build && npx vite preview --port 4173` → http://localhost:4173/blog/custom-software-developer-singapore-why-smes-choose-fluxo
- **Next steps:** Jay reviews copy → push branch + PR (CodeRabbit) → after merge, curl the live URL as GPTBot to confirm the prerendered HTML is served → submit sitemap in Google Search Console / Bing Webmaster (Bing feeds ChatGPT search).
- **Site audit (25 Sep), unfixed:** 🔴 About-page founder photos 404 (hostinger CDN); "PSG grant software" in index.html keywords (not PSG-approved); "Fluxo Platform — launching 2027/waitlist" while Selka is live; SocialProof.jsx testimonials look invented; the rest of the site (/, /about, /services) is an empty JS shell to AI crawlers. 🟠 stale roadmaps (DiveCore paused), unverified "42 days" claim, Privacy/Terms links are `#`, old PNG logo in JSON-LD, no OG tags.
- **Gotchas:** `vite preview` needs the plugin's middleware for /blog/<slug> (built in). Adding a post = new object in posts.js + sitemap entry.
