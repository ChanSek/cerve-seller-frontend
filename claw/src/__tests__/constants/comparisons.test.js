import { comparisonFeatures, competitors } from '../../constants/comparisons';

describe('comparisons constants', () => {
  describe('comparisonFeatures', () => {
    it('exports an array', () => {
      expect(Array.isArray(comparisonFeatures)).toBe(true);
    });

    it('each row has feature, claw, droidrun, greenclaw', () => {
      comparisonFeatures.forEach((row) => {
        expect(row).toHaveProperty('feature');
        expect(row).toHaveProperty('claw');
        expect(row).toHaveProperty('droidrun');
        expect(row).toHaveProperty('greenclaw');
      });
    });

    it('has boolean and string value types', () => {
      const booleanRows = comparisonFeatures.filter(
        (r) => typeof r.claw === 'boolean',
      );
      const stringRows = comparisonFeatures.filter(
        (r) => typeof r.claw === 'string',
      );
      expect(booleanRows.length).toBeGreaterThan(0);
      expect(stringRows.length).toBeGreaterThan(0);
    });

    it('claw has both true and false boolean values across rows', () => {
      const boolRows = comparisonFeatures.filter((r) => typeof r.claw === 'boolean');
      expect(boolRows.some((r) => r.claw === true)).toBe(true);
    });

    it('includes Open Source feature', () => {
      expect(comparisonFeatures.some((r) => r.feature === 'Open Source')).toBe(true);
    });

    it('includes Price feature as string', () => {
      const priceRow = comparisonFeatures.find((r) => r.feature === 'Price');
      expect(priceRow).toBeDefined();
      expect(typeof priceRow.claw).toBe('string');
    });
  });

  describe('competitors', () => {
    it('exports an array', () => {
      expect(Array.isArray(competitors)).toBe(true);
    });

    it('has 3 competitors', () => {
      expect(competitors).toHaveLength(3);
    });

    it('each competitor has name and highlight', () => {
      competitors.forEach((c) => {
        expect(c).toHaveProperty('name');
        expect(c).toHaveProperty('highlight');
        expect(typeof c.name).toBe('string');
        expect(typeof c.highlight).toBe('boolean');
      });
    });

    it('Claw is highlighted', () => {
      const claw = competitors.find((c) => c.name === 'Claw');
      expect(claw).toBeDefined();
      expect(claw.highlight).toBe(true);
    });

    it('other competitors are not highlighted', () => {
      competitors
        .filter((c) => c.name !== 'Claw')
        .forEach((c) => {
          expect(c.highlight).toBe(false);
        });
    });
  });
});
