import { Link } from 'react-router-dom';
import Icon from '../shared/Icon';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Safety', to: '/safety' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'GitHub', href: 'https://github.com/AsClaw/CerveAIClaw' },
      { label: 'Documentation', href: 'https://github.com/AsClaw/CerveAIClaw#readme' },
      { label: 'Changelog', href: 'https://github.com/AsClaw/CerveAIClaw/releases' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Cerve', href: 'https://cerve.in' },
      { label: 'Seller Portal', href: 'https://seller.cerve.in' },
      { label: 'Contact', href: 'mailto:hello@cerve.in' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-claw-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-gradient">Claw</span>
            </Link>
            <p className="mt-3 text-sm text-claw-muted">
              AI-powered phone agent.
              <br />
              <a href="https://cerve.in" className="text-claw-cerve hover:underline">
                by Cerve
              </a>
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://github.com/AsClaw/CerveAIClaw"
                className="text-claw-muted hover:text-claw-text transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="github" size={20} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-claw-text">{title}</h3>
              <ul className="mt-3 space-y-2">
                {links.map(({ label, to, href }) => (
                  <li key={label}>
                    {to ? (
                      <Link to={to} className="text-sm text-claw-muted hover:text-claw-text transition-colors">
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="text-sm text-claw-muted hover:text-claw-text transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-claw-muted">
            &copy; {new Date().getFullYear()} Cerve. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-claw-muted">
            <a href="https://cerve.in/privacy" className="hover:text-claw-text transition-colors">
              Privacy Policy
            </a>
            <a href="https://cerve.in/terms" className="hover:text-claw-text transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
