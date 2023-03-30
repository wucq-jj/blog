---
title: 数据结构
category:
  - 数据结构
tag: 
  - 链表
  - 栈
  - 队列
  - 树
editLink: false   # 不允许编辑页面
date: 2023-03-30
---

## 链表

### 什么是链表

​			链表是一种基本的数据结构，它由一系列结点组成，每个结点都包括两个部分：数据域和指针域。数据域用于存储一个数据元素，指针域用于指向下一个结点。链表中的第一个结点称为头结点，最后一个结点称为尾结点。链表具有动态性、节省内存等优点，常用于实现栈和队列等数据结构。链表有单向链表、双向链表和循环链表等多种形式。在单向链表中，每个结点只有一个指针域，指向下一个结点；在双向链表中，每个结点有两个指针域，一个指向下一个结点，一个指向上一个结点；在循环链表中，尾结点的指针指向头结点，形成一个环。链表分为链表的插入、链表的删除、链表的修改和链表的查找等操作，需要灵活应用不同的操作方法。

### 怎么创建链表（C语言 单向链表）

```c
#include <stdio.h>
#include <stdlib.h>

//链表节点定义
typedef struct ListNode {
    int val;  // 结点的值
    struct ListNode* next;  // 指向下一个结点的指针
} ListNode;

// 创建一个新结点
ListNode* createNode(int val) {
    ListNode* node = (ListNode*)malloc(sizeof(ListNode));
    node->val = val;
    node->next = NULL;
    return node;
}
// 头插法，将新结点插入链表的头部
void insertNodeAtHead(ListNode** head, int val) {
    ListNode* node = createNode(val);
    node->next = *head;
    *head = node;
}

// 尾插法，将新结点插入链表的末尾
void insertNodeAtTail(ListNode** head, int val) {
    ListNode* node = createNode(val);
    if (*head == NULL) {  // 如果链表为空，直接创建一个结点作为头结点
        *head = node;
    } else {
        ListNode* p = *head;
        while (p->next != NULL) {  // 找到最后一个结点
            p = p->next;
        }
        p->next = node;  // 在最后一个结点后面插入一个新结点
    }
}

// 删除链表中第一个值等于给定值的结点
void deleteNode(ListNode** head, int val) {
    if (*head == NULL) {
        return;
    }
    if ((*head)->val == val) {  // 如果头结点的值等于给定值，直接删除头结点
        ListNode* p = *head;
        *head = (*head)->next;
        free(p);
        return;
    }
    ListNode* prev = *head;
    ListNode* p = (*head)->next;
    while (p != NULL && p->val != val) {  // 找到第一个值等于给定值的结点
        prev = p;
        p = p->next;
    }
    if (p != NULL) {  // 如果找到了结点，删除它
        prev->next = p->next;
        free(p);
    }
}
// 打印链表所有结点的值
void printList(ListNode* head) {
    if (head == NULL) {
        printf("List is empty.\n");
    } else {
        printf("List: ");
        ListNode* p = head;
        while (p != NULL) {
            printf("%d ", p->val);
            p = p->next;
        }
        printf("\n");
    }
}

// 反转链表
ListNode* reverseList(ListNode* head) {
    ListNode* prev = NULL;  // 前驱节点
    ListNode* curr = head;  // 当前节点
    while (curr != NULL) {
        ListNode* next = curr->next;  // 记录下一节点
        curr->next = prev;  // 反转指向
        prev = curr;
        curr = next;
    }
    return prev;  // 返回新的头结点
}


// 销毁链表，释放所有结点占用的内存
void destroyList(ListNode** head) {
    ListNode* p = *head;
    while (p != NULL) {
        ListNode* next = p->next;
        free(p);
        p = next;
    }
    *head = NULL;  // 将头指针设为 NULL，表示链表已经不存在
}

// 主函数，用于测试链表的实现
int main(int argc, char **argv) {
    ListNode* head = NULL;  // 初始化链表为空
    insertNodeAtHead(&head, 1);
    insertNodeAtHead(&head, 2);
    insertNodeAtHead(&head, 3);
    printList(head);
    insertNodeAtTail(&head, 0);
    printList(head);
    deleteNode(&head, 2);
    printList(head);
    head = reverseList(head);
    printList(head);

    destroyList(&head);
    return 0;
}
```

