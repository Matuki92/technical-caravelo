import path from 'path';
import vue from '@vitejs/plugin-vue';

export default {
  plugins: [vue()],
  test: {
    include: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      reportsDirectory: 'coverage',
      reporter: ['text', 'json', 'html', 'lcov'],
    },
    globals: true,
    environment: 'jsdom',
    testTimeout: 10000,
    teardownTimeout: 10000,
    minThreads: 4,
    maxThreads: 4,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
