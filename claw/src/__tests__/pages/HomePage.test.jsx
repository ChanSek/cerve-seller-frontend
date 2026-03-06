import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../pages/HomePage';

const renderHomePage = () => render(<MemoryRouter><HomePage /></MemoryRouter>);

describe('HomePage', () => {
  it('renders the Hero section', () => {
    renderHomePage();
    expect(screen.getByText(/AI-Powered/)).toBeInTheDocument();
  });

  it('renders the Features section', () => {
    renderHomePage();
    expect(screen.getByText('Powerful by Design')).toBeInTheDocument();
  });

  it('renders the How It Works section', () => {
    renderHomePage();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders the Demo section', () => {
    renderHomePage();
    expect(screen.getByText('See Claw in Action')).toBeInTheDocument();
  });

  it('renders the Actions section', () => {
    renderHomePage();
    expect(screen.getByText('What Claw Can Do')).toBeInTheDocument();
  });

  it('renders the Safety section', () => {
    renderHomePage();
    expect(screen.getByText('Safety is Non-Negotiable')).toBeInTheDocument();
  });

  it('renders the FAQ section with limit of 6', () => {
    renderHomePage();
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('renders the CTA section', () => {
    renderHomePage();
    expect(screen.getByText(/Ready to Let AI Handle Your Phone\?/)).toBeInTheDocument();
  });
});
