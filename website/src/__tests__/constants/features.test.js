import { describe, it, expect } from 'vitest';
import { features, categories, ondcSteps } from '../../constants/features';

describe('features constant', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(features)).toBe(true);
    expect(features.length).toBeGreaterThan(0);
  });

  it('each feature has icon, title, and description strings', () => {
    features.forEach((f) => {
      expect(typeof f.icon).toBe('string');
      expect(typeof f.title).toBe('string');
      expect(typeof f.description).toBe('string');
    });
  });
});

describe('categories constant', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it('each category has code, name, icon, and description strings', () => {
    categories.forEach((c) => {
      expect(typeof c.code).toBe('string');
      expect(typeof c.name).toBe('string');
      expect(typeof c.icon).toBe('string');
      expect(typeof c.description).toBe('string');
    });
  });
});

describe('ondcSteps constant', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(ondcSteps)).toBe(true);
    expect(ondcSteps.length).toBeGreaterThan(0);
  });

  it('each step has step, title, description, and icon strings', () => {
    ondcSteps.forEach((s) => {
      expect(typeof s.step).toBe('string');
      expect(typeof s.title).toBe('string');
      expect(typeof s.description).toBe('string');
      expect(typeof s.icon).toBe('string');
    });
  });
});
