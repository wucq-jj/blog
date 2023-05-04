---
title: Windows Socket
index: true
comment: false
icon: edit
editLink: false
date: 2023-05-04
pageview: true
Word: true

category:
  - Windows
tag: 
  - Windows Socket
  - Windows C

footer: 天行健，君子以自强不息；地势坤，君子以厚德载物
---

# Windows 网络编程  Socket

[什么socket?]([套接字_百度百科 (baidu.com)](https://baike.baidu.com/item/套接字/9637606))

​		所谓套接字(Socket)，就是对网络中不同主机上的应用进程之间进行双向通信的端点的抽象。一个套接字就是网络上进程通信的一端，提供了应用层进程利用网络协议交换数据的机制。从所处的地位来讲，套接字上联应用进程，下联网络协议栈，是应用程序通过网络协议进行通信的接口，是应用程序与网络协议栈进行交互的接口;



## 查看端口是否被占用

- 打开运行`cmd`输入`netstat -ano`，查看被使用的所有端口
- netstat `-aon | findstr “12345”`，检查我们要使用的端口号是否被使用了

下面是一个简单的Windows socket 编程例子

## **Server代码**

```c
#include <WinSock2.h>
#include <windows.h>
#include <stdio.h>

#pragma comment(lib, "wsock32.lib")

#define MAX_BUF 4096

int main(int argc, char * argv[])
{
	WORD wVersion = MAKEWORD(2, 2);
	WSADATA wdSockData;
	
	int ret = WSAStartup(wVersion, &wdSockData);			//启动 网络
	if (0 != ret)
	{
		printf("WSAStartup() failed : error() = %d\n", WSAGetLastError());
		system("pause");
		return -1;
	}

	if (2 != HIBYTE(wdSockData.wVersion) || 2 != LOBYTE(wdSockData.wVersion))	//校验版本
	{
		printf("version error\n");
		system("pause");
		return -1;
	}

	SOCKET serSock;
	serSock = socket(AF_INET, SOCK_STREAM, 0);			//创建 socket
	if (INVALID_SOCKET == serSock)
	{
		printf("socket() failed , error() = %d\n", WSAGetLastError());
		system("pause");
		return -1;
	}

	SOCKADDR_IN serAddress;			
	serAddress.sin_family = AF_INET;
	serAddress.sin_port = htons(6666);
	serAddress.sin_addr.s_addr = inet_addr("127.0.0.1");
	ret = bind(serSock, (sockaddr*)&serAddress, sizeof(serAddress));// 绑定 端口 和 IP地址
	if (SOCKET_ERROR == ret)
	{
		printf("bind() failed, error = %d\n", WSAGetLastError());
		closesocket(serSock);	// 关闭 socket
		WSACleanup();			// 终止所有套接字操作
		system("pause");
		return -1;
	}

	ret = listen(serSock, SOMAXCONN);
	if (SOCKET_ERROR == ret)
	{
		printf("listen() failed, error = %d\n", WSAGetLastError());
		closesocket(serSock);	// 关闭 socket
		WSACleanup();			// 终止所有套接字操作
		system("pause");
		return -1;
	}

	SOCKADDR_IN clientAddr;
	SOCKET clientSock;
	int len = sizeof(clientAddr);
	clientSock = accept(serSock, (sockaddr*)&clientAddr, &len);
	if (INVALID_SOCKET == clientSock)
	{
		printf("accpet() failed , error = %d\n", WSAGetLastError());
		closesocket(serSock);	// 关闭 socket
		WSACleanup();			// 终止所有套接字操作
		system("pause");
		return -1;
	}
	printf("client connect success\n");

	while (true)
	{

		char recvBuf[MAX_BUF];
		char sendBuf[MAX_BUF];
		
		int result = recv(clientSock, recvBuf, MAX_BUF, 0);
		
		if (SOCKET_ERROR == result)
		{
			printf("recv() failed , error = %d\n", WSAGetLastError());
			break;
		}
		else
		{
			printf("recv client data: %s\n", recvBuf);
			if (strcmp(recvBuf, "quit") == 0)
			{
				printf("client quit\n");
				break;
			}
			printf("send data:");
			scanf_s("%s", sendBuf, MAX_BUF);

			result = send(clientSock, sendBuf, strlen(sendBuf) + 1, 0);
			if (SOCKET_ERROR == result)
			{
				printf("send() failed , error = %d\n", WSAGetLastError());
				break;
			}
		}
		
	}

	closesocket(serSock);	// 关闭 socket
	closesocket(clientSock);	// 关闭 socket
	WSACleanup();			// 终止所有套接字操作
	system("pause");
	return 0;
}
```

## Client 代码

```c
#include <WinSock2.h>
#include <windows.h>
#include <stdio.h>

#pragma comment(lib, "wsock32.lib")

#define MAX_BUF 4096

int main(int argc, char* argv[])
{
	WORD wVersion = MAKEWORD(2, 2);
	WSADATA wdSockData;

	int ret = WSAStartup(wVersion, &wdSockData);			//启动 网络
	if (0 != ret)
	{
		printf("WSAStartup() failed : error() = %d\n", WSAGetLastError());
		system("pause");
		return -1;
	}

	if (2 != HIBYTE(wdSockData.wVersion) || 2 != LOBYTE(wdSockData.wVersion))	//校验版本
	{
		printf("version error\n");
		WSACleanup();
		system("pause");
		return -1;
	}

	SOCKET clientSock;
	clientSock = socket(AF_INET, SOCK_STREAM, 0);
	if (INVALID_SOCKET == clientSock)
	{
		printf("socket() failed , error() = %d\n", WSAGetLastError());
		WSACleanup();
		system("pause");
		return -1;	
	}

	SOCKADDR_IN clientAddr;
	clientAddr.sin_family = AF_INET;
	clientAddr.sin_port = htons(6666);
	clientAddr.sin_addr.s_addr = inet_addr("127.0.0.1");

	ret = connect(clientSock, (sockaddr*)&clientAddr, sizeof(clientAddr));
	if (SOCKET_ERROR == ret)
	{
		printf("connect() failed, error : %d\n", WSAGetLastError());
		closesocket(clientSock);
		WSACleanup();
		system("pause");
		return -1;
	}

	printf("connect server success\n");
	while (true)
	{
		char sendBuf[MAX_BUF];
		char recvBuf[MAX_BUF];

		printf("please input data:");
		scanf_s("%s", sendBuf, MAX_BUF);
		getchar();

		int result = send(clientSock, sendBuf, strlen(sendBuf) + 1, 0);
		if (SOCKET_ERROR == result)
		{
			printf("send() failed, error = %d\n", WSAGetLastError());
			break;
		}

		result = recv(clientSock, recvBuf, MAX_BUF, 0);
		if (SOCKET_ERROR == result)
		{
			printf("recv() failed, error = %d\n", WSAGetLastError());
			break;
		}
		else
		{
			printf("recv server data : %s\n", recvBuf);
			if (strcmp(recvBuf, "quit") == 0)
			{
				printf("server forces client quit\n");
				break;
			}

		}
	}



	closesocket(clientSock);
	WSACleanup();
	system("pause");

	return 0;
}
```

