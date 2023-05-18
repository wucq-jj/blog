---
title: Windows 监控进程状态
index: true
comment: false
icon: edit
editLink: false
date: 2023-05-18
pageview: true
Word: true

category:
  - Windows
tag: 
  - 进程
  - Windows C

footer: 天行健，君子以自强不息；地势坤，君子以厚德载物
---

# Windows 监控进程状态

```c
#include <windows.h>
#include <tlhelp32.h>
#include <stdio.h>

// 获取指定PID的进程状态
DWORD GetProcessStatus(DWORD pid)
{
    HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION, FALSE, pid);
    if (hProcess == NULL)
    {
        printf("OpenProcess failed, error=%d\n", GetLastError());
        return 0;
    }

    DWORD exitCode = 0;
    if (!GetExitCodeProcess(hProcess, &exitCode))
    {
        printf("GetExitCodeProcess failed, error=%d\n", GetLastError());
        CloseHandle(hProcess);
        return 0;
    }

    CloseHandle(hProcess);

    return exitCode;
}

int main()
{
    char* processNames[] = { "notepad.exe", "calc.exe" }; // 要监视的进程名称列表
    DWORD pids[2] = { 0 }; // 进程ID数组

    while (1)
    {
        for (int i = 0; i < 2; i++)
        {
            if (pids[i] == 0) // 如果进程还没有被找到
            {
                HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
                if (hSnapshot == INVALID_HANDLE_VALUE)
                {
                    printf("CreateToolhelp32Snapshot failed, error=%d\n", GetLastError());
                    return 1;
                }

                PROCESSENTRY32 pe = { 0 };
                pe.dwSize = sizeof(PROCESSENTRY32);

                if (Process32First(hSnapshot, &pe))
                {
                    do
                    {
                        if (_stricmp(pe.szExeFile, processNames[i]) == 0)
                        {
                            pids[i] = pe.th32ProcessID;
                            printf("Found %s with PID %d\n", processNames[i], pids[i]);
                            break;
                        }
                    } while (Process32Next(hSnapshot, &pe));
                }

                CloseHandle(hSnapshot);
            }
            else // 如果进程已经被找到
            {
                DWORD status = GetProcessStatus(pids[i]);
                if (status == STILL_ACTIVE)
                {
                    printf("Process %s with PID %d is still running\n", processNames[i], pids[i]);
                }
                else
                {
                    printf("Process %s with PID %d has exited with code %d\n", processNames[i], pids[i], status);
                    pids[i] = 0; // 重置PID，以便下一次查找
                }
            }
        }

        Sleep(1000); // 等待1秒钟后再检查
    }

    return 0;
}
```

