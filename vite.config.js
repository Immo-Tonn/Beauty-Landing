import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        ru: path.resolve(__dirname, "src/ru/index.html"),
        de: path.resolve(__dirname, "src/de/index.html"),
        en: path.resolve(__dirname, "src/en/index.html"),
      },
    },
  },

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000", // только для dev
        changeOrigin: true,
      },
    },
  },
});
