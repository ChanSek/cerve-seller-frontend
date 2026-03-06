import { render, screen } from '@testing-library/react';
import Card from '../../../components/shared/Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Card content</p></Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Card><span>test</span></Card>);
    const card = screen.getByText('test').parentElement;
    expect(card).toHaveClass('rounded-xl', 'bg-claw-card', 'p-6');
  });

  it('applies border without gradient by default', () => {
    render(<Card><span data-testid="c">test</span></Card>);
    const card = screen.getByTestId('c').parentElement;
    expect(card).toHaveClass('border', 'border-white/5');
    expect(card).not.toHaveClass('border-gradient');
  });

  it('applies border-gradient class when gradient=true', () => {
    render(<Card gradient><span data-testid="c">test</span></Card>);
    const card = screen.getByTestId('c').parentElement;
    expect(card).toHaveClass('border-gradient');
    expect(card).not.toHaveClass('border-white/5');
  });

  it('merges additional className', () => {
    render(<Card className="extra-class"><span data-testid="c">test</span></Card>);
    expect(screen.getByTestId('c').parentElement).toHaveClass('extra-class');
  });

  it('renders with hover=false without throwing', () => {
    render(<Card hover={false}><span>no hover</span></Card>);
    expect(screen.getByText('no hover')).toBeInTheDocument();
  });

  it('renders with hover=true (default) without throwing', () => {
    render(<Card hover={true}><span>hover</span></Card>);
    expect(screen.getByText('hover')).toBeInTheDocument();
  });
});
