import { render } from '@testing-library/react';
import Icon from '../../../components/shared/Icon';

const knownIcons = [
  'mic', 'brain', 'smartphone', 'shield', 'puzzle', 'route', 'grid',
  'pointer', 'keyboard', 'scroll', 'arrow-left', 'home', 'clock',
  'camera', 'hand', 'toggle', 'folder', 'bell', 'swipe', 'check', 'x',
  'chevronDown', 'download', 'play', 'menu', 'eye', 'sparkle', 'list',
  'workflow', 'form', 'compass', 'layers', 'lock', 'checklist', 'device',
  'terminal', 'webhook', 'github',
];

describe('Icon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<Icon name="mic" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies the size prop as width and height', () => {
    const { container } = render(<Icon name="mic" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('uses default size of 24', () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('applies className prop to the SVG', () => {
    const { container } = render(<Icon name="mic" className="text-red-500" />);
    expect(container.querySelector('svg')).toHaveClass('text-red-500');
  });

  it('falls back to sparkle icon for unknown name', () => {
    const { container: c1 } = render(<Icon name="unknown-icon-xyz" />);
    const { container: c2 } = render(<Icon name="sparkle" />);
    // Both should render an SVG with a path
    expect(c1.querySelector('svg path')).toBeInTheDocument();
    expect(c2.querySelector('svg path')).toBeInTheDocument();
    // The paths should be identical (sparkle fallback)
    expect(c1.querySelector('svg path').getAttribute('d')).toBe(
      c2.querySelector('svg path').getAttribute('d'),
    );
  });

  it.each(knownIcons)('renders icon: %s', (name) => {
    const { container } = render(<Icon name={name} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('svg path')).toBeInTheDocument();
  });
});
