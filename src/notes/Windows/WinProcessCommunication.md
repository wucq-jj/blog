---
title: Windows进程通讯
index: true
comment: false
icon: edit
editLink: false
date: 2023-04-28
pageview: true
Word: true

category:
  - Windows
tag: 
  - Windows进程通讯
  - Windows C

footer: 天行健，君子以自强不息；地势坤，君子以厚德载物
---

# Windows 进程间通讯 共享内存

​	Windows进程间通讯的方法有很多：管道、邮件槽、剪切板、共享[内存](https://so.csdn.net/so/search?q=内存&spm=1001.2101.3001.7020)、消息、套接字、RPC、DDE等。但是他们大部分拥有一个共同的本质：**利用Windows操作系统高2GB内核共享空间进行数据传递的桥梁，所以他们都是内核对象！**所以他们大部分都要遵循：A创建对象-->A写入数据-->B打开A创建的对象-->B读入数据的规则

## 共享内存

​		共享内存主要是通过映射机制实现的。windows下进程的地址空间在逻辑上是相互隔离的，但是在物理上确实相互重叠的。所谓的重叠是指同一块内存区域可能被多个进程同时使用。在windows程序开发过程中，当多个进程之间需要访问共同的数据的时候，最好的方式就是使用共享内存进行处理。

### 共享内存API

