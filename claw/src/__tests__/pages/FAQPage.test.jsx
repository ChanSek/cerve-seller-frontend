import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FAQPage from '../../pages/FAQPage';
import { faqItems } from '../../constants/faq';

const renderPage = () => render(<MemoryRouter><FAQPage /></MemoryRouter>);

describe('FAQPage', () => {
  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'FAQ', level: 1 })).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderPage();
    expect(screen.getByText('Everything you need to know about Claw, answered.')).toBeInTheDocument();
  });

  it('renders FAQ component with limit=null (all items)', () => {
    renderPage();
    faqItems.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    });
  });

  it('renders the CTA section', () => {
    renderPage();
    expect(screen.getByText(/Ready to Let AI Handle Your Phone\?/)).toBeInTheDocument();
  });
});
