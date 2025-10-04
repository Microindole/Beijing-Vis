// .storybook/main.js
const path = require('path');

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: [
    "../src/**/*.stories.@(js|jsx|ts|tsx)", // 简化匹配模式
  ],
  addons: [
    "@storybook/addon-essentials" // 只保留核心插件
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {}
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          'vue': 'vue/dist/vue.esm-bundler.js' // 关键修复
        }
      }
    });
  }
};
export default config;