import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CTA from '../../../components/home/CTA';

describe('CTA', () => {
  function renderCTA() {
    return render(
      <MemoryRouter>
        <CTA />
      </MemoryRouter>
    );
  }

  it('renders the heading', () => {
    renderCTA();
    expect(screen.getByText(/Ready to Join the Open Network/i)).toBeInTheDocument();
  });

  it('renders the description', () => {
    renderCTA();
    expect(screen.getByText(/Start selling on ONDC today/i)).toBeInTheDocument();
  });

  it('renders Open Seller Portal button', () => {
    renderCTA();
    const link = screen.getByText('Open Seller Portal').closest('a');
    expect(link).toHaveAttribute('href', 'https://seller.cerve.in');
  });

  it('renders Explore Claw AI button', () => {
    renderCTA();
    const link = screen.getByText('Explore Claw AI').closest('a');
    expect(link).toHaveAttribute('href', 'https://claw.cerve.in');
  });
});
