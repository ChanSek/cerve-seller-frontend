import { faqItems, faqCategories } from '../../constants/faq';

describe('faq constants', () => {
  describe('faqItems', () => {
    it('exports an array', () => {
      expect(Array.isArray(faqItems)).toBe(true);
    });

    it('has 10 FAQ items', () => {
      expect(faqItems).toHaveLength(10);
    });

    it('each item has question and answer strings', () => {
      faqItems.forEach((item) => {
        expect(item).toHaveProperty('question');
        expect(item).toHaveProperty('answer');
        expect(typeof item.question).toBe('string');
        expect(typeof item.answer).toBe('string');
        expect(item.question.length).toBeGreaterThan(0);
        expect(item.answer.length).toBeGreaterThan(0);
      });
    });

    it('first item asks what Claw is', () => {
      expect(faqItems[0].question).toBe('What is Claw?');
    });
  });

  describe('faqCategories', () => {
    it('exports an array', () => {
      expect(Array.isArray(faqCategories)).toBe(true);
    });

    it('has 4 categories', () => {
      expect(faqCategories).toHaveLength(4);
    });

    it('each category has name and questions array', () => {
      faqCategories.forEach((cat) => {
        expect(cat).toHaveProperty('name');
        expect(cat).toHaveProperty('questions');
        expect(typeof cat.name).toBe('string');
        expect(Array.isArray(cat.questions)).toBe(true);
      });
    });

    it('includes General, Compatibility, Safety & Privacy, Technical', () => {
      const names = faqCategories.map((c) => c.name);
      expect(names).toContain('General');
      expect(names).toContain('Compatibility');
      expect(names).toContain('Safety & Privacy');
      expect(names).toContain('Technical');
    });

    it('question indices reference valid faqItems', () => {
      faqCategories.forEach((cat) => {
        cat.questions.forEach((idx) => {
          expect(idx).toBeGreaterThanOrEqual(0);
          expect(idx).toBeLessThan(faqItems.length);
        });
      });
    });
  });
});
