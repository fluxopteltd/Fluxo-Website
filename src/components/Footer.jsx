
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-foreground border-t border-border overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logos/fluxo-light.png"
                alt="Fluxo"
                className="h-10 w-auto dark:hidden"
              />
              <img
                src="/logos/fluxo-dark.png"
                alt="Fluxo"
                className="h-10 w-auto hidden dark:block"
              />
            </div>
            <p className="text-sm text-primary font-bold tracking-wide uppercase mb-2">Singapore</p>
            <p className="text-sm text-foreground/80 leading-relaxed max-w-xs font-medium">
              Operational software, built right. Tailored solutions for businesses that demand reliability.
            </p>
          </div>

          <div>
            <p className="font-bold text-foreground mb-4">Company</p>
            <nav className="flex flex-col gap-3">
              <Link to="/about" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/services" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/contact" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <p className="font-bold text-foreground mb-4">Legal</p>
            <nav className="flex flex-col gap-3">
              <a href="#" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                Terms of Service
              </a>
            </nav>
            <p className="text-xs font-medium text-foreground/60 mt-6 leading-relaxed">
              This website complies with Singapore's Personal Data Protection Act (PDPA).
            </p>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-foreground/70">
            © {currentYear} Fluxo Pte. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
