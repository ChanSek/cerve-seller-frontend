import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeaturesPage from '../../pages/FeaturesPage';
import { features, detailedFeatures } from '../../constants/features';

const renderPage = () => render(<MemoryRouter><FeaturesPage /></MemoryRouter>);

describe('FeaturesPage', () => {
  it('renders the hero heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Features', level: 1 })).toBeInTheDocument();
  });

  it('renders the hero subtitle', () => {
    renderPage();
    expect(screen.getByText(/Every capability designed to make your phone smarter/)).toBeInTheDocument();
  });

  it('renders all overview feature cards', () => {
    renderPage();
    features.forEach((f) => {
      expect(screen.getAllByText(f.title).length).toBeGreaterThan(0);
    });
  });

  it('renders all detailed feature categories', () => {
    renderPage();
    detailedFeatures.forEach((cat) => {
      expect(screen.getByText(cat.category)).toBeInTheDocument();
    });
  });

  it('renders all detailed feature items', () => {
    renderPage();
    detailedFeatures.forEach((cat) => {
      cat.items.forEach((item) => {
        expect(screen.getAllByText(item.title).length).toBeGreaterThan(0);
      });
    });
  });

  it('renders the Plugin API Preview section', () => {
    renderPage();
    expect(screen.getByText('Plugin API Preview')).toBeInTheDocument();
  });

  it('renders the ZomatoPlugin code snippet', () => {
    renderPage();
    expect(screen.getAllByText(/ZomatoPlugin/).length).toBeGreaterThan(0);
  });

  it('renders the CTA section', () => {
    renderPage();
    expect(screen.getByText(/Ready to Let AI Handle Your Phone\?/)).toBeInTheDocument();
  });
});
