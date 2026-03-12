import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Features from '../../../components/home/Features';
import { features } from '../../../constants/features';

describe('Features', () => {
  function renderFeatures() {
    return render(
      <MemoryRouter>
        <Features />
      </MemoryRouter>
    );
  }

  it('renders the section heading', () => {
    renderFeatures();
    expect(screen.getByText('Built for Modern Commerce')).toBeInTheDocument();
    expect(screen.getByText(/Everything you need to sell/i)).toBeInTheDocument();
  });

  it('renders all feature titles', () => {
    renderFeatures();
    features.forEach((f) => {
      expect(screen.getByText(f.title)).toBeInTheDocument();
    });
  });

  it('renders all feature descriptions', () => {
    renderFeatures();
    features.forEach((f) => {
      expect(screen.getByText(f.description)).toBeInTheDocument();
    });
  });

  it('renders the features section', () => {
    const { container } = renderFeatures();
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
