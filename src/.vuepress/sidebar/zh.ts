import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    "",
    {
      icon: "discover",
      text: "个人",
      prefix: "intro",
      link: "intro",
      children: "structure",
    }
    ,
    {
      icon: "discover",
      text: "案例",
      prefix: "demo/",
      link: "demo/",
      collapsible: true, //侧边栏折叠 
      children: "structure",
    },
    {
      icon: "note",
      text: "文档",
      prefix: "guide/",
      link: "guide/",
      collapsible: true, //侧边栏折叠 
      children: "structure",
    },
    {
      icon: "note",
      text: "博文",
      prefix: "notes/",
      link: "notes/",
      collapsible: true, //侧边栏折叠 
      children: "structure",
    },
    // "slides", //幻灯片页
  ],
});
