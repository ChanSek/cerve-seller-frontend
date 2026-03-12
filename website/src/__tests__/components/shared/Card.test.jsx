import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../../../components/shared/Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default className (empty string)', () => {
    const { container } = render(<Card>Test</Card>);
    const div = container.firstChild;
    expect(div).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="extra">Test</Card>);
    const div = container.firstChild;
    expect(div.className).toContain('extra');
  });

  it('has hover styles when hover is true (default)', () => {
    const { container } = render(<Card>Hover</Card>);
    const div = container.firstChild;
    expect(div.className).toContain('border border-white/5');
  });

  it('has hover styles when hover is explicitly true', () => {
    const { container } = render(<Card hover={true}>Hover</Card>);
    const div = container.firstChild;
    expect(div.className).toContain('border border-white/5');
  });

  it('has non-hover styles when hover is false', () => {
    const { container } = render(<Card hover={false}>NoHover</Card>);
    const div = container.firstChild;
    expect(div.className).toContain('border border-white/5');
  });

  it('applies gradient border class when gradient is true', () => {
    const { container } = render(<Card gradient={true}>Gradient</Card>);
    const div = container.firstChild;
    expect(div.className).toContain('border-gradient');
  });

  it('does not apply gradient border class when gradient is false (default)', () => {
    const { container } = render(<Card>NoGradient</Card>);
    const div = container.firstChild;
    expect(div.className).not.toContain('border-gradient');
  });
});
