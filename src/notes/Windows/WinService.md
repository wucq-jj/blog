---
title: Windows服务
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
  - Windows服务
  - Windows C

footer: 天行健，君子以自强不息；地势坤，君子以厚德载物
---

# Windows服务开发

**题目:**

- 开机启动
- `10s`获取一次流量，保存到日志`(isagent.bin)`文件
- 日志最大支持`10M`，超过`10M`后原日志文件改名`isagent.bin.bak`,重新创建`isagent.bin`保存新日志
- 删除多余的日志文件(只保留`isagent.bin`和`isagent.bin.bak`)

## 代码

```c
#include <Windows.h>
#include <stdio.h>
#include <tchar.h>
#include <time.h>
#include <sys/stat.h>
#include <Iphlpapi.h>  
  

using namespace std;
#pragma comment(lib,"Iphlpapi.lib") //需要添加Iphlpapi.lib库  



#define SERVICE_NAME  _T("MyWinServiceTest01")
#define LOGFILE "C:\\Users\\Administrator\\Desktop\\123\\isagent.bin"
#define LOGFILE_BAK "C:\\Users\\Administrator\\Desktop\\123\\isagent.bin.bak"
#define SLEEP_TIME 9000        //  9s
#define MAX_FILE_SIZE 10485760       // 1024 * 1024 * 10


SERVICE_STATUS          g_ServiceStatus = { 0 };
SERVICE_STATUS_HANDLE   g_ServiceStatusHandle = NULL;
HANDLE                  g_ServiceStopEvent = INVALID_HANDLE_VALUE;
unsigned long           g_FileSize = 0;

VOID WINAPI ServiceMain(DWORD argc, LPTSTR* argv);  //  服务主函数
VOID WINAPI ServiceCtrlHandler(DWORD);              //  服务控制处理函数
int WriteToLog(char* str);                          
int GetEthernetTraffic(unsigned long& InOctets, unsigned long& OutOctets);  //  获取网卡流量
int IsFileExit(const char * filePath);
int StartUp();

int main(int argc, TCHAR* argv[])
{
    //if (StartUp())
    //{
    //    //  开机自启动
    //    WriteToLog("service startup failed");
    //    return -1;
    //}

    SERVICE_TABLE_ENTRY ServiceTable[] =
    {
        { SERVICE_NAME, (LPSERVICE_MAIN_FUNCTION)ServiceMain },
        { NULL, NULL }
    };
    // 注册服务并进入服务主函数
    if (StartServiceCtrlDispatcher(ServiceTable) == FALSE)
        return GetLastError();
    return 0;
}

int WriteToLog(char* str)
{
    time_t now = time(nullptr);
    struct tm info;
    char time_stamp[80];
    localtime_s(&info, &now);
    strftime(time_stamp, sizeof(time_stamp), "%Y-%m-%d-%H:%M:%S", &info);


    FILE* fp = nullptr;
    fopen_s(&fp, LOGFILE, "a+");
    if (fp == nullptr)
    {
        return -1;
    }
    fprintf_s(fp, "[%s]\t\t%s\n", time_stamp, str);
    fseek(fp, 0, SEEK_END);
    g_FileSize = ftell(fp);
    fclose(fp);
    fp = nullptr;
    if (g_FileSize >= MAX_FILE_SIZE)
    {
        //判断有无 备份文件，有则删除
        if (IsFileExit(LOGFILE_BAK))
            remove(LOGFILE_BAK);
        rename(LOGFILE, LOGFILE_BAK);

        fopen_s(&fp, LOGFILE, "w");
        if (!fp)
            exit(0);
        fclose(fp);
        fp = nullptr;
    }
    return 0;
}

VOID WINAPI ServiceMain(DWORD argc, LPTSTR* argv)
{
    g_ServiceStatus.dwServiceType = SERVICE_WIN32;
    g_ServiceStatus.dwCurrentState = SERVICE_START_PENDING;
    //接受停止和关机
    g_ServiceStatus.dwControlsAccepted = SERVICE_ACCEPT_SHUTDOWN | SERVICE_ACCEPT_STOP;

    g_ServiceStatus.dwWin32ExitCode = 0;
    g_ServiceStatus.dwServiceSpecificExitCode = 0;
    g_ServiceStatus.dwCheckPoint = 0;
    g_ServiceStatus.dwWin32ExitCode = 0;

    //注册服务
    g_ServiceStatusHandle = RegisterServiceCtrlHandler(SERVICE_NAME, ServiceCtrlHandler);
    if (g_ServiceStatusHandle == NULL)
    {
        WriteToLog("RegisterServiceCtrlHandler failed");
        return;
    }

    WriteToLog("RegisterServiceCtrlHandler success");
    WriteToLog("service started");

    //上报状态 运行
    g_ServiceStatus.dwCurrentState = SERVICE_RUNNING;
    SetServiceStatus(g_ServiceStatusHandle, &g_ServiceStatus);

    while (g_ServiceStatus.dwCurrentState == SERVICE_RUNNING)
    {
        unsigned long in1 = 0, in2 = 0, out1 = 0, out2 = 0;
        if (GetEthernetTraffic(in1, out1))
            WriteToLog("Get ethernet traffic failed 1");
        Sleep(1000);
        if (GetEthernetTraffic(in2, out2))
            WriteToLog("Get ethernet traffic failed 2");
        
        char str[256] = {0};
        sprintf_s(str, "receive:%u\t\t\tsend:%u\t", in2 - in1, out2 - out1);    // 每秒的流量为上一秒的数据量减去当前的数量量
        WriteToLog(str);

        Sleep(SLEEP_TIME);
    }
    WriteToLog("Service stopped");
}

VOID WINAPI ServiceCtrlHandler(DWORD request)
{
    switch (request)
    {
    case SERVICE_CONTROL_STOP:
    {
        WriteToLog("Service stopped.");
        g_ServiceStatus.dwWin32ExitCode = 0;
        g_ServiceStatus.dwCurrentState = SERVICE_STOPPED;
        SetServiceStatus(g_ServiceStatusHandle, &g_ServiceStatus);
        return;
    }
    case SERVICE_CONTROL_SHUTDOWN:
    {
        WriteToLog("Service shutdown.");
        g_ServiceStatus.dwWin32ExitCode = 0;
        g_ServiceStatus.dwCurrentState = SERVICE_STOPPED;
        SetServiceStatus(g_ServiceStatusHandle, &g_ServiceStatus);
        return;
    }
    default:
        break;
    }
    //  上报默认状态
    SetServiceStatus(g_ServiceStatusHandle, &g_ServiceStatus);
    return;
}

int GetEthernetTraffic(unsigned long& InOctets, unsigned long& OutOctets)
{
    MIB_IFTABLE* pIfTable = NULL;
    ULONG          dwSize = 0;
    DWORD          dwRet;
    dwRet = GetIfTable(pIfTable, &dwSize, TRUE);
    if (dwRet == ERROR_INSUFFICIENT_BUFFER)
    {
        pIfTable = (MIB_IFTABLE*) new char[dwSize];
        if (pIfTable != NULL)
        {
            dwRet = GetIfTable(pIfTable, &dwSize, TRUE);
            if (dwRet == NO_ERROR)
            {
                for (int i = 0; i < pIfTable->dwNumEntries; i++)
                {
                    //MIB_IF_TYPE_ETHERNET ->以太网
                    if ((pIfTable->table[i]).dwType == MIB_IF_TYPE_ETHERNET && (pIfTable->table[i]).dwAdminStatus == 1
                        && ((pIfTable->table[i].dwOperStatus) == MIB_IF_OPER_STATUS_OPERATIONAL)    //默认网卡连接状态
                        && (!(lstrcmp((pIfTable->table[i]).wszName, _T("\\DEVICE\\TCPIP_{32A8444C-9C82-4415-8D13-88C71B04C500}"))))) //自己的网卡名称 不同网卡名称不一样 需要查询
                    {
                        InOctets = (pIfTable->table[i]).dwInOctets;
                        OutOctets = (pIfTable->table[i]).dwOutOctets;   
                    }
                }
            }
            else
            {
                return -1;
                printf("Some error occured!\n");
            }
        }
        else
        {
            return -2;
            printf("Memory allocate failue\n");
        }
    }
    else
    {
        return -3;
        printf("Some error occured!\n");
    }

    return 0;
}
int IsFileExit(const char* filePath)
{
    struct stat st;
    return (stat(filePath, &st) == 0);
}

int StartUp()
{
    LPCTSTR lpSubKey = _T("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run");
    HKEY hKey;
    LONG lRet = RegOpenKeyEx(HKEY_LOCAL_MACHINE, lpSubKey, 0, KEY_ALL_ACCESS, &hKey);
    if (ERROR_SUCCESS != lRet) 
        return -1;

    TCHAR exeFilePath[200] = { 0 };
    GetModuleFileName(NULL, exeFilePath, 200);
    TCHAR* tchrpName = exeFilePath;
    lRet = RegSetValueEx(hKey, TEXT("超级木马"), NULL, REG_SZ, (LPBYTE)tchrpName, _tcslen(tchrpName) * sizeof(TCHAR) + 1);
    if (ERROR_SUCCESS != lRet) 
        return -1;
    RegCloseKey(hKey);
    return 0;
}
```





