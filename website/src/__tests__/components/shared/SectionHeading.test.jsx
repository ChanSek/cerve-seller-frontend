import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionHeading from '../../../components/shared/SectionHeading';

describe('SectionHeading', () => {
  it('renders the title', () => {
    render(<SectionHeading title="My Title" />);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders the subtitle when provided', () => {
    render(<SectionHeading title="Title" subtitle="My Subtitle" />);
    expect(screen.getByText('My Subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle paragraph when subtitle is not provided', () => {
    const { container } = render(<SectionHeading title="Title" />);
    const p = container.querySelector('p');
    expect(p).toBeNull();
  });

  it('applies gradient text class when gradient is true (default)', () => {
    render(<SectionHeading title="Gradient Title" />);
    const h2 = screen.getByText('Gradient Title');
    expect(h2.className).toContain('text-gradient');
  });

  it('applies white text class when gradient is false', () => {
    render(<SectionHeading title="White Title" gradient={false} />);
    const h2 = screen.getByText('White Title');
    expect(h2.className).toContain('text-white');
    expect(h2.className).not.toContain('text-gradient');
  });

  it('aligns center by default', () => {
    const { container } = render(<SectionHeading title="Center" />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('text-center');
  });

  it('aligns left when align="left"', () => {
    const { container } = render(<SectionHeading title="Left" align="left" />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('text-left');
  });
});
