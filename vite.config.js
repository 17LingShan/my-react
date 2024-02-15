import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  esbuild: {
    jsxFactory: "Ling.createElement",
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
