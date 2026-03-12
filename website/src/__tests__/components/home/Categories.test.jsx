import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Categories from '../../../components/home/Categories';
import { categories } from '../../../constants/features';

describe('Categories', () => {
  function renderCategories() {
    return render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );
  }

  it('renders the section heading', () => {
    renderCategories();
    expect(screen.getByText('Sell Across Categories')).toBeInTheDocument();
    expect(screen.getByText(/From groceries to electronics/i)).toBeInTheDocument();
  });

  it('renders all category names', () => {
    renderCategories();
    categories.forEach((c) => {
      expect(screen.getByText(c.name)).toBeInTheDocument();
    });
  });

  it('renders all category codes', () => {
    renderCategories();
    categories.forEach((c) => {
      expect(screen.getByText(c.code)).toBeInTheDocument();
    });
  });

  it('renders all category descriptions', () => {
    renderCategories();
    categories.forEach((c) => {
      expect(screen.getByText(c.description)).toBeInTheDocument();
    });
  });

  it('renders the categories section', () => {
    const { container } = renderCategories();
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
