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
  it('renders the home page at /', () => {
    renderApp('/');
    expect(screen.getByText(/AI-Powered/)).toBeInTheDocument();
  });

  it('renders the features page at /features', () => {
    renderApp('/features');
    expect(screen.getByRole('heading', { name: 'Features', level: 1 })).toBeInTheDocument();
  });

  it('renders the how-it-works page at /how-it-works', () => {
    renderApp('/how-it-works');
    expect(screen.getByRole('heading', { name: 'How Claw Works', level: 1 })).toBeInTheDocument();
  });

  it('renders the safety page at /safety', () => {
    renderApp('/safety');
    expect(screen.getByRole('heading', { name: 'Safety & Privacy', level: 1 })).toBeInTheDocument();
  });

  it('renders the FAQ page at /faq', () => {
    renderApp('/faq');
    expect(screen.getByRole('heading', { name: 'FAQ', level: 1 })).toBeInTheDocument();
  });

  it('wraps all pages with Layout (Navbar + Footer)', () => {
    renderApp('/');
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
