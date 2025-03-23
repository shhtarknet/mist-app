import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  optimizeDeps: {
    exclude: ['lucide-react', '@noir-lang/noirc_abi', '@noir-lang/acvm_js', 'garaga']
  },
});
