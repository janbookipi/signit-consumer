import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ command, mode }) => ({
  build: {
    emptyOutDir: true,
    outDir: "build",
    rollupOptions: {
      output: {
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        manualChunks: {
          "bkp-bds": ["@bookipi/bds"],
          "bkp-core": ["@bookipi/bookipi-core"],
          "bkp-htmlgen": ["@bookipi/htmlgenerator"],
          // 'bookipi-signit-common-react': ['@bookipi/signit-common-react'],
          "bkp-signit-content-explorer": ["@bookipi/signit-content-explorer"],
          "bkp-signit-contract-create": ["@bookipi/signit-contract-create"],
          "bkp-signit-contract-vault": ["@bookipi/signit-contract-vault"],
          "bkp-signit-contract-view": ["@bookipi/signit-contract-view"],
          "bkp-signit-document-generator": [
            "@bookipi/signit-document-generator",
          ],

          "vendor-apollo": ["@apollo/client"],
          "vendor-material": [],
          "vendor-misc": ["lodash", "moment", "axios", "graphql"],
        },
      },
    },
    sourcemap: mode === "dev",
  },

  // Define global constants if needed
  define: {
    // This is a common workaround for packages that expect a 'global' object
    global: "globalThis",
    // Ensure process.env.NODE_ENV is properly set
    "process.env.NODE_ENV": JSON.stringify(
      mode === "dev" ? "development" : "production"
    ),
  },

  // Consistent ESBuild settings for both dev and build
  esbuild: {
    // Remove console logs in production builds
    drop: mode === "prod" ? ["console", "debugger"] : [],
    // Keep names for better debugging if needed
    keepNames: true,
    // This enables JSX syntax in .js files
    loader: "jsx",
    // Target modern browsers
    target: "es2020",
  },

  optimizeDeps: {
    exclude: ["framer-motion"],
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "@apollo/client/core",
      "@apollo/client/react/hooks",
    ],
  },

  plugins: [
    react({
      babel: {
        // Reduce memory usage
        compact: true,
        minified: true,
        // Reduce plugins to minimum necessary
        plugins: [
          [
            "@babel/plugin-proposal-private-property-in-object",
            { loose: true },
          ],
        ],
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
              // Target modern browsers to reduce transformations
              targets: "defaults and supports es6-module",
            },
          ],
          [
            "@babel/preset-react",
            {
              // Optimize for production
              development: false,
              runtime: "automatic",
            },
          ],
        ],
      },
    }),

    svgr(),
    // Add the visualizer plugin to analyze bundle size
    visualizer({
      filename: "build/stats.html",
      open: false,
    }),
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      // Ensure single React instance
      react: resolve(__dirname, "./node_modules/react"),
      "react-dom": resolve(__dirname, "./node_modules/react-dom"),
      src: resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "localhost",
    open: true,
    port: 3000,
  },

  test: {
    css: true,
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/dist/**", "**/build/**"],
    globals: true,
    setupFiles: resolve(__dirname, "./src/setupTests.js"),
  },
}));
