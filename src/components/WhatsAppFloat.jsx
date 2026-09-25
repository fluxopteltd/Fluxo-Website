import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from '@/lib/contact.js';

/**
 * WhatsAppFloat
 * Fixed bottom-right "chat with us" button on every page. Opens WhatsApp
 * with Fluxo's number and a pre-typed first message.
 *
 * Styled in Fluxo's own palette (navy glass, blue→violet gradient core and
 * rotating edge) so it belongs to the site; the WhatsApp glyph and a small
 * green status dot keep it recognisable. It slides away while the visitor
 * scrolls down (so it never sits on top of what they're reading) and comes
 * back on scroll up, when scrolling stops, or at the bottom of the page.
 * Keyframes live in index.css (wa-*) and stop under reduced motion.
 */

function WhatsAppGlyph({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.003 3C8.832 3 3 8.83 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.69-1.71A12.95 12.95 0 0 0 16.003 29C23.17 29 29 23.17 29 16S23.17 3 16.003 3Zm0 23.62c-1.99 0-3.93-.53-5.63-1.54l-.4-.24-3.97 1.02 1.06-3.87-.26-.41A10.57 10.57 0 0 1 5.37 16c0-5.86 4.77-10.63 10.64-10.63 5.86 0 10.62 4.77 10.62 10.63 0 5.86-4.77 10.62-10.63 10.62Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.14 3.09 1.3 3.3c.16.21 2.25 3.43 5.44 4.81.76.33 1.35.52 1.81.67.76.24 1.46.21 2 .13.61-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

function useShowOnScrollUp() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const idleTimer = useRef(null);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 80;
      if (y < 120 || nearBottom || y < lastY.current - 4) setVisible(true);
      else if (y > lastY.current + 4) setVisible(false);
      lastY.current = y;
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setVisible(true), 1400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idleTimer.current);
    };
  }, []);

  return visible;
}

export default function WhatsAppFloat() {
  const visible = useShowOnScrollUp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 90 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: visible ? 0.05 : 0 }}
      className="fixed bottom-4 right-4 sm:bottom-7 sm:right-7 z-[60]"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with Fluxo on WhatsApp (${WHATSAPP_DISPLAY})`}
        tabIndex={visible ? 0 : -1}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
        className="group relative block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* Ambient brand glow */}
        <span
          className="absolute -inset-3 rounded-full bg-[radial-gradient(closest-side,rgba(42,158,255,0.35),rgba(124,40,216,0.18),transparent)] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          aria-hidden="true"
        />

        {/* Rotating gradient edge */}
        <span className="relative block rounded-full p-[1.5px] overflow-hidden shadow-[0_14px_40px_-10px_rgba(8,16,31,0.9)]">
          <span
            className="wa-spin absolute left-1/2 top-1/2 w-[260%] aspect-square -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#2A9EFF,#5358E2,#7C28D8,#5358E2,#2A9EFF)] pointer-events-none"
            aria-hidden="true"
          />

          {/* Glass body */}
          <span className="relative flex items-center gap-3 rounded-full bg-[#08101F]/90 backdrop-blur-xl p-1 sm:p-1.5 sm:pr-5 overflow-hidden">
            <span
              className="wa-sheen absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {/* Core */}
            <span className="relative flex h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center">
              <span className="wa-radar absolute inset-0 rounded-full border border-[#2A9EFF]/70" aria-hidden="true" />
              <span className="wa-radar wa-radar-delay absolute inset-0 rounded-full border border-[#7C28D8]/60" aria-hidden="true" />
              <span className="relative flex h-full w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#2A9EFF_0%,#5358E2_55%,#7C28D8_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_16px_rgba(83,88,226,0.55)] transition-transform duration-300 group-hover:scale-105">
                <WhatsAppGlyph className="h-[22px] w-[22px] sm:h-6 sm:w-6" />
              </span>
              {/* WhatsApp-green status dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#08101F]" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-[#25D366] shadow-[0_0_8px_rgba(37,211,102,0.9)]" />
              </span>
            </span>

            {/* Label (desktop) */}
            <span className="relative hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-white tracking-tight">Chat with us</span>
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                on WhatsApp
              </span>
            </span>
          </span>
        </span>
      </motion.a>
    </motion.div>
  );
}
