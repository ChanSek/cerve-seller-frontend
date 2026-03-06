import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CTA from '../../../components/home/CTA';

const renderCTA = () => render(<MemoryRouter><CTA /></MemoryRouter>);

describe('CTA', () => {
  it('renders the heading', () => {
    renderCTA();
    expect(screen.getByText(/Ready to Let AI Handle Your Phone\?/)).toBeInTheDocument();
  });

  it('renders the description paragraph', () => {
    renderCTA();
    expect(screen.getByText(/Download Claw, set up your preferred LLM/)).toBeInTheDocument();
  });

  it('renders the Download for Android button', () => {
    renderCTA();
    const downloadBtn = screen.getByRole('link', { name: /Download for Android/i });
    expect(downloadBtn).toBeInTheDocument();
    expect(downloadBtn).toHaveAttribute('target', '_blank');
  });

  it('renders the View on GitHub button', () => {
    renderCTA();
    const githubBtn = screen.getByRole('link', { name: /View on GitHub/i });
    expect(githubBtn).toBeInTheDocument();
    expect(githubBtn).toHaveAttribute('target', '_blank');
  });

  it('mentions open source and safety', () => {
    renderCTA();
    expect(screen.getByText(/open source/i)).toBeInTheDocument();
    expect(screen.getByText(/safety/i)).toBeInTheDocument();
  });
});
