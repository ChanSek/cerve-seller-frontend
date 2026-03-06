import { render, screen } from '@testing-library/react';
import SectionHeading from '../../../components/shared/SectionHeading';

describe('SectionHeading', () => {
  it('renders the title', () => {
    render(<SectionHeading title="My Title" />);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<SectionHeading title="Title" subtitle="A subtitle" />);
    expect(screen.getByText('A subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle element when subtitle is not provided', () => {
    render(<SectionHeading title="Title" />);
    expect(screen.queryByText(/subtitle/i)).not.toBeInTheDocument();
  });

  it('applies text-gradient class when gradient=true (default)', () => {
    render(<SectionHeading title="Gradient Title" />);
    expect(screen.getByText('Gradient Title')).toHaveClass('text-gradient');
  });

  it('applies text-white class when gradient=false', () => {
    render(<SectionHeading title="No Gradient" gradient={false} />);
    expect(screen.getByText('No Gradient')).toHaveClass('text-white');
    expect(screen.getByText('No Gradient')).not.toHaveClass('text-gradient');
  });

  it('applies text-center class when align=center (default)', () => {
    render(<SectionHeading title="Centered" />);
    const wrapper = screen.getByText('Centered').closest('div');
    expect(wrapper).toHaveClass('text-center');
  });

  it('applies text-left class when align=left', () => {
    render(<SectionHeading title="Left" align="left" />);
    const wrapper = screen.getByText('Left').closest('div');
    expect(wrapper).toHaveClass('text-left');
    expect(wrapper).not.toHaveClass('text-center');
  });
});
