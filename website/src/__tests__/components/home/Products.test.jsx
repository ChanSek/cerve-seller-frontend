import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Products from '../../../components/home/Products';
import { products } from '../../../constants/products';

describe('Products', () => {
  function renderProducts() {
    return render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );
  }

  it('renders the section heading', () => {
    renderProducts();
    expect(screen.getByText('Our Products')).toBeInTheDocument();
    expect(screen.getByText(/Two powerful tools/i)).toBeInTheDocument();
  });

  it('renders all product names', () => {
    renderProducts();
    products.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  });

  it('renders all product taglines', () => {
    renderProducts();
    products.forEach((p) => {
      expect(screen.getByText(p.tagline)).toBeInTheDocument();
    });
  });

  it('renders all product descriptions', () => {
    renderProducts();
    products.forEach((p) => {
      expect(screen.getByText(p.description)).toBeInTheDocument();
    });
  });

  it('renders all product highlights', () => {
    renderProducts();
    products.forEach((p) => {
      p.highlights.forEach((h) => {
        expect(screen.getByText(h)).toBeInTheDocument();
      });
    });
  });

  it('renders explore buttons with correct hrefs', () => {
    renderProducts();
    products.forEach((p) => {
      const link = screen.getByText(`Explore ${p.name}`).closest('a');
      expect(link).toHaveAttribute('href', p.href);
    });
  });

  it('renders the products section', () => {
    const { container } = renderProducts();
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
