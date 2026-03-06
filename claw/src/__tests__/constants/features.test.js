import { features, detailedFeatures } from '../../constants/features';

describe('features constants', () => {
  describe('features', () => {
    it('exports an array', () => {
      expect(Array.isArray(features)).toBe(true);
    });

    it('has 6 features', () => {
      expect(features).toHaveLength(6);
    });

    it('each feature has required fields', () => {
      features.forEach((f) => {
        expect(f).toHaveProperty('icon');
        expect(f).toHaveProperty('title');
        expect(f).toHaveProperty('description');
        expect(f).toHaveProperty('detail');
        expect(typeof f.icon).toBe('string');
        expect(typeof f.title).toBe('string');
        expect(typeof f.description).toBe('string');
        expect(typeof f.detail).toBe('string');
      });
    });

    it('includes Voice & Text Commands feature', () => {
      expect(features.some((f) => f.title === 'Voice & Text Commands')).toBe(true);
    });

    it('includes Safety Gates feature', () => {
      expect(features.some((f) => f.title === 'Safety Gates')).toBe(true);
    });
  });

  describe('detailedFeatures', () => {
    it('exports an array', () => {
      expect(Array.isArray(detailedFeatures)).toBe(true);
    });

    it('has 4 categories', () => {
      expect(detailedFeatures).toHaveLength(4);
    });

    it('each category has category name and items array', () => {
      detailedFeatures.forEach((cat) => {
        expect(cat).toHaveProperty('category');
        expect(cat).toHaveProperty('items');
        expect(typeof cat.category).toBe('string');
        expect(Array.isArray(cat.items)).toBe(true);
        cat.items.forEach((item) => {
          expect(item).toHaveProperty('title');
          expect(item).toHaveProperty('description');
          expect(item).toHaveProperty('icon');
        });
      });
    });

    it('includes Intelligence, Automation, Safety & Privacy, Extensibility categories', () => {
      const categories = detailedFeatures.map((c) => c.category);
      expect(categories).toContain('Intelligence');
      expect(categories).toContain('Automation');
      expect(categories).toContain('Safety & Privacy');
      expect(categories).toContain('Extensibility');
    });
  });
});
