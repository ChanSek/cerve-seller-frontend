import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hero from '../../../components/home/Hero';

describe('Hero', () => {
  function renderHero() {
    return render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
  }

  it('renders the ONDC badge', () => {
    renderHero();
    expect(screen.getByText(/Powered by ONDC — India's Open Commerce Network/)).toBeInTheDocument();
  });

  it('renders the main headline', () => {
    renderHero();
    expect(screen.getByText('Commerce,')).toBeInTheDocument();
    expect(screen.getByText('Reimagined.')).toBeInTheDocument();
  });

  it('renders the description paragraph', () => {
    renderHero();
    expect(screen.getByText(/The open platform that connects sellers/i)).toBeInTheDocument();
  });

  it('renders Start Selling button', () => {
    renderHero();
    expect(screen.getByText('Start Selling')).toBeInTheDocument();
  });

  it('renders Try Claw AI button', () => {
    renderHero();
    expect(screen.getByText('Try Claw AI')).toBeInTheDocument();
  });

  it('renders all stats', () => {
    renderHero();
    expect(screen.getByText('6+')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('20+')).toBeInTheDocument();
    expect(screen.getByText('Buyer Apps')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Search Strategies')).toBeInTheDocument();
  });

  it('renders button links with correct hrefs', () => {
    renderHero();
    const links = screen.getAllByRole('link');
    const sellerLink = links.find((l) => l.getAttribute('href') === 'https://seller.cerve.in');
    const clawLink = links.find((l) => l.getAttribute('href') === 'https://claw.cerve.in');
    expect(sellerLink).toBeInTheDocument();
    expect(clawLink).toBeInTheDocument();
  });
});
