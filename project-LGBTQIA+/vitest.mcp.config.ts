import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['mcp/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'src'],
  }
});
