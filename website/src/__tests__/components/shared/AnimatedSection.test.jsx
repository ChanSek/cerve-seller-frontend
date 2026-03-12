import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import AnimatedSection from '../../../components/shared/AnimatedSection';

let observerCallback;
let observerInstance;

beforeEach(() => {
  observerInstance = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };

  global.IntersectionObserver = vi.fn((callback) => {
    observerCallback = callback;
    return observerInstance;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AnimatedSection', () => {
  it('renders children', () => {
    render(<AnimatedSection>Section content</AnimatedSection>);
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('renders a section element', () => {
    const { container } = render(<AnimatedSection>Test</AnimatedSection>);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<AnimatedSection className="my-class">Test</AnimatedSection>);
    const section = container.querySelector('section');
    expect(section.className).toContain('my-class');
  });

  it('applies default empty className', () => {
    const { container } = render(<AnimatedSection>Test</AnimatedSection>);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('accepts delay prop and applies it to transition', () => {
    const { container } = render(<AnimatedSection delay={0.5}>Delayed</AnimatedSection>);
    const section = container.querySelector('section');
    expect(section.style.transition).toContain('0.5s');
    expect(screen.getByText('Delayed')).toBeInTheDocument();
  });

  it('starts hidden and transitions to visible on intersection', () => {
    const { container } = render(<AnimatedSection>Animated</AnimatedSection>);
    const section = container.querySelector('section');

    // Initially hidden
    expect(section.style.opacity).toBe('0');
    expect(section.style.transform).toBe('translateY(40px)');

    // Simulate intersection
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    // Now visible
    expect(section.style.opacity).toBe('1');
    expect(section.style.transform).toBe('translateY(0)');
  });

  it('unobserves element after intersection', () => {
    render(<AnimatedSection>Test</AnimatedSection>);

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(observerInstance.unobserve).toHaveBeenCalled();
  });

  it('does not trigger when not intersecting', () => {
    const { container } = render(<AnimatedSection>Test</AnimatedSection>);
    const section = container.querySelector('section');

    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });

    expect(section.style.opacity).toBe('0');
    expect(observerInstance.unobserve).not.toHaveBeenCalled();
  });

  it('disconnects observer on unmount', () => {
    const { unmount } = render(<AnimatedSection>Test</AnimatedSection>);
    unmount();
    expect(observerInstance.disconnect).toHaveBeenCalled();
  });

  it('creates IntersectionObserver with correct rootMargin', () => {
    render(<AnimatedSection>Test</AnimatedSection>);
    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '-80px' }
    );
  });

  it('applies willChange style for performance', () => {
    const { container } = render(<AnimatedSection>Test</AnimatedSection>);
    const section = container.querySelector('section');
    expect(section.style.willChange).toBe('opacity, transform');
  });
});
