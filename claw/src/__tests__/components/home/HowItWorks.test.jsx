import { render, screen } from '@testing-library/react';
import HowItWorks from '../../../components/home/HowItWorks';

describe('HowItWorks', () => {
  it('renders the section heading', () => {
    render(<HowItWorks />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Three simple steps from command to completion.')).toBeInTheDocument();
  });

  it('renders all three steps', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Speak or Type')).toBeInTheDocument();
    expect(screen.getByText('Claw Plans & Executes')).toBeInTheDocument();
    expect(screen.getByText('Confirms Before Acting')).toBeInTheDocument();
  });

  it('renders step numbers', () => {
    render(<HowItWorks />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
  });

  it('renders step descriptions', () => {
    render(<HowItWorks />);
    expect(screen.getByText(/Give a natural language command/)).toBeInTheDocument();
    expect(screen.getByText(/breaks your command into steps/)).toBeInTheDocument();
    expect(screen.getByText(/explicit confirmation/)).toBeInTheDocument();
  });
});
