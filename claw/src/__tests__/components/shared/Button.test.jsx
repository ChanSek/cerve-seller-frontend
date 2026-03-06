import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Button from '../../../components/shared/Button';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Button', () => {
  it('renders a <button> by default', () => {
    renderWithRouter(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders a <Link> when to prop is provided', () => {
    renderWithRouter(<Button to="/features">Go</Button>);
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/features');
  });

  it('renders an <a> when href prop is provided', () => {
    renderWithRouter(<Button href="https://example.com">External</Button>);
    const link = screen.getByRole('link', { name: 'External' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders <Link> over <a> when both to and href are provided', () => {
    renderWithRouter(<Button to="/page" href="https://example.com">Both</Button>);
    // to takes priority — renders Link with href="/page"
    const link = screen.getByRole('link', { name: 'Both' });
    expect(link).toHaveAttribute('href', '/page');
    expect(link).not.toHaveAttribute('target', '_blank');
  });

  it('applies primary variant classes by default', () => {
    renderWithRouter(<Button>Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('glow-primary');
  });

  it('applies secondary variant classes', () => {
    renderWithRouter(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-claw-elevated');
  });

  it('applies outline variant classes', () => {
    renderWithRouter(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-claw-muted/30');
  });

  it('applies sm size classes', () => {
    renderWithRouter(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');
  });

  it('applies md size classes by default', () => {
    renderWithRouter(<Button>Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-base');
  });

  it('applies lg size classes', () => {
    renderWithRouter(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-8', 'py-4', 'text-lg');
  });

  it('merges custom className', () => {
    renderWithRouter(<Button className="my-custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('my-custom-class');
  });

  it('passes extra props to the underlying element', () => {
    renderWithRouter(<Button data-testid="btn-extra" disabled>Disabled</Button>);
    expect(screen.getByTestId('btn-extra')).toBeDisabled();
  });

  it('renders children', () => {
    renderWithRouter(<Button><span>Child</span></Button>);
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
