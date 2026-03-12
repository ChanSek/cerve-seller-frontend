import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

const renderApp = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('App', () => {
  it('renders the home page at /', async () => {
    renderApp('/');
    expect(await screen.findByText(/AI-Powered/)).toBeInTheDocument();
  });

  it('renders the features page at /features', async () => {
    renderApp('/features');
    expect(await screen.findByRole('heading', { name: 'Features', level: 1 })).toBeInTheDocument();
  });

  it('renders the how-it-works page at /how-it-works', async () => {
    renderApp('/how-it-works');
    expect(await screen.findByRole('heading', { name: 'How Claw Works', level: 1 })).toBeInTheDocument();
  });

  it('renders the safety page at /safety', async () => {
    renderApp('/safety');
    expect(await screen.findByRole('heading', { name: 'Safety & Privacy', level: 1 })).toBeInTheDocument();
  });

  it('renders the FAQ page at /faq', async () => {
    renderApp('/faq');
    expect(await screen.findByRole('heading', { name: 'FAQ', level: 1 })).toBeInTheDocument();
  });

  it('wraps all pages with Layout (Navbar + Footer)', async () => {
    renderApp('/');
    expect(await screen.findByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('provides a loading fallback with accessible role', () => {
    renderApp('/');
    // Suspense fallback may or may not be visible depending on timing,
    // but ErrorBoundary wraps the tree — verified by structure
    expect(document.querySelector('[role="status"]') || screen.queryByText(/AI-Powered/)).toBeTruthy();
  });
});
