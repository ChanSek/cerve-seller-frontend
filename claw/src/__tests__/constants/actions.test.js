import { currentActions, comingSoonActions } from '../../constants/actions';

describe('actions constants', () => {
  describe('currentActions', () => {
    it('exports an array', () => {
      expect(Array.isArray(currentActions)).toBe(true);
    });

    it('has 8 current actions', () => {
      expect(currentActions).toHaveLength(8);
    });

    it('each action has name, icon, and description', () => {
      currentActions.forEach((action) => {
        expect(action).toHaveProperty('name');
        expect(action).toHaveProperty('icon');
        expect(action).toHaveProperty('description');
        expect(typeof action.name).toBe('string');
        expect(typeof action.icon).toBe('string');
        expect(typeof action.description).toBe('string');
      });
    });

    it('includes Open Apps action', () => {
      expect(currentActions.some((a) => a.name === 'Open Apps')).toBe(true);
    });

    it('includes Voice Input action', () => {
      expect(currentActions.some((a) => a.name === 'Voice Input')).toBe(true);
    });
  });

  describe('comingSoonActions', () => {
    it('exports an array', () => {
      expect(Array.isArray(comingSoonActions)).toBe(true);
    });

    it('has 6 coming-soon actions', () => {
      expect(comingSoonActions).toHaveLength(6);
    });

    it('each action has name, icon, and description', () => {
      comingSoonActions.forEach((action) => {
        expect(action).toHaveProperty('name');
        expect(action).toHaveProperty('icon');
        expect(action).toHaveProperty('description');
      });
    });

    it('includes Screenshot Analysis action', () => {
      expect(comingSoonActions.some((a) => a.name === 'Screenshot Analysis')).toBe(true);
    });
  });
});
