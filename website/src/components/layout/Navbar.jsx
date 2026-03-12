import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../shared/Icon';
import Button from '../shared/Button';

const navLinks = [
  { label: 'Products', href: '#products' },
  { label: 'Features', href: '#features' },
  { label: 'How ONDC Works', href: '#ondc' },
  { label: 'Categories', href: '#categories' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-cerve-bg/95 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/cerve-logo.png" alt="Cerve" className="h-8 w-8 object-contain" loading="eager" />
            <span className="text-2xl font-extrabold text-gradient">Cerve</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleAnchorClick(e, href)}
                className="text-sm font-medium text-cerve-muted hover:text-cerve-text transition-colors cursor-pointer"
              >
                {label}
              </a>
            ))}
            <Button size="sm" href="https://seller.cerve.in">
              <Icon name="store" size={16} />
              Seller Portal
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-cerve-muted hover:text-cerve-text"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? 'x' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-cerve-bg/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleAnchorClick(e, href)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-cerve-muted hover:text-cerve-text hover:bg-white/5"
              >
                {label}
              </a>
            ))}
            <div className="pt-2">
              <Button size="sm" href="https://seller.cerve.in" className="w-full">
                <Icon name="store" size={16} />
                Seller Portal
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
