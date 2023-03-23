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
      title: "白水晶",
      description: "白水晶的博客文章分享",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});

