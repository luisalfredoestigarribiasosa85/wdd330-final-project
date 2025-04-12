import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: "./index.html",
        info: "./info.html",
      },
    },
  },
  server: {
    port: 3000,
  },
});
