import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnimatedSection from '../../../components/shared/AnimatedSection';

describe('AnimatedSection', () => {
  it('renders children', () => {
    render(<AnimatedSection>Section content</AnimatedSection>);
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('renders a section element', () => {
    const { container } = render(<AnimatedSection>Test</AnimatedSection>);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<AnimatedSection className="my-class">Test</AnimatedSection>);
    const section = container.querySelector('section');
    expect(section.className).toContain('my-class');
  });

  it('applies default empty className', () => {
    const { container } = render(<AnimatedSection>Test</AnimatedSection>);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('accepts delay prop without error', () => {
    render(<AnimatedSection delay={0.5}>Delayed</AnimatedSection>);
    expect(screen.getByText('Delayed')).toBeInTheDocument();
  });
});
