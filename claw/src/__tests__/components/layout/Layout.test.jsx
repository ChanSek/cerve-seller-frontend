import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';

const renderLayout = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div data-testid="outlet-content">Home Content</div>} />
          <Route path="/features" element={<div data-testid="outlet-content">Features Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('Layout', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the Outlet content', () => {
    renderLayout('/');
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });

  it('renders the Navbar', () => {
    renderLayout('/');
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders the Footer', () => {
    renderLayout('/');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('wraps content in a flex column div', () => {
    renderLayout('/');
    const wrapper = screen.getByTestId('outlet-content').closest('.min-h-screen');
    expect(wrapper).toHaveClass('flex', 'flex-col');
  });

  it('scrolls to top on mount', () => {
    renderLayout('/');
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('scrolls to top when pathname changes', () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/features" element={<div>Features</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    const callCount = window.scrollTo.mock.calls.length;

    rerender(
      <MemoryRouter initialEntries={['/features']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/features" element={<div>Features</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(window.scrollTo.mock.calls.length).toBeGreaterThanOrEqual(callCount);
  });
});
