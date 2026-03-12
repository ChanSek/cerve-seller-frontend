import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ONDC from '../../../components/home/ONDC';
import { ondcSteps } from '../../../constants/features';

describe('ONDC', () => {
  function renderONDC() {
    return render(
      <MemoryRouter>
        <ONDC />
      </MemoryRouter>
    );
  }

  it('renders the section heading', () => {
    renderONDC();
    expect(screen.getByText('How ONDC Works')).toBeInTheDocument();
    expect(screen.getByText(/India's open network democratizes/i)).toBeInTheDocument();
  });

  it('renders the ONDC explainer card', () => {
    renderONDC();
    expect(screen.getByText('Open Network for Digital Commerce')).toBeInTheDocument();
    expect(screen.getByText(/ONDC is a government-backed initiative/i)).toBeInTheDocument();
  });

  it('renders all step numbers', () => {
    renderONDC();
    ondcSteps.forEach((s) => {
      expect(screen.getByText(s.step)).toBeInTheDocument();
    });
  });

  it('renders all step titles', () => {
    renderONDC();
    ondcSteps.forEach((s) => {
      expect(screen.getByText(s.title)).toBeInTheDocument();
    });
  });

  it('renders all step descriptions', () => {
    renderONDC();
    ondcSteps.forEach((s) => {
      expect(screen.getByText(s.description)).toBeInTheDocument();
    });
  });

  it('renders the ondc section', () => {
    const { container } = renderONDC();
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
