---
title: Windows 命令
index: true
comment: false
icon: edit
editLink: false
date: 2023-05-19
pageview: true
Word: true

category:
  - Windows
tag: 
  - 命令

footer: 天行健，君子以自强不息；地势坤，君子以厚德载物
---

# `Windows`命令

## 挂载`ISO`文件

```bash
Mount-DiskImage -ImagePath "PATH"
```

## Win11 右键菜单还原

```bash
方法一：reg add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve
1.win键 + R键 打开运行窗口， 输入命令：reg add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve
2.重启资源管理器
方法二： Shift键 + 鼠标右键
1.Shift 键 + 鼠标右键：直接还原的是原来的右键菜单

推荐方法二
```
