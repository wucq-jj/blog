---
title: 注册表读写
index: true
comment: false
icon: edit
editLink: false
date: 2023-04-27
pageview: true
Word: true

category:
  - Windows
tag: 
  - 注册表读写
  - Windows C

footer: 天行健，君子以自强不息；地势坤，君子以厚德载物·
---

## 获取微信安装包地址和设置屏幕锁屏时间

**题目**

- 获取微信安装包注册表路径

- 修改屏幕保护时间为2s（1.计算机`\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System`，2.创建`InactivityTimeoutSecs`，设置值为`DWORD`  2)

## 代码

```c
#include <Windows.h>
#include <stdio.h>
#include <tchar.h>

int main(int argc, char* argv[])
{
	printf("获取微信安装包注册表路径\n");
	system("pause");

	LPCTSTR lpSubKey = _T("SOFTWARE\\Tencent\\WeChat");
	LPCTSTR lpInstallPathKey = _T("InstallPath");
	DWORD type = REG_SZ;
	char value[256];
	DWORD size = sizeof(value);

	HKEY hKey, hKey2, hKey3;

	long ret = RegOpenKeyEx(HKEY_CURRENT_USER, lpSubKey, 0, KEY_READ, &hKey);
	if (ERROR_SUCCESS != ret)
	{
		printf("\n\n");
		printf("ret = %u\n", ret);
		printf("打开注册表键:\t\t%S\t\t失败\n", lpSubKey);
		system("pause");
		return -1;
	}

	ret = RegQueryValueEx(hKey, lpInstallPathKey, 0, &type, (LPBYTE)value, &size);
	if (ERROR_SUCCESS != ret)
	{
		printf("获取\t%S\t相关信息失败\n", lpInstallPathKey);
		system("pause");
		return -1;
	}
	printf("\n");
	printf("获取到\t%S\t的值为:", lpInstallPathKey);
	for (int i = 0; i < size; i++)
		printf("%c", value[i]);
	printf("\n");	
	RegCloseKey(hKey);


	DWORD timeout = 0;

	printf("开始设置屏幕保护时间请输入：");
	scanf_s("%u", &timeout);
	printf("%u\n", timeout);
	
	LPCTSTR lpSubKey2 = _T("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System");
	LPCTSTR lpInactivityTimeoutSecsKey = _T("InactivityTimeoutSecs");
	type = REG_DWORD;
	DWORD value2;
	
	DWORD size2 = sizeof(DWORD);


	ret = RegOpenKeyEx(HKEY_LOCAL_MACHINE, lpSubKey2, 0, KEY_ALL_ACCESS, &hKey2);
	if (ERROR_SUCCESS != ret)
	{
		printf("打开注册表键:\t\t%S\t\t失败\n", lpSubKey2);
		system("pause");
		return -1;
	}
	ret = RegQueryValueEx(hKey2, lpInactivityTimeoutSecsKey, 0, &type, (LPBYTE)&value2, &size2);
	if (ERROR_SUCCESS != ret)
	{
		printf("键不存在，需要创建\n");
		printf("ret = %u\n", ret);
		value2 = timeout;
		ret = RegSetValueEx(hKey2, lpInactivityTimeoutSecsKey, 0, REG_DWORD, (const BYTE*)&value2, size2);
		if (ERROR_SUCCESS != ret)
		{
			printf("写入\t%S\t失败\n", lpInactivityTimeoutSecsKey);
			RegCloseKey(hKey2);
			return -1;
		}
		printf("写入\t%S\t成功 ,值为:\t%u\t\n", lpInactivityTimeoutSecsKey, value2);
		RegCloseKey(hKey2);
	}
	else
	{
		printf("键存在\n");
		value2 = timeout;
		ret = RegSetValueEx(hKey2, lpInactivityTimeoutSecsKey, 0, REG_DWORD, (const BYTE*)&value2, size2);
		if (ERROR_SUCCESS != ret)
		{
			printf("写入\t%S\t失败\n", lpInactivityTimeoutSecsKey);
			RegCloseKey(hKey2);
			return -1;
		}
		printf("写入\t%S\t成功 ,值为:\t%u\t\n", lpInactivityTimeoutSecsKey, value2);
		RegCloseKey(hKey2);
	}



	system("pause");

	return 0;
}
```

