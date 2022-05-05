/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      projects: ["./tsconfig.json"],
    }),
  ],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup-test-env.ts"],
    exclude: ["./cypress", "./test/e2e", "./node_modules", "./local-data"],
    watchIgnore: [
      ".*\\/node_modules\\/.*",
      ".*\\/build\\/.*",
      ".*\\/local-data\\/.*",
    ],
  },
});
