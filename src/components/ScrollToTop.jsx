import { useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';

/**
 * ScrollToTop
 * On route change, scrolls to top. If the URL has a hash (e.g.
 * /about#flywheel), scrolls that element into view instead — respecting
 * anchor links.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, '');
      // Wait for the next paint so the target element is mounted
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
