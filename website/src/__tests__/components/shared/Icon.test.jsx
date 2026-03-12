import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Icon from '../../../components/shared/Icon';

describe('Icon', () => {
  it('renders an svg element', () => {
    const { container } = render(<Icon name="store" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('uses default size of 24', () => {
    const { container } = render(<Icon name="store" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('applies custom size', () => {
    const { container } = render(<Icon name="store" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('applies custom className', () => {
    const { container } = render(<Icon name="store" className="text-red" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-red');
  });

  it('uses empty string as default className', () => {
    const { container } = render(<Icon name="store" />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('class')).toBe('');
  });

  it('renders known icon (store)', () => {
    const { container } = render(<Icon name="store" />);
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
  });

  it('renders sparkle icon for unknown name', () => {
    const { container: unknownContainer } = render(<Icon name="nonexistent_icon_xyz" />);
    const { container: sparkleContainer } = render(<Icon name="sparkle" />);
    // Both should have the same path content (sparkle fallback)
    const unknownPath = unknownContainer.querySelector('path');
    const sparklePath = sparkleContainer.querySelector('path');
    expect(unknownPath.getAttribute('d')).toBe(sparklePath.getAttribute('d'));
  });

  it('renders different icons correctly', () => {
    const iconNames = [
      'store', 'sparkle', 'shield', 'globe', 'chart', 'bolt', 'grid',
      'truck', 'search', 'currency', 'phone', 'brain', 'arrowRight',
      'check', 'chevronDown', 'menu', 'x', 'github', 'users', 'layers', 'package',
    ];
    iconNames.forEach((name) => {
      const { container } = render(<Icon name={name} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(container.querySelector('path')).toBeInTheDocument();
    });
  });
});
