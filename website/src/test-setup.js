import '@testing-library/jest-dom';

// Polyfill IntersectionObserver for jsdom
if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
      this._callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
