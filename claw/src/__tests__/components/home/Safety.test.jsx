import { render, screen } from '@testing-library/react';
import Safety from '../../../components/home/Safety';

describe('Safety', () => {
  it('renders the section heading', () => {
    render(<Safety />);
    expect(screen.getByText('Safety is Non-Negotiable')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Safety />);
    expect(screen.getByText(/Every sensitive action requires your explicit approval/)).toBeInTheDocument();
  });

  it('renders Financial Protection card', () => {
    render(<Safety />);
    expect(screen.getByText('Financial Protection')).toBeInTheDocument();
    expect(screen.getByText(/All payment actions require explicit user confirmation/)).toBeInTheDocument();
  });

  it('renders Communication Guard card', () => {
    render(<Safety />);
    expect(screen.getByText('Communication Guard')).toBeInTheDocument();
    expect(screen.getByText(/Calls, messages, and emails are never sent without your approval/)).toBeInTheDocument();
  });

  it('renders Destructive Action Block card', () => {
    render(<Safety />);
    expect(screen.getByText('Destructive Action Block')).toBeInTheDocument();
  });

  it('renders Prompt Injection Defense card', () => {
    render(<Safety />);
    expect(screen.getByText('Prompt Injection Defense')).toBeInTheDocument();
  });

  it('renders the on-device privacy section', () => {
    render(<Safety />);
    expect(screen.getByText('Your Data Stays on Your Device')).toBeInTheDocument();
    expect(screen.getByText(/Screen content is processed locally/)).toBeInTheDocument();
  });
});
