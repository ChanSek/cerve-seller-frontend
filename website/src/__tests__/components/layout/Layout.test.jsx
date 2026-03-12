import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';

// We need to test that Layout renders Navbar, Outlet, Footer
// and calls window.scrollTo on pathname change

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Layout', () => {
  it('renders navbar, main content area, and footer', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>
    );
    // Navbar renders the Cerve brand text
    expect(screen.getAllByText('Cerve').length).toBeGreaterThan(0);
    // Footer renders copyright text
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    scrollToSpy.mockRestore();
  });

  it('calls window.scrollTo(0, 0) on mount', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>
    );
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    scrollToSpy.mockRestore();
  });

  it('renders with correct structure (min-h-screen flex)', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>
    );
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('min-h-screen');
    expect(wrapper.className).toContain('flex');
    scrollToSpy.mockRestore();
  });
});
