import { render, screen } from '@testing-library/react';
import Features from '../../../components/home/Features';
import { features } from '../../../constants/features';

describe('Features', () => {
  it('renders the section heading', () => {
    render(<Features />);
    expect(screen.getByText('Powerful by Design')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Features />);
    expect(screen.getByText(/Built with intelligence/)).toBeInTheDocument();
  });

  it('renders all feature titles', () => {
    render(<Features />);
    features.forEach((f) => {
      expect(screen.getByText(f.title)).toBeInTheDocument();
    });
  });

  it('renders all feature descriptions', () => {
    render(<Features />);
    features.forEach((f) => {
      expect(screen.getByText(f.description)).toBeInTheDocument();
    });
  });

  it('renders the correct number of feature cards', () => {
    render(<Features />);
    const cards = screen.getAllByRole('heading', { level: 3 });
    expect(cards).toHaveLength(features.length);
  });
});
