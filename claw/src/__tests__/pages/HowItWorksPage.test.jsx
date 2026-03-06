import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HowItWorksPage from '../../pages/HowItWorksPage';

const renderPage = () => render(<MemoryRouter><HowItWorksPage /></MemoryRouter>);

describe('HowItWorksPage', () => {
  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'How Claw Works', level: 1 })).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderPage();
    expect(screen.getByText(/From your voice command to task completion/)).toBeInTheDocument();
  });

  it('renders all pipeline stage names', () => {
    renderPage();
    expect(screen.getByText('User Input')).toBeInTheDocument();
    expect(screen.getByText('Task Planner')).toBeInTheDocument();
    expect(screen.getByText('Agent Loop')).toBeInTheDocument();
    expect(screen.getByText('Safety Gate')).toBeInTheDocument();
    expect(screen.getByText('UI Action Executor')).toBeInTheDocument();
    expect(screen.getByText('Result')).toBeInTheDocument();
  });

  it('renders pipeline stage descriptions', () => {
    renderPage();
    expect(screen.getByText(/Voice or text command is captured/)).toBeInTheDocument();
    expect(screen.getByText(/LLM breaks your command/)).toBeInTheDocument();
  });

  it('renders pipeline detail bullet points', () => {
    renderPage();
    expect(screen.getByText(/Speech-to-text via Sarvam or Google STT/)).toBeInTheDocument();
    expect(screen.getAllByText(/AccessibilityService/).length).toBeGreaterThan(0);
  });

  it('renders the Architecture Overview section', () => {
    renderPage();
    expect(screen.getByText('Architecture Overview')).toBeInTheDocument();
  });

  it('renders the ASCII architecture diagram', () => {
    renderPage();
    expect(screen.getByText(/LLM Task Planner/)).toBeInTheDocument();
  });

  it('renders the CTA section', () => {
    renderPage();
    expect(screen.getByText(/Ready to Let AI Handle Your Phone\?/)).toBeInTheDocument();
  });
});
