import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../../../components/layout/Footer';

const renderFooter = () => render(<MemoryRouter><Footer /></MemoryRouter>);

describe('Footer', () => {
  it('renders the Claw brand link', () => {
    renderFooter();
    expect(screen.getByText('Claw')).toBeInTheDocument();
  });

  it('renders "by Cerve" branding', () => {
    renderFooter();
    expect(screen.getByText('by Cerve')).toBeInTheDocument();
  });

  it('renders the Product section heading', () => {
    renderFooter();
    expect(screen.getByText('Product')).toBeInTheDocument();
  });

  it('renders the Resources section heading', () => {
    renderFooter();
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });

  it('renders the Company section heading', () => {
    renderFooter();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('renders internal router links (Product section)', () => {
    renderFooter();
    const featuresLink = screen.getByRole('link', { name: 'Features' });
    expect(featuresLink).toHaveAttribute('href', '/features');

    const faqLink = screen.getByRole('link', { name: 'FAQ' });
    expect(faqLink).toHaveAttribute('href', '/faq');
  });

  it('renders external links (Resources section)', () => {
    renderFooter();
    const githubLinks = screen.getAllByRole('link', { name: 'GitHub' });
    expect(githubLinks.length).toBeGreaterThan(0);
    githubLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders Privacy Policy link', () => {
    renderFooter();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('renders Terms of Service link', () => {
    renderFooter();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('renders the current year in copyright', () => {
    renderFooter();
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it('renders GitHub icon link with aria-label', () => {
    renderFooter();
    const githubIconLink = screen.getByRole('link', { name: 'Claw on GitHub' });
    expect(githubIconLink).toHaveAttribute('href', 'https://github.com/AsClaw/CerveAIClaw');
    expect(githubIconLink).toHaveAttribute('target', '_blank');
  });

  it('renders How It Works link', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: 'How It Works' })).toHaveAttribute('href', '/how-it-works');
  });

  it('renders Safety link', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: 'Safety' })).toHaveAttribute('href', '/safety');
  });
});
