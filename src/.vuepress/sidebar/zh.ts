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
    // {
    //   icon: "discover",
    //   text: "案例",
    //   prefix: "demo/",
    //   link: "demo/",
    //   collapsible: true, //侧边栏折叠 
    //   children: "structure",
    // },
    // {
    //   icon: "note",
    //   text: "文档",
    //   prefix: "guide/",
    //   link: "guide/",
    //   collapsible: true, //侧边栏折叠 
    //   children: "structure",
    // },
    {
      icon: "note",
      text: "博文",
      prefix: "notes/",
      link: "notes/",
      collapsible: false, //侧边栏折叠 
      children: 
      [
        {
          text: "面试题整理",
          icon: "note",
          prefix: "InterviewQuestion/",
          link: "InterviewQuestion/README.md",
          collapsible: true,
          children: 
          [
            {
              text: "C语言 面试题",
              icon: "note",
              link: "C_InterviewQuestions"
            },
            {
              text: "C++ 面试题",
              icon: "note",
              link: "Cpp_InterviewQuestions"
            },
            {
              text: "嵌入式 面试题",
              icon: "note",
              link: "Embedded_InterviewQuestions"
            },
            {
              text: "嵌入式 面试题",
              icon: "note",
              link: "Qt_InterviewQuestions"
            },
          ],
        },
      ],
    },

  ],
});
