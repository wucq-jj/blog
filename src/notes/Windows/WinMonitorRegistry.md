---
title: Windows 监控指定注册表键值变化
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
  - 文件
  - Windows C
  - 注册表

footer: 天行健，君子以自强不息；地势坤，君子以厚德载物
---

# Windows 监控指定注册表键值变化

```c
#include <Windows.h>
#include <stdio.h>

int main() {
    HKEY hKey;
    LONG lRes = RegOpenKeyEx(HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Run", 0, KEY_NOTIFY, &hKey);
    if (lRes != ERROR_SUCCESS) {
        printf("Failed to open registry key.");
        return 1;
    }

    HANDLE hEvent = CreateEvent(NULL, TRUE, FALSE, NULL);
    if (hEvent == NULL) {
        printf("Failed to create event.");
        return 1;
    }
    lRes = RegNotifyChangeKeyValue(hKey, TRUE, REG_NOTIFY_CHANGE_LAST_SET, hEvent, TRUE);
    if (lRes != ERROR_SUCCESS) {
        printf("Failed to notify registry changes.");
        return 1;
    }

    while (1) {
        DWORD dwWait = WaitForSingleObject(hEvent, INFINITE);
        if (dwWait == WAIT_OBJECT_0) {
            printf("Registry key changed.\n");

            DWORD dwType;
            BYTE *lpData = NULL;
            DWORD dwSize = 0;
            lRes = RegQueryValueEx(hKey, "Test", NULL, &dwType, lpData, &dwSize);
            if (lRes == ERROR_SUCCESS) {
                lpData = (BYTE*)malloc(dwSize);
                lRes = RegQueryValueEx(hKey, "Test", NULL, &dwType, lpData, &dwSize);
                if (lRes == ERROR_SUCCESS) {
                    printf("Value before change: %s\n", lpData);
                }
            }
            if (lpData != NULL) {
                free(lpData);
            }

            // 等待一段时间，再次获取数据
            Sleep(1000);

            dwSize = 0;
            lRes = RegQueryValueEx(hKey, "Test", NULL, &dwType, lpData, &dwSize);
            if (lRes == ERROR_SUCCESS) {
                lpData = (BYTE*)malloc(dwSize);
                lRes = RegQueryValueEx(hKey, "Test", NULL, &dwType, lpData, &dwSize);
                if (lRes == ERROR_SUCCESS) {
                    printf("Value after change: %s\n", lpData);
                }
            }
            if (lpData != NULL) {
                free(lpData);
            }

            lRes = RegNotifyChangeKeyValue(hKey, TRUE, REG_NOTIFY_CHANGE_LAST_SET, hEvent, TRUE);
            if (lRes != ERROR_SUCCESS) {
                printf("Failed to notify registry changes.");
                return 1;
            }
        }
    }

    return 0;
}
```

