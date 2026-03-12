import Icon from '../shared/Icon';

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { label: 'Seller Portal', href: 'https://seller.cerve.in' },
      { label: 'Claw AI', href: 'https://claw.cerve.in' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'ONDC', href: 'https://ondc.org' },
      { label: 'GitHub', href: 'https://github.com/AsClaw' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#ondc' },
      { label: 'Contact', href: 'mailto:hello@cerve.in' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-cerve-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/cerve-logo.png" alt="Cerve" className="h-7 w-7 object-contain" />
              <span className="text-2xl font-extrabold text-gradient">Cerve</span>
            </div>
            <p className="mt-3 text-sm text-cerve-muted">
              Open commerce for everyone.
              <br />
              Powered by ONDC.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://github.com/AsClaw"
                className="text-cerve-muted hover:text-cerve-text transition-colors"
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
              <h3 className="text-sm font-semibold text-cerve-text">{title}</h3>
              <ul className="mt-3 space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-cerve-muted hover:text-cerve-text transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cerve-muted">
            &copy; {new Date().getFullYear()} Cerve. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-cerve-muted">
            <a href="/privacy" className="hover:text-cerve-text transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-cerve-text transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
