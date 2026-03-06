import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../shared/Icon';
import Button from '../shared/Button';

const navLinks = [
  { label: 'Features', to: '/features' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Safety', to: '/safety' },
  { label: 'FAQ', to: '/faq' },
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-claw-bg/95 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="flex items-center">
              <img src="/cerve-logo.png" alt="Cerve" className="h-7 w-7 object-contain" />
              <span className="text-2xl font-extrabold text-gradient -ml-0.5">law</span>
            </span>
            <span className="text-xs text-claw-cerve font-medium mt-1">by Cerve</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === to ? 'text-claw-primary' : 'text-claw-muted hover:text-claw-text'
                }`}
              >
                {label}
              </Link>
            ))}
            <Button size="sm" href="https://github.com/AsClaw/CerveAIClaw">
              <Icon name="download" size={16} />
              Download
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-claw-muted hover:text-claw-text"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? 'x' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-claw-bg/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === to
                    ? 'text-claw-primary bg-claw-primary/10'
                    : 'text-claw-muted hover:text-claw-text hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2">
              <Button size="sm" href="https://github.com/AsClaw/CerveAIClaw" className="w-full">
                <Icon name="download" size={16} />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
