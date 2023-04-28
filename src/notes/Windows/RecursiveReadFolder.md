---
title: 递归读取文件夹
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
  - 文件操作
  - 文件夹
  - 文件属性
  - Windows C

footer: 天行健，君子以自强不息；地势坤，君子以厚德载物
---

# C语言 Windows递归读取文件夹

**题目要求**

- 递归枚举c:\windows\system32文件夹下的所有文件
- 列出文件名称，全路径，以及文件大小和创建日期到日志文件

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <windows.h>

#define LOG_FILE "fileLog.txt"
#define MAX_TIME_STRING 256
#define DEST_FILE_PATH "C:Windows/System32/"

void findFiles(const char* path, FILE* logFile);
DWORD showFileTime(_In_ PFILETIME lptime, _Out_ char *timeString);
DWORD ShowFileSize(_In_ DWORD dwFileSizeHigh, _In_ DWORD dwFileSizeLow, _Out_ ULONGLONG & fileSize);

int main(int argc, char *argv[])
{   
    FILE* fp = NULL;
    fopen_s(&fp, LOG_FILE, "w");
    if (fp == NULL) {
        printf("无法打开日志文件：%s\n", LOG_FILE);
        return -1;
    }
    
    findFiles(DEST_FILE_PATH, fp);
    
    fclose(fp);
    fp = NULL;
    system("pause");
    return 0;
}

void findFiles(const char* path, FILE* logFile)
{
    static int depth = 0;               // 递归深度，用于输出目录名称缩进
    WIN32_FIND_DATAA findData;          // 当前文件或目录结构体
    HANDLE hFind = NULL;                // 查找到的句柄
    char subPath[MAX_PATH];             // 子路径，用于递归

    // 构造查询条件
    snprintf(subPath, sizeof(subPath), "%s*", path);
    

    // 开始查找
    hFind = FindFirstFileA(subPath, &findData);
    if (INVALID_HANDLE_VALUE == hFind) 
    {
        return;
    }

    do {
        // 排除"."与".."目录
        if (strcmp(findData.cFileName, ".") == 0 || strcmp(findData.cFileName, "..") == 0) 
            continue;
        // 构造完整路径 注意必须加上
        snprintf(subPath, sizeof(subPath), "%s/%s/", path, findData.cFileName);	
        
        // 判断是否是目录
        if (findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) 
        {
            // 输出目录名称并递归查找
            printf("%*s目录：%s\n", depth * 4, "", subPath);
            // 写入文件日志
            fprintf(logFile, "%*s目录：%s\n", depth * 4, "", subPath);
            depth++;
            findFiles(subPath, logFile);
            depth--;
        }  
        else 
        {
            
            char timeString[MAX_TIME_STRING];
            showFileTime(&(findData.ftCreationTime), timeString);
            ULONGLONG fileSize = 0;
            ShowFileSize(findData.nFileSizeHigh, findData.nFileSizeLow, fileSize);

            // 输出文件信息
            printf("%*s[文件:%s]\t\t文件大小:%lld\t\t字节\t\t\t文件创建时间:%s\n",
                4 * depth, "", subPath, fileSize, timeString);
            
            
            // 写入文件日志
            fprintf(logFile, "%*s[文件:%s]\t\t[文件大小:%lld字节]\t\t[文件创建时间:%s]\n",
                4 * depth, "", subPath, fileSize, timeString);
        }
    } while (FindNextFileA(hFind, &findData));

    // 关闭句柄
    FindClose(hFind);
}


//此代码使用 FindFirstFile() 和 FindNextFile() 来查找文件和目录，使用 fprintf() 来将文件路径、大小和创建日期写入日志文件，
//并使用递归调用 findFiles() 函数来遍历并记录目录下的子文件和子目录。为了美化输出，代码使用了递归深度来缩进显示目录名称，
//输出的目录名称与文件名称通过前缀字符（"  目录：" 或 "  文件："）区分开来。


/*
*功能：转换文件时间并打印
*参数：PFILETIMR lptime 指向文件的时间的指针
*返回值：0
**********************/
DWORD showFileTime(_In_ PFILETIME lptime, _Out_ char* timeString)
{
    FILETIME ftLocal;   //文件时间结构
    SYSTEMTIME st;      //系统时间结构

    FileTimeToLocalFileTime(lptime,&ftLocal);       //调整为系统所在时区的时间
    FileTimeToSystemTime(&ftLocal, &st);            //将文件时间转换为SYSTEMTIME格式，便于显示

    //显示时间信息字符串
    //printf("%4d年%#02d月%#02d日,%#02d:%#02d:%#02d\n",
    //    st.wYear,
    //    st.wMonth,
    //    st.wDay,
    //    st.wHour,
    //    st.wMinute,
    //    st.wSecond
    //);
    sprintf_s(timeString, MAX_TIME_STRING, "%4d年%#02d月%#02d日,%#02d:%#02d:%#02d",
        st.wYear,
        st.wMonth,
        st.wDay,
        st.wHour,
        st.wMinute,
        st.wSecond
    );
    return 0;
}

/*
*功能：打印文件大小信息
*参数：DWORD dwFileSizeHigh，文件大小高32位
*      DWORD dwFileSizeLow ，文件大小低32位
**********************************/
DWORD ShowFileSize(_In_ DWORD dwFileSizeHigh, _In_ DWORD dwFileSizeLow, _Out_ ULONGLONG & fileSize)
{
    ULONGLONG liFileSize;
    liFileSize = dwFileSizeHigh;
    //移动到32位
    liFileSize <<= sizeof(DWORD) * 8;
    liFileSize += dwFileSizeLow;
    /*printf("文件大小：\t%I64u字节\n", liFileSize);*/
    fileSize = liFileSize;
    return 0;
}

```

