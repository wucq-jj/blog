import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: '/',

  locales: {
    // "/": {
    //   lang: "en-US",
    //   title: "Docs Demo",
    //   description: "A docs demo for vuepress-theme-hope",
    // },
    "/": {
      lang: "zh-CN",
      title: "wucq-jj",
      description: "vuepress-theme-hope 的文档演示",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});

