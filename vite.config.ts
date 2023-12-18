/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    include: [
      "**/__tests__/**/*.{js,jsx,ts,tsx}",
      "**/*.{test,spec}.?(c|m)[jt]s?(x)",
    ],
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: false,
    chaiConfig: {
      includeStack: true,
    },
  },
});
