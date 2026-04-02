// Bundles the APP (UI) files (mcp-app.html + src/mcp-app.ts) into
// a single self-contained HTML file at dist/mcp-app.html.
// The server reads this file and serves it as the ui:// resource.
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: process.env.INPUT ?? "mcp-app.html",
    },
  },
});
