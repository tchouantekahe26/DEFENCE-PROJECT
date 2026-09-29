import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";

const emptyShim = fileURLToPath(new URL("./src/shims/empty.ts", import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      canvg: emptyShim,
      html2canvas: emptyShim,
      dompurify: emptyShim,
    },
  },
  optimizeDeps: {
    include: ["jspdf", "jspdf-autotable"],
  },
});