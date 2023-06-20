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
              text: "QTableWidget",
              icon: "note",
              link: "QTableWidget"
            },
            {
              text: "Qt Mp3播放器",
              icon: "note",
              link: "Qt_MusicPlayer"
            },
            {
              text: "Qt 好用的自定义工具函数",
              icon: "note",
              link: "QTool"
            },
          ],
        },
        {
          text: "Linux",
          icon: "note",
          prefix: "Linux/",
          link: "Linux/README.md",
          collapsible: true,
          children:
          [
            {
              text: "Linux命令",
              icon: "note",
              link: "linuxCommand.md"
            },
          ],
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
          [ //WinCommandHelp
            {
            text: "Windows命令",
            icon: "note",
            link: "WinCommandHelp"
            } ,
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
            {
              text: "Windows 事件 Event",
              icon: "note",
              link: "WinEvent"
            },
            {
              text: "Windows 共享内存",
              icon: "note",
              link: "WinShareMemory"
            },
            {
              text: "Windows 网络编程",
              icon: "note",
              link: "WinSock"
            },
            {
              text: "GetLastError() 错误码",
              icon: "note",
              link: "GetLastErrorCode"
            },
            {
              text: "TCP连接表获取(模拟netstat -ano)",
              icon: "note",
              link: "GetTCPTable"
            },
            {
              text: "Windows 监控指定目录文件变化，支持模糊匹配",
              icon: "note",
              link: "WinMonitorFile"
            },
            {
              text: "Windows 监控指定注册表键值变化",
              icon: "note",
              link: "WinMonitorRegistry"
            },
            {
              text: "Windows 监控进程状态",
              icon: "note",
              link: "WinMonitorProcess"
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
