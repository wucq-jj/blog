---
title: Windows监控指定目录下的文件变化，支持模糊匹配
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
  - 监控文件
  - 模糊匹配

footer: 天行健，君子以自强不息；地势坤，君子以厚德载物
---

# Windows监控指定目录下的文件变化，支持模糊匹配

```c
#include <windows.h>
#include <stdio.h>
#include <iostream>

void watch_directory(LPCTSTR path, LPCTSTR filter);

int main(void)
{
    LPCTSTR path = L"C:\\Users\\Admin\\Desktop\\test\\";  // 监视的文件夹路径
    //    C:\Users\Admin\Desktop\test
    LPCTSTR filter = L".txt";  // 匹配的文件后缀名

    watch_directory(path, filter);

    return 0;
}

void watch_directory(LPCTSTR path, LPCTSTR filter)
{
    HANDLE dir_handle;
    TCHAR buffer[MAX_PATH];
    DWORD bytes_returned;

    // 创建监视器
    dir_handle = FindFirstChangeNotification(path, TRUE, FILE_NOTIFY_CHANGE_LAST_WRITE | FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_DIR_NAME | FILE_NOTIFY_CHANGE_ATTRIBUTES |
                                             FILE_NOTIFY_CHANGE_SIZE);
    if (dir_handle == INVALID_HANDLE_VALUE)
    {
        printf("ERROR: Failed to create directory watcher. Error code: %d\n", GetLastError());
        return;
    }

    // 循环等待文件变化
    while (TRUE)
    {
        // 等待文件变化

        WaitForSingleObject(dir_handle, INFINITE);

        // 重置监视器
        if (FindNextChangeNotification(dir_handle) == FALSE)
        {
            printf("ERROR: Failed to reset directory watcher. Error code: %d\n", GetLastError());
            return;
        }

        // 获取最新的文件变化信息
        if (ReadDirectoryChangesW(dir_handle, &buffer, sizeof(buffer), TRUE, FILE_NOTIFY_CHANGE_LAST_WRITE | FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_DIR_NAME, &bytes_returned, NULL, NULL) == FALSE)
        {
            printf("ERROR: Failed to read directory changes. Error code: %d\n", GetLastError());
            return;
        }

        // 处理文件变化信息
        PFILE_NOTIFY_INFORMATION pinfo = (PFILE_NOTIFY_INFORMATION)&buffer;
        do
        {
            wchar_t a[MAX_PATH] = {0};
            memcpy_s(a, pinfo->FileNameLength, pinfo->FileName, pinfo->FileNameLength);
            if (wcsstr(a, filter) != NULL)
//            if (wcsstr(pinfo->FileName, filter) != NULL)
            {
                std::cout << __FUNCTION__ << __LINE__ << __FILE__ << std::endl;
                // 匹配到指定的文件，打印文件变化信息
                switch (pinfo->Action)
                {
                case FILE_ACTION_ADDED:
                    printf("File added: %ls\n", pinfo->FileName);
                    break;
                case FILE_ACTION_REMOVED:
                    printf("File removed: %ls\n", pinfo->FileName);
                    break;
                case FILE_ACTION_MODIFIED:
                    printf("File modified: %ls\n", pinfo->FileName);
                    break;
                case FILE_ACTION_RENAMED_OLD_NAME:
                    printf("File renamed (old): %ls\n", pinfo->FileName);
                    break;
                case FILE_ACTION_RENAMED_NEW_NAME:
                    printf("File renamed (new): %ls\n", pinfo->FileName);
                    break;
                default:
                    printf("default\n");
                    break;
                }
            }

            pinfo = (PFILE_NOTIFY_INFORMATION)((LPBYTE)pinfo + pinfo->NextEntryOffset);
        } while (pinfo->NextEntryOffset > 0);
    }

    // 关闭监视器
    FindCloseChangeNotification(dir_handle);
}

```

