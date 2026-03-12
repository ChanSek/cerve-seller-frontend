import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../../../components/layout/Footer';

describe('Footer', () => {
  function renderFooter() {
    return render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
  }

  it('renders the Cerve brand text', () => {
    renderFooter();
    expect(screen.getByText('Cerve')).toBeInTheDocument();
  });

  it('renders the tagline text', () => {
    renderFooter();
    expect(screen.getByText(/Open commerce for everyone/i)).toBeInTheDocument();
    expect(screen.getByText(/Powered by ONDC/i)).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    renderFooter();
    const img = screen.getByAltText('Cerve');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/cerve-logo.png');
  });

  it('renders GitHub icon link', () => {
    renderFooter();
    const ghLink = screen.getByRole('link', { name: '' });
    // Check it points to github
    const allLinks = screen.getAllByRole('link');
    const githubLink = allLinks.find((l) => l.getAttribute('href') === 'https://github.com/AsClaw');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('renders Platform links', () => {
    renderFooter();
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Seller Portal')).toBeInTheDocument();
    expect(screen.getByText('Claw AI')).toBeInTheDocument();
  });

  it('renders Resources links', () => {
    renderFooter();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('ONDC')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders Company links', () => {
    renderFooter();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    renderFooter();
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}`))).toBeInTheDocument();
  });

  it('renders Privacy Policy and Terms of Service links', () => {
    renderFooter();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('external links have target="_blank" and rel attributes', () => {
    renderFooter();
    const sellerLink = screen.getByText('Seller Portal').closest('a');
    expect(sellerLink).toHaveAttribute('target', '_blank');
    expect(sellerLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
