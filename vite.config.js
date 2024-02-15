import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  esbuild: {
    jsxFactory: "Ling.createElement",
    jsxInject: `import Ling from '@/packages/Ling'`,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
