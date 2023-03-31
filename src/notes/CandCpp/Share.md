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

### 双向链表

​		双向链表（Doubly Linked List）是链表的一种扩展，除了有 next 指针指向下一个节点，还有一个 prev 指针指向前一个节点，即每个节点有两个指针，分别指向前一个节点和后一个节点。双向链表支持双向遍历，可以在链表中任意位置插入或删除元素，也可以在任意位置找到某个节点。

```c
#include <stdio.h>
#include <stdlib.h>

// 双向链表节点的结构体
typedef struct ListNode {
    int data;
    struct ListNode *prev;
    struct ListNode *next;
} ListNode;

// 插入节点到链表头部
void insertAtHead(ListNode **head, int data) {
    ListNode *newNode = (ListNode*) malloc(sizeof(ListNode)); // 分配空间创建新节点
    newNode->data = data; // 将数据赋值给新节点
    newNode->prev = NULL;
    newNode->next = *head; // 将新节点的 next 指向链表头

    if (*head != NULL) { // 如果链表非空
        (*head)->prev = newNode; // 将原先的头节点的 prev 指向新节点
    }

    *head = newNode; // 将新节点设置为链表头
}
// 插入节点到链表尾部
void insertAtTail(ListNode **head, int data) {
    ListNode *newNode = (ListNode*) malloc(sizeof(ListNode)); // 分配空间创建新节点
    newNode->data = data; // 将数据赋值给新节点
    newNode->prev = NULL;
    newNode->next = NULL;

    if (*head == NULL) { // 如果链表为空
        *head = newNode;
        return;
    }

    ListNode *current = *head;
    while (current->next != NULL) { // 找到链表的尾节点
        current = current->next;
    }

    current->next = newNode; // 将新节点插入到尾节点之后
    newNode->prev = current;
}

// 反转链表
void reverse(ListNode **head) {
    ListNode *temp = NULL; // 中间变量保存临时节点
    ListNode *current = *head;

    while (current != NULL) {
        temp = current->prev; // 将临时节点设置为当前节点的前一个节点
        current->prev = current->next; // 将当前节点的 prev 指向 next
        current->next = temp; // 将当前节点的 next 指向 temp
        current = current->prev; // 将 current 指向下一个节点
    }

    if (temp != NULL) { // 如果链表非空
        *head = temp->prev; // 将 head 指向最后一个节点
    }
}

// 删除链表中指定元素
void delete(ListNode **head, int data) {
    if (*head == NULL) { // 如果链表为空
        return;
    }

    ListNode *current = *head; // 定义指向当前节点的指针
    ListNode *prev = NULL; // 定义指向前一个节点的指针

    while (current != NULL && current->data != data) { // 找到待删除节点
        prev = current;
        current = current->next;
    }

    if (current == NULL) { // 如果找不到待删除节点
        return;
    }

    if (prev == NULL) { // 如果需要删除的是链表头
        *head = current->next;
    } else { // 如果需要删除的不是链表头
        prev->next = current->next;
    }

    if (current->next != NULL) { // 如果需要删除节点的下一个节点非空
        current->next->prev = prev;
    }

    free(current); // 释放待删除节点
}


// 销毁链表
void destroyList(ListNode **head) {
    ListNode *current = *head; // 定义指向当前节点的指针
    ListNode *next = NULL; // 定义指向下一个节点的指针

    while (current != NULL) {
        next = current->next; // 将指向下一个节点的指针指向下一个节点
        free(current); // 释放当前节点
        current = next; // 将指向当前节点的指针指向下一个节点
    }

    *head = NULL; // 将链表头指针设置为空
}

// 打印链表
void printList(ListNode *head) {
    if (head == NULL) { // 如果链表为空
        printf("List is empty.\n");
        return;
    }

    printf("List: ");
    while (head != NULL) { // 遍历链表
        printf("%d ", head->data);
        head = head->next;
    }
    printf("\n");
}
// 测试
int main() {
    ListNode *head = NULL;

    // 插入数据
    insertAtTail(&head, 1);
    insertAtTail(&head, 2);
    insertAtTail(&head, 3);
    insertAtHead(&head, 4);
    insertAtHead(&head, 5);

    // 打印原始链表
    printf("Original ");
    printList(head);

    // 删除元素
    printf("Deleting 3.\n");
    delete(&head, 3);

    // 打印删除元素后的链表
    printf("After deletion ");
    printList(head);

    // 反转链表
    reverse(&head);

    // 打印反转后的链表
    printf("Reversed ");
    printList(head);

    // 销毁链表
    destroyList(&head);

    return 0;
}
```

