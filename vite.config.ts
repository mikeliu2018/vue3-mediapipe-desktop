import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
// import pkg from "./package.json";
import "dotenv/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    electron([
      { entry: "electron/main.ts" },
      {
        entry: "electron/preload.ts",
        onstart(options) {
          options.reload();
        },
      },
    ]),
    // renderer({
    //   // Enables use of Node.js API in the Renderer-process
    //   // nodeIntegration: true,
    //   // Like Vite's pre bundling
    //   optimizeDeps: {
    //     include: [
    //       "serialport", // cjs(C++)
    //       "electron-store", // cjs
    //       "execa", // esm
    //       "got", // esm
    //       "node-fetch", // esm
    //     ],
    //   },
    // }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    minify: false,
    emptyOutDir: false, // for doc of electron build
    // because esbuild so we never need @rollup/plugin-commonjs and remove it
    commonjsOptions: {
      include: [],
    },
    // rollupOptions: {
    //   external: Object.keys(pkg.dependencies),
    // },
  },
  // use of esbuild to optimize dependencies during build time
  optimizeDeps: {
    disabled: false,
  },
  server: {
    proxy: {
      "/api": {
        target: `${process.env.VITE_DEV_API_SERVER_URL}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    host: "0.0.0.0",
  },
});
