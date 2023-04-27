import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
    {
    text: "博文",
    icon: "edit",
    prefix: "/notes/",
    children: [
      {
        text: "1.C/C++ 知识分享",
        icon: "edit",
        link: "CandCpp/README.md"
        
      },
      {
        text: "2.Qt",
        icon: "edit",
        link: "Qt/README.md"
        
      },
      {
        text: "3.Linux",
        icon: "edit",
        link: "Linux/README.md"
      },
      {
        text: "4.面试题收集整理",
        icon: "edit",
        link: "InterviewQuestion/README.md"
      },
      {
        text: "5.刷题",
        icon: "edit",
        link: "BrushProblems/README.md"
        
      },
      {
        text: "6.Windows",
        icon: "edit",
        link: "Windows/README.md"
      },
      {
        text: "7.资源",
        icon: "edit",
        link: "Resources/README.md"
        
      },
      
    ],
  },
  // {
  //   text: "V2 文档",
  //   icon: "note",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
