import React from 'react';
import { motion } from 'framer-motion';
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from '@/lib/contact.js';

/**
 * WhatsAppFloat
 * Fixed bottom-right "chat with us" button on every page. Opens WhatsApp
 * with Fluxo's number and a pre-typed first message.
 */
export default function WhatsAppFloat() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with Fluxo on WhatsApp (${WHATSAPP_DISPLAY})`}
      initial={{ opacity: 0, scale: 0.6, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[60] flex items-center gap-3 rounded-full bg-[#25D366] pl-3.5 pr-3.5 sm:pr-5 h-14 text-white shadow-[0_10px_30px_rgba(37,211,102,0.35)] hover:bg-[#1FBE5B] hover:shadow-[0_12px_36px_rgba(37,211,102,0.5)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-background"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping [animation-duration:2.8s] pointer-events-none" aria-hidden="true" />
      <svg viewBox="0 0 32 32" className="relative w-7 h-7 flex-shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M16.003 3C8.832 3 3 8.83 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.69-1.71A12.95 12.95 0 0 0 16.003 29C23.17 29 29 23.17 29 16S23.17 3 16.003 3Zm0 23.62c-1.99 0-3.93-.53-5.63-1.54l-.4-.24-3.97 1.02 1.06-3.87-.26-.41A10.57 10.57 0 0 1 5.37 16c0-5.86 4.77-10.63 10.64-10.63 5.86 0 10.62 4.77 10.62 10.63 0 5.86-4.77 10.62-10.63 10.62Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.14 3.09 1.3 3.3c.16.21 2.25 3.43 5.44 4.81.76.33 1.35.52 1.81.67.76.24 1.46.21 2 .13.61-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
      </svg>
      <span className="relative hidden sm:inline text-sm font-semibold whitespace-nowrap">Chat on WhatsApp</span>
    </motion.a>
  );
}
