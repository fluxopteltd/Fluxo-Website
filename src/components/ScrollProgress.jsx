import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress
 * Thin progress bar at the top of the viewport that fills as the user
 * scrolls through the page. Adds a premium feel to long pages.
 */

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-[hsl(var(--fluxo-cyan))] to-primary origin-left z-[60] pointer-events-none"
      style={{ scaleX }}
    />
  );
}