### 栈

​		栈（Stack）是一种后进先出（Last In First Out，LIFO）的数据结构。它的特点是只能在栈顶进行操作，也就是说先进入栈底的元素会被压在栈顶元素的后面，只有栈顶元素才能被操作和访问。栈可以用数组或链表实现。常用的操作有 push（入栈）、pop（出栈）和 top（获取栈顶元素）。以计算器为例，当输入一个表达式时，需要利用栈来进行计算。具体实现是：当遇到数字时，将其入栈；当遇到符号时，从栈中弹出两个数进行计算，再将结果入栈；最后栈顶的元素即为表达式的结果。栈也可以用在函数调用中。每当调用一个函数时，都会将其参数和返回地址压入栈中，函数执行结束后再弹出栈顶元素，将控制权返回给调用者。在操作系统中，栈被用来处理程序的调用、中断和异常等。当程序运行遇到中断或异常时，当前执行的指令和寄存器状态会被保存在栈中，处理完中断或异常后，再从栈中恢复状态并继续执行。栈是一种非常常用的数据结构，被广泛应用于编译器、操作系统、数据库等领域中的算法和数据结构。

```c
#include <stdio.h>
#include <stdlib.h>

// 定义栈的节点类型
typedef struct Node {
    int data;
    struct Node *next;
} Node;

// 定义链栈的结构体
typedef struct LinkedListStack {
    Node *top;
} LinkedListStack;

// 创建一个空链栈并返回栈顶指针
LinkedListStack* createStack() {
    LinkedListStack *s = (LinkedListStack*) malloc(sizeof(LinkedListStack)); // 分配空间创建链栈
    s->top = NULL; // 链栈的栈顶初始为NULL
    return s;
}

// 判断链栈是否为空
int isEmpty(LinkedListStack *s) {
    return s->top == NULL;
}

// 入栈操作
void push(LinkedListStack *s, int data) {
    Node *newNode = (Node*) malloc(sizeof(Node)); // 创建一个新节点
    newNode->data = data; // 节点存储数据
    newNode->next = s->top; // 将新节点插入到链栈的栈顶
    s->top = newNode; // 更新链栈的栈顶指针
    printf("%d pushed to stack.\n", data);
}

// 出栈操作
int pop(LinkedListStack *s) {
    if (isEmpty(s)) { // 如果栈为空，无法出栈
        printf("Stack is empty. Cannot pop from stack.\n");
        return -1;
    }
    int data = s->top->data; // 取出栈顶元素
    Node *temp = s->top; // 用临时指针存储栈顶节点
    s->top = s->top->next; // 更新链栈的栈顶指针
    free(temp); // 释放栈顶的节点空间
    printf("%d popped from stack.\n", data);
    return data;
}

// 获取栈顶元素
int peek(LinkedListStack *s) {
    if (isEmpty(s)) { // 如果栈为空，栈顶无法取出
        printf("Stack is empty. Cannot peek from stack.\n");
        return -1;
    }
    return s->top->data;
}

// 遍历链栈并打印元素
void printStack(LinkedListStack *s) {
    if (isEmpty(s)) { // 如果栈为空
        printf("Stack is empty.\n");
        return;
    }
    printf("Stack: ");
    Node *temp = s->top; // 用临时指针遍历链栈
    while (temp != NULL) {
        printf("%d ", temp->data);
        temp = temp->next;
    }
    printf("\n");
}

// 测试
int main() {
    LinkedListStack *s = createStack(); // 创建一个空链栈

    push(s, 1); // 入栈元素 1
    push(s, 2); // 入栈元素 2
    push(s, 3); // 入栈元素 3
    printStack(s); // 打印链栈

    pop(s); // 出栈元素
    printStack(s); // 打印链栈

    printf("Peeking from stack: %d\n", peek(s)); // 获取栈顶元素

    pop(s); // 出栈元素
    pop(s); // 出栈元素
    pop(s); // 尝试出栈元素，但是栈已经为空

    // 释放链栈的空间
    free(s);

    return 0;
}
```

### 栈的应用，表达式求值

