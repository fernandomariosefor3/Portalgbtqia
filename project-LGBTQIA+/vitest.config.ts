import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  // Define um objeto PostCSS inline (vazio) para impedir o Vite de procurar
  // o postcss.config.ts (que exigiria ts-node). Testes não precisam de CSS.
  css: {
    postcss: {},
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
