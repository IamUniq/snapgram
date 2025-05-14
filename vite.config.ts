import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
         'react-vendors': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendors': ['@radix-ui/react-toast', 'lucide-react', 'sonner', 'clsx', 'tailwind-merge', 'tailwindcss-animate'],
          'form-utils': ['react-hook-form', 'zod'],
          'data-fetching': ['@tanstack/react-query'],
          'carousel': ['embla-carousel-react'],
          'file-upload': ['react-dropzone'],
          'appwrite': ['appwrite']
        }
      }
    }
  }
});
