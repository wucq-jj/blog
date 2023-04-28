---
title: Windows事件 Event
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
  - Windows事件 Event
  - Windows C

footer: 天行健，君子以自强不息；地势坤，君子以厚德载物
---

# Windows 进程同步机制 事件Event

事件内核对象主要包括三个部分：使用计数，一个表示是自动还是手动重置事件的布尔值，一个表示是否有信号的布尔值。

- 使用计数：和其他内核对象一样，用来标识使用该事件对象的不同线程个数。
- 表示自动或手动重置事件的布尔值：当一个事件是自动重置事件，事件被触发后，只有一个等待的线程会变成可调度状态（根据系统的调度策略），然后该事件会自动变成未触发状态；当一个事件是手动重置事件，事件被触发后，所有等待的线程都会变成可调度状态，该事件在触发后一直为触发状态，直到手动重置该事件为未触发状态。
- 是否有信号的布尔值：表示改事件是否被触发。

## 创建事件`CreateEvent()`

```c
HANDLE WINAPI CreateEvent(
  _In_opt_  LPSECURITY_ATTRIBUTES lpEventAttributes,
  _In_      BOOL bManualReset,
  _In_      BOOL bInitialState,
  _In_opt_  LPCTSTR lpName
);
```

`lpEventAttributes`:事件对象的安全属性，一般置为NULL；

`bManualReset`:事件对象是手动重置事件`（TRUE）`还是自动重置事件`（FALSE）`；

`bInitialState`:初始状态时触发状态`（TRUE）`还是非触发状态`（FALSE）`；

`lpName`:创建有名的事件对象，用于进程间的共享；

如果该事件对象已经存在，那么`CreateEvent()`会返回该内核对象的句柄，并通过系统返回错误`ERROR_ALREADY_EXISTS`，通过`GetLastError（）`获得。

## 打开时间`OpenEvent()`

```c
HANDLE WINAPI OpenEvent(
  _In_  DWORD dwDesiredAccess,
  _In_  BOOL bInheritHandle,
  _In_  LPCTSTR lpName
);
```

`dwDesiredAccess`:制定想要访问的权限，`EVENT_ALL_ACCESS`请求对实践对象完全访问，`EVENT_MODIFY_STATE` 允许`SetEvent()`,`ResetEvent()`,和`PulseEvent()`函数；

`bInheritHandle`：是否希望子进程继承事件对象的句柄，一般设置为false；

`lpName`：要打开的事件对象的名称；

其他进程中的线程可以通过`OpenEvent`或`CreateEvent`访问已经存在的事件内核对象。和其他内核对象的访问一样。

## 等待函数`WaitForSingleObject()`

```c
DWORD WINAPI WaitForSingleObject(
  _In_  HANDLE hHandle,
  _In_  DWORD dwMilliseconds
);
```

`hHandle`:指向内核对象的句柄

`dwMilliseconds`：线程最大等待多长时间，直到该对象被触发。经常使用INFINITE，表示阻塞等待。

`WaitForSingleObject`被称呼为等待函数，是等待内核对象被触发通用的等待函数，被用在所有的内核对象触发等待中。当事件对象处于未触发状态，等待函数会被阻塞。当处于触发状态时，等待函数会被系统调用，成功返回。当等待函数返回后，该事件对象的状态是被重置为未触发状态还是仍然处于触发状态，由该事件对象是自动重置还是手动重置事件决定。当该事件对象时自动重置事件，等待函数返回时，该事件会变成未触发状态，如果为手动重置事件，那么等待函数返回后，该事件仍然处于触发状态，直到调用`ResetEvent`函数，使该事件变成未触发状态。

## 设置事件为触发状态`SetEvent()`

```c
BOOL WINAPI SetEvent(
  _In_  HANDLE hEvent
);
```

`hEvent`:指向内核对象的句柄

设置事件内核对象为触发状态；

## 设置事件为未触发状态`ResetEvent()`

```c
BOOL WINAPI ResetEvent(
  _In_  HANDLE hEvent
);
```

`hEvent`:指向内核对象的句柄

设置事件内核对象为未触发状态；对于事件内核对象，当该事件对象被设置为自动重置事件的时候，`ResetEvent()`的调用时不必要的，因为在自动重置事件上进行等待时，即调用`WaitForSingleObject()`，当等待函数返回时，该事件会被自动重置为未触发的状态。

