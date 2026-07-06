import "@testing-library/jest-dom/vitest";

// Radix UI uses ResizeObserver internally; jsdom does not implement it.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
