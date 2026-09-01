import React from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgress from '@/components/ScrollProgress.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import TtagMotorDemo from './pages/demo/TtagMotorDemo.jsx';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/services" element={<PageTransition><ServicesPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * The client demo is an app shell rather than a marketing page: it sits outside
 * AnimatePresence so switching modules keeps the shell mounted (and each module's
 * state alive), and it skips the marketing scroll indicator.
 */
function SiteRoutes() {
  return (
    <>
      <ScrollProgress />
      <AnimatedRoutes />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/demo/ttag-motor" element={<TtagMotorDemo />} />
        <Route path="/demo/ttag-motor/:module" element={<TtagMotorDemo />} />
        <Route path="*" element={<SiteRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
