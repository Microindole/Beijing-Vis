import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/cesium/Build/CesiumUnminified/**/*",
          dest: "cesium",
          globOptions: {
            dot: true,
            ignore: ["**/*.css"],
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: "/",
  // 構建選項 (可選，通常默認就行)
  build: {
    outDir: "dist", // 構建輸出目錄，默認就是 dist
  },
});
