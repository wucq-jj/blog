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
    },
    {
      icon: "note",
      text: "博文",
      prefix: "notes/",
      link: "notes/",
      collapsible: false, //侧边栏折叠 
      children: 
      [
        {
          text: "C/C++知识分享",
          icon: "note",
          prefix: "CandCpp/",
          link: "CandCpp/README.md",
          collapsible: true,
          children: 
          [
            {
              text: "数据结构",
              icon: "note",
              link: "Share.md"
            },
          ],
        },
        {
          text: "Qt",
          icon: "note",
          prefix: "Qt/",
          link: "Qt/README.md",
          collapsible: true,
          children: 
          [
            {
              text: "Qt Mp3播放器",
              icon: "note",
              link: "Qt_MusicPlayer"
            },
          ],
        },
        {
          text: "Linux",
          icon: "note",
          prefix: "Linux/",
          link: "Linux/README.md",
          collapsible: true,
          children: "structure",
        },
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
              text: "Qt 面试题",
              icon: "note",
              link: "Qt_InterviewQuestions"
            },
          ],
        },
        {
          text: "刷题",
          icon: "note",
          prefix: "BrushProblems/",
          link: "BrushProblems/README.md",
          collapsible: true,
          children: 
          [
            {
              text: "数组",
              icon: "note",
              link: "DataStructure-Array"
            },
            {
              text: "字符串",
              icon: "note",
              link: "DataStructure-String"
            },
            {
              text: "数据结构",
              icon: "note",
              link: "DataStructure-DataStructure"
            },
          ],
        },
        {
          text: "Windows",
          icon: "note",
          prefix: "Windows/",
          link: "Windows/README.md",
          collapsible: true,
          children: 
          [
            {
              text: "递归读取文件夹",
              icon: "note",
              link: "RecursiveReadFolder"
            },
            {
              text: "注册表读写",
              icon: "note",
              link: "Registry"
            },//WinService
            {
              text: "Windows服务",
              icon: "note",
              link: "WinService"
            },
          ]
          ,
        },
        {
          text: "git",
          icon: "note",
          prefix: "git/",
          link: "git/README.md",
          collapsible: true,
          children: 
          [
            {
              text: "github推送失败fatal: User canceled device code authentication",
              icon: "note",
              link: "GitProblem"
            },
            {
              text: "git初始化用户配置SSH秘钥",
              icon: "note",
              link: "InitUserConfigurationAndSHHKey"
            },
          ]
          ,
        },
        {
          text: "资源分享",
          icon: "note",
          prefix: "Resources/",
          link: "Resources/README.md",
          collapsible: true,
          children: "structure",
        },
      ],
    },

  ],
});
