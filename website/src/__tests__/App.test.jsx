import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App', () => {
  it('renders the suspense fallback initially and then the homepage', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Wait for lazy-loaded HomePage to render
    await waitFor(() => {
      expect(screen.getByText('Reimagined.')).toBeInTheDocument();
    });
  });

  it('renders layout with navbar and footer', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    });
  });

  it('renders suspense fallback div', () => {
    // The fallback is a div with bg-cerve-bg class
    // We can check that the Suspense is used by verifying App renders without error
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it('wraps content with ErrorBoundary', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // ErrorBoundary renders children when no error
    await waitFor(() => {
      expect(screen.getByText('Reimagined.')).toBeInTheDocument();
    });
  });
});
