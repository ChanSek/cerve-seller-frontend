import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../pages/HomePage';

describe('HomePage', () => {
  function renderHomePage() {
    return render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  }

  it('renders Hero section', () => {
    renderHomePage();
    expect(screen.getByText('Reimagined.')).toBeInTheDocument();
  });

  it('renders Products section', () => {
    renderHomePage();
    expect(screen.getByText('Our Products')).toBeInTheDocument();
  });

  it('renders Features section', () => {
    renderHomePage();
    expect(screen.getByText('Built for Modern Commerce')).toBeInTheDocument();
  });

  it('renders ONDC section', () => {
    renderHomePage();
    expect(screen.getByText('How ONDC Works')).toBeInTheDocument();
  });

  it('renders Categories section', () => {
    renderHomePage();
    expect(screen.getByText('Sell Across Categories')).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    renderHomePage();
    expect(screen.getByText(/Ready to Join the Open Network/i)).toBeInTheDocument();
  });
});
