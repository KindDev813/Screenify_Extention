import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./public/manifest.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
      input: {
        // path relative to project root
        main: path.resolve(__dirname, "./index.html"),
        options: path.resolve(__dirname, "./options.html"),
      },
    },
  },
});
