import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Button from '../../../components/shared/Button';

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('Button', () => {
  describe('renders as <button> by default', () => {
    it('renders button element when no to or href', () => {
      renderWithRouter(<Button>Click</Button>);
      const btn = screen.getByRole('button', { name: /click/i });
      expect(btn).toBeInTheDocument();
      expect(btn.tagName).toBe('BUTTON');
    });
  });

  describe('renders as <Link> when to prop is provided', () => {
    it('renders a Link (anchor) element', () => {
      renderWithRouter(<Button to="/about">About</Button>);
      const link = screen.getByRole('link', { name: /about/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/about');
    });
  });

  describe('renders as <a> when href prop is provided', () => {
    it('renders an anchor with target _blank', () => {
      renderWithRouter(<Button href="https://example.com">External</Button>);
      const link = screen.getByRole('link', { name: /external/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('variants', () => {
    it('applies primary variant classes by default', () => {
      renderWithRouter(<Button>Primary</Button>);
      const btn = screen.getByRole('button', { name: /primary/i });
      expect(btn.className).toContain('bg-cerve-gradient');
    });

    it('applies secondary variant classes', () => {
      renderWithRouter(<Button variant="secondary">Sec</Button>);
      const btn = screen.getByRole('button', { name: /sec/i });
      expect(btn.className).toContain('bg-cerve-elevated');
    });

    it('applies outline variant classes', () => {
      renderWithRouter(<Button variant="outline">Out</Button>);
      const btn = screen.getByRole('button', { name: /out/i });
      expect(btn.className).toContain('text-cerve-muted');
    });
  });

  describe('sizes', () => {
    it('applies md size by default', () => {
      renderWithRouter(<Button>Md</Button>);
      const btn = screen.getByRole('button', { name: /md/i });
      expect(btn.className).toContain('px-6');
    });

    it('applies sm size', () => {
      renderWithRouter(<Button size="sm">Sm</Button>);
      const btn = screen.getByRole('button', { name: /sm/i });
      expect(btn.className).toContain('px-4');
    });

    it('applies lg size', () => {
      renderWithRouter(<Button size="lg">Lg</Button>);
      const btn = screen.getByRole('button', { name: /lg/i });
      expect(btn.className).toContain('px-8');
    });
  });

  describe('className prop', () => {
    it('appends custom className', () => {
      renderWithRouter(<Button className="custom-class">Custom</Button>);
      const btn = screen.getByRole('button', { name: /custom/i });
      expect(btn.className).toContain('custom-class');
    });

    it('uses empty string as default className', () => {
      renderWithRouter(<Button>Default</Button>);
      const btn = screen.getByRole('button', { name: /default/i });
      expect(btn).toBeInTheDocument();
    });
  });

  describe('additional props', () => {
    it('passes extra props to button', () => {
      renderWithRouter(<Button data-testid="my-btn">Test</Button>);
      expect(screen.getByTestId('my-btn')).toBeInTheDocument();
    });

    it('passes extra props to Link', () => {
      renderWithRouter(<Button to="/x" data-testid="my-link">Link</Button>);
      expect(screen.getByTestId('my-link')).toBeInTheDocument();
    });

    it('passes extra props to anchor', () => {
      renderWithRouter(<Button href="https://x.com" data-testid="my-a">Ext</Button>);
      expect(screen.getByTestId('my-a')).toBeInTheDocument();
    });
  });

  describe('children', () => {
    it('renders children content', () => {
      renderWithRouter(<Button>Hello World</Button>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });
});
