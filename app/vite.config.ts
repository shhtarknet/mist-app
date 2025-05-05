import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  server: {
    fs: {
      allow: [
        // '/Users/shramee/www/starknet/confidential-erc20/app',
        searchForWorkspaceRoot(process.cwd()),
        '/Users/shramee/www/crypto/aztec-packages/barretenberg/ts', // Add this path
      ],
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react', '@noir-lang/noirc_abi', '@noir-lang/acvm_js', '@aztec/bb.js', 'baby-giant-wasm', 'garaga']
  },
});
