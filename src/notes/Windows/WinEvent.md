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

