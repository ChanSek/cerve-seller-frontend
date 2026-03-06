import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SafetyPage from '../../pages/SafetyPage';

const renderPage = () => render(<MemoryRouter><SafetyPage /></MemoryRouter>);

describe('SafetyPage', () => {
  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Safety & Privacy', level: 1 })).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderPage();
    expect(screen.getByText(/AI automation without compromising your security/)).toBeInTheDocument();
  });

  it('renders the No-Auto-Approval Philosophy section', () => {
    renderPage();
    expect(screen.getByText('The No-Auto-Approval Philosophy')).toBeInTheDocument();
    expect(screen.getByText(/Other AI agents optimize for convenience/)).toBeInTheDocument();
  });

  it('renders all safety layer titles', () => {
    renderPage();
    expect(screen.getByText('Safety Gate System')).toBeInTheDocument();
    expect(screen.getByText('Screen Content Sanitizer')).toBeInTheDocument();
    expect(screen.getByText('App Allowlist')).toBeInTheDocument();
    expect(screen.getByText('Local-First Processing')).toBeInTheDocument();
  });

  it('renders safety layer descriptions', () => {
    renderPage();
    expect(screen.getByText(/core safety mechanism/)).toBeInTheDocument();
    expect(screen.getByText(/prompt injection attacks/)).toBeInTheDocument();
  });

  it('renders safety layer bullet points', () => {
    renderPage();
    expect(screen.getByText(/Financial actions .* always require confirmation/)).toBeInTheDocument();
    expect(screen.getByText(/Whitelist specific apps/)).toBeInTheDocument();
  });

  it('renders the Real Threat Scenarios section', () => {
    renderPage();
    expect(screen.getByText('Real Threat Scenarios')).toBeInTheDocument();
  });

  it('renders all threat scenarios', () => {
    renderPage();
    expect(screen.getByText(/Ignore previous instructions/)).toBeInTheDocument();
    expect(screen.getByText(/malicious notification/)).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    renderPage();
    expect(screen.getByText(/Ready to Let AI Handle Your Phone\?/)).toBeInTheDocument();
  });
});
