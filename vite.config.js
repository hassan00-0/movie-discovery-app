import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: ".",
  envPrefix: "VITE_",
  build: {
    sourcemap: true,
    outDir: "dist",
  },
});
