import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.ts'],
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/core/**/*.ts', 'src/config/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/main.ts'],
    },
    testTimeout: 120000, // 2 minutes for property-based tests
  },
});
