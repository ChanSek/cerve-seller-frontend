import { render, screen } from '@testing-library/react';
import AnimatedSection from '../../../components/shared/AnimatedSection';

describe('AnimatedSection', () => {
  it('renders children', () => {
    render(<AnimatedSection><p>Section content</p></AnimatedSection>);
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('applies className prop', () => {
    render(<AnimatedSection className="py-24"><span data-testid="c">content</span></AnimatedSection>);
    const section = screen.getByTestId('c').closest('section');
    expect(section).toHaveClass('py-24');
  });

  it('renders without className (default empty string)', () => {
    render(<AnimatedSection><span data-testid="c">content</span></AnimatedSection>);
    expect(screen.getByTestId('c').closest('section')).toBeInTheDocument();
  });

  it('renders with delay prop without throwing', () => {
    render(<AnimatedSection delay={0.3}><span>delayed</span></AnimatedSection>);
    expect(screen.getByText('delayed')).toBeInTheDocument();
  });

  it('renders with zero delay', () => {
    render(<AnimatedSection delay={0}><span>zero delay</span></AnimatedSection>);
    expect(screen.getByText('zero delay')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <AnimatedSection>
        <p>First</p>
        <p>Second</p>
      </AnimatedSection>,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
