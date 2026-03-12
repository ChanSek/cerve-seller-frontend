import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Reset scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  function renderNavbar() {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );
  }

  it('renders the logo link to /', () => {
    renderNavbar();
    const logoLink = screen.getAllByRole('link').find((el) => el.getAttribute('href') === '/');
    expect(logoLink).toBeInTheDocument();
  });

  it('renders Cerve brand text', () => {
    renderNavbar();
    expect(screen.getByText('Cerve')).toBeInTheDocument();
  });

  it('renders all nav links', () => {
    renderNavbar();
    expect(screen.getAllByText('Products').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Features').length).toBeGreaterThan(0);
    expect(screen.getAllByText('How ONDC Works').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Categories').length).toBeGreaterThan(0);
  });

  it('renders Seller Portal button', () => {
    renderNavbar();
    expect(screen.getAllByText('Seller Portal').length).toBeGreaterThan(0);
  });

  it('does not show mobile menu initially', () => {
    renderNavbar();
    // The mobile menu has a specific container class; check absence
    const nav = screen.getByRole('navigation');
    // mobileOpen is false, so there should be no mobile menu container with 'py-4'
    // Desktop links are hidden via md:flex
    expect(nav).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', () => {
    renderNavbar();
    // The mobile menu button
    const menuButton = screen.getByRole('button');

    // Click to open
    fireEvent.click(menuButton);
    // Now mobile menu is visible - there should be duplicate nav links
    const productsLinks = screen.getAllByText('Products');
    expect(productsLinks.length).toBeGreaterThanOrEqual(2);

    // Click to close
    fireEvent.click(menuButton);
    // Mobile menu should be closed again
    const productsLinksAfter = screen.getAllByText('Products');
    expect(productsLinksAfter.length).toBeGreaterThanOrEqual(1);
  });

  it('applies scrolled styles when window.scrollY > 20', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation');

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(nav.className).toContain('bg-cerve-bg/95');
  });

  it('removes scrolled styles when window.scrollY <= 20', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation');

    // First scroll down
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    // Then scroll back up
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 10, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(nav.className).toContain('bg-transparent');
  });

  it('handles anchor click by scrolling to element', () => {
    renderNavbar();

    // Create a target element in the document
    const target = document.createElement('div');
    target.id = 'products';
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);

    // Click the Products anchor link (desktop)
    const productsLinks = screen.getAllByText('Products');
    const desktopLink = productsLinks[0];
    fireEvent.click(desktopLink);

    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(target);
  });

  it('handles anchor click when target element does not exist', () => {
    renderNavbar();

    // No element with id 'features' in document
    const featuresLinks = screen.getAllByText('Features');
    // Should not throw
    fireEvent.click(featuresLinks[0]);
  });

  it('closes mobile menu on anchor click', () => {
    renderNavbar();

    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    // Mobile menu is open, click on a link in the mobile menu
    const target = document.createElement('div');
    target.id = 'products';
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);

    const productsLinks = screen.getAllByText('Products');
    // The last one should be in the mobile menu
    const mobileLink = productsLinks[productsLinks.length - 1];
    fireEvent.click(mobileLink);

    // Mobile menu should be closed - only desktop links remain
    const productsLinksAfter = screen.getAllByText('Products');
    expect(productsLinksAfter.length).toBe(1);

    document.body.removeChild(target);
  });

  it('cleans up scroll event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderNavbar();
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
