---
title: Windows进程通讯 共享内存
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
  - 共享内存
  - Windows C

footer: 天行健，君子以自强不息；地势坤，君子以厚德载物
---

# Windows 进程间通讯 共享内存

​	Windows进程间通讯的方法有很多：管道、邮件槽、剪切板、共享[内存](https://so.csdn.net/so/search?q=内存&spm=1001.2101.3001.7020)、消息、套接字、RPC、DDE等。但是他们大部分拥有一个共同的本质：**利用Windows操作系统高2GB内核共享空间进行数据传递的桥梁，所以他们都是内核对象！**所以他们大部分都要遵循：A创建对象-->A写入数据-->B打开A创建的对象-->B读入数据的规则

## 共享内存

​		共享内存主要是通过映射机制实现的。windows下进程的地址空间在逻辑上是相互隔离的，但是在物理上确实相互重叠的。所谓的重叠是指同一块内存区域可能被多个进程同时使用。在windows程序开发过程中，当多个进程之间需要访问共同的数据的时候，最好的方式就是使用共享内存进行处理。



**题目：**

- 两个进程相互通讯，显示在界面上
- 1个进程创建2个线程(显示CPU使用率、内存使用率)

## 什么是CPU使用率?

​		首先,我要谈到一个概念:"什么是CPU使用率"(认为明白此概念的朋友可以跳过这节),为什么要强调它?是因为我发现有些人误解了这个概念,而这样的话,就不能正确地设计出CPU使用率的计算方法.我们在Windows的任务管理器中可以实时地看到CPU使用率,每1秒(默认刷新频率是1秒/次)都在变化,因而某些人可能就会误认为,CPU使用率是一个瞬时值,在任何一个时刻它都有一个值,那么这些人可能会说:"在5分12秒这一时刻,CPU使用率为10%."这样的话,那就错了!实际上,了解一点CPU工作原理的人应该知道,在某一个时刻,CPU只有一个状态:"工作"或者"空闲",即0和1,照前面的理解,岂不是使用率只有0%和100%这两个值了吗?显然不对.对CPU使用率的正确理解应该是:在某一个时间段(T)中,CPU总共工作的时间(W)占这个整个时间段的百分比.即`W/T*100%`.可以对这个公式变更一下,如果我们知道的是这个时间段中CPU的空闲(没有工作)时间(I),那也可以通过`(T-I)/T*100%`或`(1-I/T)*100%`来算出CPU使用率.因此,正确的说法应该是:"在5分12秒到5分13秒这1秒钟内,CPU使用率为10%."这样理解就对了!

## 代码 server

```c
#include <windows.h>
#include <iostream> 
using namespace std;

#define BUF_SIZE 4096


typedef struct Data {
	DWORD	MemoryPercent;
	double	CpuPercent;
}MessageData;

HANDLE g_EventRead;		// 读信号灯
HANDLE g_EventWrite;	// 写信号灯
HANDLE g_EventWrite2;	// 写信号灯2
// 定义共享数据

DWORD getMemoryRate() 
{
	MEMORYSTATUSEX memStatus;
	memStatus.dwLength = sizeof(memStatus);
	GlobalMemoryStatusEx(&memStatus);
	return memStatus.dwMemoryLoad;
	//int nAvail = (int)(memStatus.ullAvailPhys / Byte2MB);
	//int nTotal = (int)(memStatus.ullTotalPhys / Byte2MB);
	//cout << "Memory: " << memStatus.dwMemoryLoad << "%, " << nAvail << "/" << nTotal << endl;
}




ULONGLONG CompareFileTime2(const FILETIME& preTime, const FILETIME& nowTime)
{
	ULONGLONG a = preTime.dwHighDateTime << 32 | preTime.dwLowDateTime;
	ULONGLONG b = nowTime.dwHighDateTime << 32 | nowTime.dwLowDateTime;
	return (b - a);
}


double getCpuUsage();
DWORD WriteThread(const LPVOID lp);
DWORD MemoryThread(const LPVOID lp);
int main()
{

	// 创建共享文件句柄 
	HANDLE hMapFile = CreateFileMapping(
		INVALID_HANDLE_VALUE,		// 物理文件句柄  NVALID_HANDLE_VALUE  则创建一个进程间共享的对象
		NULL,						// 默认安全级别
		PAGE_READWRITE,				// 可读可写
		0,							// 高位文件大小
		BUF_SIZE,					// 低位文件大小
		L"ShareMemoryPDU"			// 映射文件名，即共享内存的名称
	);

	if (0 == hMapFile)
	{
		return 0;
	}

	// 映射缓存区视图 , 得到指向共享内存的指针
	// 将hFileMapping共享内存衍射到本进程的地址空间中
	LPVOID lpBase = MapViewOfFile(
		hMapFile,            // 共享内存的句柄
		FILE_MAP_ALL_ACCESS, // 可读写许可
		0,
		0,
		BUF_SIZE
	);

	if (0 == lpBase)
	{
		return 0;
	}

	g_EventRead = CreateEvent(NULL, TRUE, FALSE, TEXT("EventRead"));	//手动重置，初始状态未触发
	if (nullptr == g_EventRead)
	{
		return 0;
	}

	g_EventWrite = CreateEvent(NULL, TRUE, TRUE, TEXT("EventWrite"));	//手动重置，初始状态触发
	if (nullptr == g_EventRead)
	{
		return 0;
	}

	g_EventWrite2 = CreateEvent(NULL, TRUE, TRUE, TEXT("EventWrite2"));	//手动重置，初始状态触发
	if (nullptr == g_EventWrite2)
	{
		return 0;
	}

	HANDLE handle1 = CreateThread(NULL, 0, WriteThread, lpBase, 0, NULL);
	HANDLE handle2 = CreateThread(NULL, 0, MemoryThread, lpBase, 0, NULL);

	
	WaitForSingleObject(handle1, INFINITE);
	WaitForSingleObject(handle2, INFINITE);
	
	

	// 解除文件映射
	UnmapViewOfFile(lpBase);

	// 关闭内存映射文件对象句柄
	CloseHandle(hMapFile);
	return 0;
}

DWORD WriteThread(const LPVOID lp)
{
	while (true)
	{
		WaitForSingleObject(g_EventWrite, INFINITE); // 等待读数据的信号
		WaitForSingleObject(g_EventWrite2, INFINITE); // 等待读数据的信号
		
		//将CPU利用率拷贝到共享内存中
		MessageData* data = (MessageData*)lp;
		data->CpuPercent = getCpuUsage();

		Sleep(1000);

		SetEvent(g_EventRead);
		ResetEvent(g_EventWrite);
		ResetEvent(g_EventWrite2);
	}
	return DWORD();
}
double getCpuUsage()
{
	FILETIME preIdleTime;
	FILETIME preKernelTime;
	FILETIME preUserTime;
	if (! GetSystemTimes(&preIdleTime, &preKernelTime, &preUserTime))
	{
		printf("GetSystemTimes failed\n");
		return 0;
	}


	Sleep(1000);

	FILETIME idleTime;
	FILETIME kernelTime;
	FILETIME userTime;
	if (! GetSystemTimes(&idleTime, &kernelTime, &userTime))
	{
		printf("222222222222222222222222222\n");
		return 0;
	}

	auto idle = CompareFileTime2(preIdleTime, idleTime);
	auto kernel = CompareFileTime2(preKernelTime, kernelTime);
	auto user = CompareFileTime2(preUserTime, userTime);

	return (1.0 * (kernel + user - idle) * 100 / (kernel + user));
}

DWORD MemoryThread(const LPVOID lp)
{
	while (true)
	{
		WaitForSingleObject(g_EventWrite, INFINITE); // 等待读数据的信号
		WaitForSingleObject(g_EventWrite2, INFINITE); // 等待读数据的信号

		//将内存利用率拷贝到共享内存中
		MessageData* data = (MessageData*)lp;
		data->MemoryPercent = getMemoryRate();

		Sleep(1000);

		SetEvent(g_EventRead);
		ResetEvent(g_EventWrite);
		ResetEvent(g_EventWrite2);
	}
	return DWORD();
}
```



## 代码Client

```c
#include <iostream>  
#include <windows.h>  
#include <string>
using namespace std;

#define BUF_SIZE 4096

typedef struct Data {
	DWORD	MemoryPercent;
	double	CpuPercent;
}MessageData;

HANDLE g_EventRead;		// 读信号灯
HANDLE g_EventWrite;	// 写信号灯
HANDLE g_EventWrite2;	// 写信号灯




DWORD ReadThread(const LPVOID lp)
{
	while (true)
	{
		WaitForSingleObject(g_EventRead, INFINITE); // 等待读数据的信号
		
		// 将数据拷贝到共享内存

		// 将共享内存数据拷贝出来
		char szBuffer[BUF_SIZE]{ 0 };

		strcpy_s(szBuffer, (char*)lp);

		MessageData* data = (MessageData*)lp;


		std::cout << "客户数据读取成功！CPU: " << data->CpuPercent << " Memory : " << data->MemoryPercent << endl;

		ResetEvent(g_EventRead); /* 将读取信号关闭  */
		SetEvent(g_EventWrite);
		SetEvent(g_EventWrite2);
	}
}

int main()
{
	// 打开共享的文件对象
	HANDLE hMapFile = OpenFileMapping(FILE_MAP_ALL_ACCESS, NULL, L"ShareMemoryPDU");

	if (0 == hMapFile)
	{
		// 打开共享内存句柄失败
		std::cout << "打开共享失败！" << endl;
		return 0;
	}
	LPVOID lpBase = MapViewOfFile(hMapFile, FILE_MAP_ALL_ACCESS, 0, 0, 0);
	if (0 == lpBase)
	{
		return 0;
	}

	g_EventRead = CreateEvent(NULL, TRUE, FALSE, TEXT("EventRead"));
	if (nullptr == g_EventRead)
	{
		return 0;
	}

	g_EventWrite = CreateEvent(NULL, TRUE, TRUE, TEXT("EventWrite"));
	if (nullptr == g_EventRead)
	{
		return 0;
	}

	g_EventWrite2 = CreateEvent(NULL, TRUE, TRUE, TEXT("EventWrite2"));
	if (nullptr == g_EventRead)
	{
		return 0;
	}


	HANDLE handle = CreateThread(NULL, 0, ReadThread, lpBase, 0, NULL);
	if (0 == handle)
	{
		return 0;
	}

	WaitForSingleObject(handle, INFINITE);
	// 解除文件映射

	UnmapViewOfFile(lpBase);
	// 关闭内存映射文件对象句柄
	CloseHandle(hMapFile);


	return 0;
}

```

![image-20230428230028595](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202304282300736.png)
