import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';

const renderNavbar = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>,
  );

describe('Navbar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // Reset scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('renders the nav element', () => {
    renderNavbar();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders the Claw logo text', () => {
    renderNavbar();
    expect(screen.getByText('law')).toBeInTheDocument();
    expect(screen.getByText('by Cerve')).toBeInTheDocument();
  });

  it('renders all desktop nav links', () => {
    renderNavbar();
    expect(screen.getAllByRole('link', { name: 'Features' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'How It Works' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Safety' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'FAQ' }).length).toBeGreaterThan(0);
  });

  it('renders the Download button', () => {
    renderNavbar();
    expect(screen.getAllByRole('link', { name: /Download/i }).length).toBeGreaterThan(0);
  });

  it('starts with transparent background (not scrolled)', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-transparent');
  });

  it('adds scrolled background class after scrolling past 20px', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation');

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 50, configurable: true });
      fireEvent.scroll(window);
    });

    expect(nav).not.toHaveClass('bg-transparent');
  });

  it('returns to transparent background when scrolled back to top', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation');

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 50, configurable: true });
      fireEvent.scroll(window);
    });

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
      fireEvent.scroll(window);
    });

    expect(nav).toHaveClass('bg-transparent');
  });

  it('removes scroll event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderNavbar();
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('mobile menu is closed by default', () => {
    renderNavbar();
    // Mobile menu links not duplicated yet — only desktop links in DOM
    expect(screen.getAllByRole('link', { name: 'Features' })).toHaveLength(1);
  });

  it('opens mobile menu when hamburger button is clicked', () => {
    renderNavbar();
    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(menuButton);
    // Now both desktop and mobile links are rendered
    expect(screen.getAllByRole('link', { name: 'Features' })).toHaveLength(2);
  });

  it('closes mobile menu when hamburger button is clicked again', () => {
    renderNavbar();
    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(menuButton);
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.getAllByRole('link', { name: 'Features' })).toHaveLength(1);
  });

  it('sets aria-expanded correctly on mobile menu button', () => {
    renderNavbar();
    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows mobile background when mobile menu is open', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-transparent');

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(nav).not.toHaveClass('bg-transparent');
  });

  it('highlights active nav link when on /features', () => {
    renderNavbar('/features');
    const featuresLinks = screen.getAllByRole('link', { name: 'Features' });
    // The desktop nav link should have active class
    const desktopLink = featuresLinks[0];
    expect(desktopLink).toHaveClass('text-claw-primary');
  });

  it('does not highlight non-active nav links', () => {
    renderNavbar('/features');
    const howItWorksLinks = screen.getAllByRole('link', { name: 'How It Works' });
    expect(howItWorksLinks[0]).not.toHaveClass('text-claw-primary');
  });

  it('renders mobile menu link with active style when path matches', () => {
    renderNavbar('/safety');
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    // Mobile menu safety link (second occurrence) should have active class
    const safetyLinks = screen.getAllByRole('link', { name: 'Safety' });
    const mobileLink = safetyLinks[safetyLinks.length - 1];
    expect(mobileLink).toHaveClass('text-claw-primary');
  });
});