```C 
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>

typedef struct
{
    int top;        // 栈顶指针
    int capacity;   // 栈的容量
    int *data;      // 存储数据的数组
} Stack;

void init(Stack *s, int capacity)
{
    s->top = -1;        // 初始化栈顶指针
    s->capacity = capacity;
    s->data = (int *)malloc(sizeof(int) * capacity);    // 分配存储数据的数组
}

void push(Stack *s, int value)
{
    if (s->top == s->capacity - 1)      // 栈已满
        return;

    s->data[++s->top] = value;          // 栈顶指针加一，将数据压入栈中
}

int pop(Stack *s)
{
    if (s->top == -1)       // 栈为空
        return 0;

    return s->data[s->top--];       // 返回栈顶元素，并将栈顶指针减一
}

int peek(Stack *s)
{
    if (s->top == -1)       // 栈为空
        return 0;

    return s->data[s->top];        // 返回栈顶元素
}

int is_empty(Stack *s)
{
    return s->top == -1;        // 判断栈是否为空
}

int is_operator(char c)
{
    return c == '+' || c == '-' || c == '*' || c == '/';    // 判断是否为运算符
}

int get_operator_priority(char c)
{
    if (c == '+' || c == '-')
        return 1;
    else if (c == '*' || c == '/')
        return 2;
    else
        return 0;
}

int evaluate_expression(char *exp)
{
    Stack operand_stack;
    Stack operator_stack;
    init(&operand_stack, strlen(exp));
    init(&operator_stack, strlen(exp));
    int i;
    for (i = 0; exp[i] != '\0'; i++)    // 遍历表达式
    {
        if (isdigit(exp[i]))       // 如果是数字，直接压入操作数栈中
        {
            int operand = 0;
            while (isdigit(exp[i]))
            {
                operand = operand * 10 + (exp[i] - '0');
                i++;
            }
            push(&operand_stack, operand);
            i--;    // 因为循环中会自动加一，所以此处减一
        }
        else if (exp[i] == '(')     // 如果是左括号，直接压入操作符栈中
        {
            push(&operator_stack, exp[i]);
        }
        else if (exp[i] == ')')     // 如果是右括号，弹出操作符栈中的元素，直到遇到左括号为止，然后将运算结果压入操作数栈中
        {
            while (!is_empty(&operator_stack) && peek(&operator_stack) != '(')
            {
                char operator = pop(&operator_stack);
                int right_operand = pop(&operand_stack);
                int left_operand = pop(&operand_stack);
                switch (operator)
                {
                    case '+':
                        push(&operand_stack, left_operand + right_operand);
                        break;
                    case '-':
                        push(&operand_stack, left_operand - right_operand);
                        break;
                    case '*':
                        push(&operand_stack, left_operand * right_operand);
                        break;
                    case '/':
                        push(&operand_stack, left_operand / right_operand);
                        break;
                }
            }
            pop(&operator_stack);   // 把左括号弹出
        }
        else if (is_operator(exp[i]))       // 如果是运算符，将其与操作符栈中的元素进行比较，判断是否需要进行运算
        {
            while (!is_empty(&operator_stack) && peek(&operator_stack) != '(' && get_operator_priority(exp[i]) <= get_operator_priority(peek(&operator_stack)))
            {
                char operator = pop(&operator_stack);
                int right_operand = pop(&operand_stack);
                int left_operand = pop(&operand_stack);
                switch (operator)
                {
                    case '+':
                        push(&operand_stack, left_operand + right_operand);
                        break;
                    case '-':
                        push(&operand_stack, left_operand - right_operand);
                        break;
                    case '*':
                        push(&operand_stack, left_operand * right_operand);
                        break;
                    case '/':
                        push(&operand_stack, left_operand / right_operand);
                        break;
                }
            }
            push(&operator_stack, exp[i]);  // 将当前运算符压入操作符栈中
        }
    }
    while (!is_empty(&operator_stack))     // 虽然表达式已经遍历结束，但操作符栈中可能还有元素，需要进行弹出和运算
    {
        char operator = pop(&operator_stack);
        int right_operand = pop(&operand_stack);
        int left_operand = pop(&operand_stack);
        switch (operator)
        {
            case '+':
                push(&operand_stack, left_operand + right_operand);
                break;
            case '-':
                push(&operand_stack, left_operand - right_operand);
                break;
            case '*':
                push(&operand_stack, left_operand * right_operand);
                break;
            case '/':
                push(&operand_stack, left_operand / right_operand);
                break;
        }
    }
    int result = pop(&operand_stack);   // 最终结果是栈中唯一的元素，即操作数栈的栈顶元素
    free(operand_stack.data);       // 释放操作数栈和操作符栈占用的空间
    free(operator_stack.data);
    return result;
}

int main()
{
    char exp[100];
    printf("请输入一个表达式：\n");
    scanf("%s", exp);
    int result = evaluate_expression(exp);
    printf("表达式的结果是：%d\n", result);
    return 0;
}
```

