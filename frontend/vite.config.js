import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const host = "0.0.0.0";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: host,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1423,
        }
      : undefined,
    watch: {
      // Don't let Vite watch Rust/Tauri build artifacts.
      // ignored: ["**/src-tauri/**"],
    },
  },
});
