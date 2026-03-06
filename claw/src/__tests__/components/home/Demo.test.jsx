import { render, screen } from '@testing-library/react';
import Demo from '../../../components/home/Demo';

describe('Demo', () => {
  it('renders the section heading', () => {
    render(<Demo />);
    expect(screen.getByText('See Claw in Action')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Demo />);
    expect(screen.getByText('Real tasks, autonomously completed.')).toBeInTheDocument();
  });

  it('renders all three demo cards', () => {
    render(<Demo />);
    expect(screen.getByText('Order Food from Zomato')).toBeInTheDocument();
    expect(screen.getByText('Send a WhatsApp Message')).toBeInTheDocument();
    expect(screen.getByText('Toggle System Settings')).toBeInTheDocument();
  });

  it('renders demo command descriptions', () => {
    render(<Demo />);
    expect(screen.getByText(/"Order butter chicken from the nearest restaurant"/)).toBeInTheDocument();
  });

  it('renders step numbers inside each demo', () => {
    render(<Demo />);
    const stepNumbers = screen.getAllByText('1');
    expect(stepNumbers.length).toBeGreaterThanOrEqual(3);
  });

  it('renders the Zomato demo steps', () => {
    render(<Demo />);
    expect(screen.getByText('Opens Zomato')).toBeInTheDocument();
    expect(screen.getByText('Asks confirmation before payment')).toBeInTheDocument();
  });

  it('renders the WhatsApp demo steps', () => {
    render(<Demo />);
    expect(screen.getByText('Opens WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Sends automatically')).toBeInTheDocument();
  });
});
