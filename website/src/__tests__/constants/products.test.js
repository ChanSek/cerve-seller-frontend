import { describe, it, expect } from 'vitest';
import { products } from '../../constants/products';

describe('products constant', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('each product has required string fields', () => {
    products.forEach((p) => {
      expect(typeof p.name).toBe('string');
      expect(typeof p.tagline).toBe('string');
      expect(typeof p.description).toBe('string');
      expect(typeof p.href).toBe('string');
      expect(typeof p.icon).toBe('string');
      expect(typeof p.color).toBe('string');
    });
  });

  it('each product has a non-empty highlights array of strings', () => {
    products.forEach((p) => {
      expect(Array.isArray(p.highlights)).toBe(true);
      expect(p.highlights.length).toBeGreaterThan(0);
      p.highlights.forEach((h) => {
        expect(typeof h).toBe('string');
      });
    });
  });
});