## 注册服务

```bash
注册服务

sc create MyWinServiceTest binPath= "C:\Users\Administrator\Desktop\123\MyWinServiceTest01.exe" start= auto
									 C:\Users\Administrator\Desktop\123\

删除服务
sc delete MyWinServiceTest


启动服务：net start MyWinServiceTest 或 sc start MyWinServiceTest
停止服务：net stop MyWinServiceTest 或 sc stop MyWinServiceTest
删除服务：sc delete MyWinServiceTest
查询服务详细：sc query MyWinServiceTest
```

## `MIB_IFROW`

```
typedef struct _MIB_IFROW { WCHAR wszName[MAX_INTERFACE_NAME_LEN]; DWORD dwIndex; DWORD dwType; DWORD dwMtu; DWORD dwSpeed; DWORD dwPhysAddrLen; BYTE bPhysAddr[MAXLEN_PHYSADDR]; DWORD dwAdminStatus; DWORD dwOperStatus; DWORD dwLastChange; DWORD dwInOctets; DWORD dwInUcastPkts; DWORD dwInNUcastPkts; DWORD dwInDiscards; DWORD dwInErrors; DWORD dwInUnknownProtos; DWORD dwOutOctets; DWORD dwOutUcastPkts; DWORD dwOutNUcastPkts; DWORD dwOutDiscards; DWORD dwOutErrors; DWORD dwOutQLen; DWORD dwDescrLen; BYTE bDescr[MAXLEN_IFDESCR]; } MIB_IFROW, *PMIB_IFROW;
wzsName:包含了该接口的名字(多字节的),具体也不知道哈意思,就是一串数字,有懂的和我说一下
dwIndex:该接口的索引值,比如有多个网卡的时候,每个网卡都有一个索引值,是会随着网卡正在被使用的个数变化的
dwType:该接口的类型,这个类型是被IANA(是个什么协会吧)定义的,有以下几种:
其中24是网络回路的网卡(我自己是这样叫的),就是127.0.0.1那个,应该是每个机子都有的吧 
一般我们用的是6. 
dwMtu:百度一下MTU就知道了,就是该接口的最大传输单元,理解为该通信协议的某一层上面能通过的最大的数据包的大小(以字节为单位) 
dwSpeed:该接口最大的传输速率,可是看成是这个接口每秒最多传多大的数据的一个规格,我刚开始的时候以为这是该接口的即时传输速度呢,郁闷 
dwPhysAddrLen: bPhysAddr指向的地址的长度 
bPhysAddr:指向该接口地址的指针 
dwAdminStatus:该接口的管理状态,按我的理解就是人为设定的那个状态:启用/禁用 
dwOperStatus:该接口的操作状态,它可以取以下的值,看了下面的值就知道是什么意思了 
0 MIB_IF_OPER_STATUS_NON_OPERATIONAL 网络适配器被禁止的状态; 
1 MIB_IF_OPER_STATUS_UNREACHABLE 没有连接的状态; 
2 MIB_IF_OPER_STATUS_DISCONNECTED 电缆未连接的状态; 
3 MIB_IF_OPER_STATUS_CONNECTING 广域网适配器连接中的状态; 
4 MIB_IF_OPER_STATUS_CONNECTED 广域网适配器连接上远程对等点的状态; 
5 MIB_IF_OPER_STATUS_OPERATIONAL 局域网适配器默认的连接状态;
dwLastChange: 适配器状态最后一次改变的时间; 
dwInOctets: 该接口总的收到的数据大小; 
dwInUcastPkts As Long '总共收到(unicast包)
dwInNUcastPkts As Long '总共收到(non-unicast包)，包括广播包和多点传送包dwInDiscards As Long '收到后丢弃包总数（即使没有错误）
dwInErrors As Long '收到出错包总数
dwInUnknownProtos As Long '收到后因协议不明而丢弃的包总数
dwOutOctets As Long '总共发送(字节)
dwOutUcastPkts As Long '总共发送(unicast包)
dwOutNUcastPkts As Long '总共发送(non-unicast包)，包括广播包和多点传送包
dwOutDiscards As Long '发送丢弃包总数（即使没有错误）
dwOutErrors As Long '发送出错包总数
dwOutQLen As Long '发送队列长度
dwDescrLen As Long ' bDescr部分有效长度
bDescr(0 To 255) As Byte '接口描述 也就是在设备管理器上看的到名字 
用一秒钟前后得到的dwInOctets数据相减,就是这一秒中该接口的流量,用这个方法就可以计算机子的即时流量了 
但是当机子有多个网卡时,怎么判断目前机子正在用的是哪一个,我也不知道,在网上看好多例子,当有多网卡时,都是直接用第一个来计算流量的,难道默认得到的结构数组第一个就是正在用的
```

