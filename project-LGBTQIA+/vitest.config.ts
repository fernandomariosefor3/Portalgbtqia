import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  // Objeto PostCSS inline (vazio) impede o Vite de procurar o postcss.config.ts
  // (que exigiria ts-node). Testes não precisam processar CSS real.
  css: {
    postcss: {},
  },
  test: {
    // Testes de componente (.test.tsx) usam jsdom; testes de funções puras
    // (.test.ts) rodam em node (mais leve).
    environmentMatchGlobs: [
      ["src/**/*.test.tsx", "jsdom"],
      ["src/**/*.test.ts", "node"],
    ],
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
