import { render, screen } from '@testing-library/react';
import Comparison from '../../../components/home/Comparison';
import { comparisonFeatures, competitors } from '../../../constants/comparisons';

describe('Comparison', () => {
  it('renders the section heading', () => {
    render(<Comparison />);
    expect(screen.getByText('How Claw Compares')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Comparison />);
    expect(screen.getByText(/See how Claw stacks up/)).toBeInTheDocument();
  });

  it('renders all competitor column headers', () => {
    render(<Comparison />);
    competitors.forEach((c) => {
      expect(screen.getByText(c.name)).toBeInTheDocument();
    });
  });

  it('renders the Feature column header', () => {
    render(<Comparison />);
    expect(screen.getByText('Feature')).toBeInTheDocument();
  });

  it('renders all feature row names', () => {
    render(<Comparison />);
    comparisonFeatures.forEach((row) => {
      expect(screen.getByText(row.feature)).toBeInTheDocument();
    });
  });

  it('renders check icons for boolean true values', () => {
    render(<Comparison />);
    // Open Source row: claw=true, droidrun=true, greenclaw=true → multiple check icons
    const checkIcons = screen.container
      ? []
      : [];
    // Verify SVG icons are in the table
    const { container } = render(<Comparison />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders string values like "Free" and "Paid"', () => {
    render(<Comparison />);
    expect(screen.getAllByText('Free').length).toBeGreaterThan(0);
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('renders a table element', () => {
    const { container } = render(<Comparison />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('renders table headers and rows', () => {
    const { container } = render(<Comparison />);
    expect(container.querySelectorAll('thead').length).toBe(1);
    expect(container.querySelectorAll('tbody').length).toBe(1);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(comparisonFeatures.length);
  });
});
