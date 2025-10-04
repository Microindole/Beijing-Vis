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
  base:
    process.env.NODE_ENV === "production"
      ? "/ChinaVis/" // 把 "你的仓库名" 替換成你的實際 GitHub 倉庫名稱
      : "/",
  // 構建選項 (可選，通常默認就行)
  build: {
    outDir: "dist", // 構建輸出目錄，默認就是 dist
  },
});
