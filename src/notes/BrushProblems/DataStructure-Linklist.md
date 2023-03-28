---
title: 链表
index: true
comment: false
icon: edit
editLink: false
date: 2023-03-26
pageview: true
Word: true
category:
  - 数据结构-链表
tag: 
  - LeetCode
footer: 天行健，君子以自强不息；地势坤，君子以厚德载物


---

141.环形链表（简单题）

给你一个链表的头节点 `head` ，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：`pos` 不作为参数进行传递 。仅仅是为了标识链表的实际情况。

如果链表中存在环 ，则返回 `true` 。 否则，返回 `false` 。

示例1：

![img](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202303262153732.png)

## 

```
输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点。
```

示例2：

![img](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202303262154274.png)

```
输入：head = [1,2], pos = 0
输出：true
解释：链表中有一个环，其尾部连接到第一个节点。
```

实例3：

![img](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202303262154909.png)

```
输入：head = [1], pos = -1
输出：false
解释：链表中没有环。
```

**提示：**

- 链表中节点的数目范围是 `[0, 104]`
- `-105 <= Node.val <= 105`
- `pos` 为 `-1` 或者链表中的一个 **有效索引** 。

题解：

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    bool hasCycle(ListNode *head) {
        ListNode *slow = head, *fast = head;
        while(fast != nullptr && fast->next != nullptr)
        {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast)
                return true;
        }
        return false;
    }
};
```



## 21.合并两个有序链表（简单题）

将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

示例1：

![image-20230327102902611](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202303271029661.png)

```
输入：l1 = [1,2,4], l2 = [1,3,4]
输出：[1,1,2,3,4,4]
```

示例2：

```
输入：l1 = [], l2 = []
输出：[]
```

示例3：

```
输入：l1 = [], l2 = [0]
输出：[0]
```

**提示：**

- 两个链表的节点数目范围是 `[0, 50]`
- `-100 <= Node.val <= 100`
- `l1` 和 `l2` 均按 **非递减顺序** 排列

### 题解1（暴力）：

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode *head = new ListNode(-1);
        ListNode *tmp = head;

        while(list1 != nullptr && list2 != nullptr)
        {
            if (list1->val < list2->val)
            {
                tmp->next = list1;
                list1 = list1->next;
            }
            else
            {
                tmp->next = list2;
                list2 = list2->next;
            }
            tmp = tmp->next;
        }
        if (list1 == nullptr)
            tmp->next = list2;
        else
            tmp->next = list1;

        // tmp->next = list1 == nullptr ? list2 : list1;

        return head->next;
    }
};
```

### 题解2递归：

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        if (list1 == nullptr)
            return list2;
        if (list2 == nullptr)
            return list1;
        
        if (list1->val <= list2->val)
        {
            list1->next = mergeTwoLists(list1->next, list2);
            return list1;
        }
        else
        {
            list2->next = mergeTwoLists(list1, list2->next);
            return list2;
        }
    }
};
```

## 203.移除链表元素（简单题）

给你一个链表的头节点 `head` 和一个整数 `val` ，请你删除链表中所有满足 `Node.val == val` 的节点，并返回 **新的头节点** 。

示例1：

![image-20230327142205903](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202303271422935.png)

```
输入：head = [1,2,6,3,4,5,6], val = 6
输出：[1,2,3,4,5]
```

示例2：

```
输入：head = [], val = 1
输出：[]
```

示例3：

```
输入：head = [7,7,7,7], val = 7
输出：[]
```

**提示：**

- 列表中的节点数目在范围 `[0, 104]` 内
- `1 <= Node.val <= 50`
- `0 <= val <= 50`

### 题解1（暴力）：

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        ListNode *res = new ListNode(-1, head);
        ListNode * tmp = res;
        while(nullptr != tmp->next)
        {
            if (val == tmp->next->val)
            {
                tmp->next = tmp->next->next;
                
            }
            else
            {
                tmp = tmp->next;
            }
        }
        return res->next;
    }
};
```

题解2（递归）：

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        if (head == nullptr) {
            return head;
        }
        head->next = removeElements(head->next, val);
        return head->val == val ? head->next : head;
    }
};
```

## 206.反转链表（简单题）

给你单链表的头节点 `head` ，请你反转链表，并返回反转后的链表。

示例1：

![image-20230328111004827](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202303281110924.png)

```
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

示例2：

![image-20230328111036202](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202303281110234.png)

```
输入：head = [1,2]
输出：[2,1]
```

示例3：

```
输入：head = []
输出：[]
```

**提示：**

- 链表中节点的数目范围是 `[0, 5000]`
- `-5000 <= Node.val <= 5000`

### 题解1，原地算法：

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if (head == nullptr || head->next == nullptr)
            return head;
        ListNode * L = new ListNode(0, head);
        ListNode * beg = L->next;
        ListNode * end = L->next->next;

        while(end)
        {
            beg->next = end->next;
            end->next = L->next;
            L->next = end;
            end = beg->next;
        }

        return L->next;
    }
};
```

### 题解2，递归：

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if (head == nullptr || head->next == nullptr)
            return head;
        ListNode *newHead = reverseList(head->next);
        head->next->next = head;
        head->next = nullptr;
           /*
            第一轮出栈，head为5，head.next为空，返回5
            第二轮出栈，head为4，head.next为5，执行head.next.next=head也就是5.next=4，
                      把当前节点的子节点的子节点指向当前节点
                      此时链表为1->2->3->4<->5，由于4与5互相指向，所以此处要断开4.next=null
                      此时链表为1->2->3->4<-5
                      返回节点5
            第三轮出栈，head为3，head.next为4，执行head.next.next=head也就是4.next=3，
                      此时链表为1->2->3<->4<-5，由于3与4互相指向，所以此处要断开3.next=null
                      此时链表为1->2->3<-4<-5
                      返回节点5
            第四轮出栈，head为2，head.next为3，执行head.next.next=head也就是3.next=2，
                      此时链表为1->2<->3<-4<-5，由于2与3互相指向，所以此处要断开2.next=null
                      此时链表为1->2<-3<-4<-5
                      返回节点5
            第五轮出栈，head为1，head.next为2，执行head.next.next=head也就是2.next=1，
                      此时链表为1<->2<-3<-4<-5，由于1与2互相指向，所以此处要断开1.next=null
                      此时链表为1<-2<-3<-4<-5
                      返回节点5
            出栈完成，最终头节点5->4->3->2->1
         */
        
        return newHead;     
};
```

### 题解3，枚举：

![img](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202303281352080.gif)

```C++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
		if (head == nullptr || head->next == nullptr)
            return haed;
        ListNode * cur = nullptr;
        ListNode * pre = head;
        while(cur != nullptr)
        {
            ListNode *tmp = pre->next;	//临时保存 pre 的 下一节点
            pre->next = cur;	// 指向掉头
            cur = pre;	// cur 移动一个位置
            pre = tmp;	// pre 移动一个位置
        }
        return cur;
    }
};
```

## 83.删除排序链表中的重复元素（简单题）

给定一个已排序的链表的头 `head` ， *删除所有重复的元素，使每个元素只出现一次* 。返回 *已排序的链表* 。

示例1：

![image-20230328145529615](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202303281455651.png)



```
输入：head = [1,1,2]
输出：[1,2]
```

示例2：

![image-20230328145559080](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202303281455113.png)

```
输入：head = [1,1,2,3,3]
输出：[1,2,3]
```

**提示：**

- 链表中节点数目在范围 `[0, 300]` 内
- `-100 <= Node.val <= 100`
- 题目数据保证链表已经按升序 **排列**

### 题解1，两个for循环 暴力破解：

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        if(head == nullptr || head->next == nullptr)
            return head;

        for (ListNode *index = head; index != nullptr; index = index->next)
        {
            for (ListNode * index2 = index->next; index2 != nullptr; index2 = index2->next)
            {
                if (index->val == index2->val)
                {
                    index->next = index2->next;
                }
                else
                    break;
            
            }
        }
        return head;
    }
};
```

### 题解2，一层while循环 枚举：

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        ListNode *ptr = head;
        while(ptr && ptr->next)
        {
            if (ptr->val == ptr->next->val)
            {
                ListNode *del = ptr->next;
                ptr->next = del->next;
                delete(del);
            }
            else
                ptr = ptr->next;
        }
        return head;
    }
};
```

### 题解3，递归：

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        if (head == nullptr || head->next == nullptr)
            return head;
        head->next = deleteDuplicates(head->next);

        if (head->val == head->next->val)
            head->next = head->next->next;
        return head;
    }
};
```

## 20.有效的括号（简单题）

给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s` ，判断字符串是否有效。

有效字符串需满足：

1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。

示例1：

```
输入：s = "()"
输出：true
```

示例2：

```
输入：s = "()[]{}"
输出：true
```

示例3：

```
输入：s = "(]"
输出：false
```

**提示：**

- `1 <= s.length <= 104`
- `s` 仅由括号 `'()[]{}'` 组成

### 题解（栈）：

```c++
class Solution {
public:
    bool isValid(string s) {
        if (s.length() % 2 == 1)
            return false;
        unordered_map<char, char> pair = {
            {')', '('},
            {']', '['},
            {'}', '{'}
        };
        stack<char> stack;
        for (auto index : s)
        {
            if (pair.count(index))
            {
                if (stack.empty() || stack.top() != pair[index])
                    return false;
                stack.pop();
            }
            else
             stack.push(index);
        }

        return stack.empty();
    }
};
```

## 232.用栈实现队列（简单）

请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作（`push`、`pop`、`peek`、`empty`）：

实现 `MyQueue` 类：

- `void push(int x)` 将元素 `x` 推到队列的末尾
- `int pop()` 从队列的开头移除并返回元素
- `int peek() `返回队列开头的元素
- `boolean empty()` 如果队列为空，返回 `true` ；否则，返回 `false`

**说明**

- 你 **只能** 使用标准的栈操作 —— 也就是只有 `push to top`, `peek/pop from top`, `size`, 和 `is empty` 操作是合法的
- 你所使用的语言也许不支持栈。你可以使用 `list` 或者 `deque`（双端队列）来模拟一个栈，只要是标准的栈操作即可。

示例1：

```
输入：
["MyQueue", "push", "push", "peek", "pop", "empty"]
[[], [1], [2], [], [], []]
输出：
[null, null, null, 1, 1, false]

解释：
MyQueue myQueue = new MyQueue();
myQueue.push(1); // queue is: [1]
myQueue.push(2); // queue is: [1, 2] (leftmost is front of the queue)
myQueue.peek(); // return 1
myQueue.pop(); // return 1, queue is [2]
myQueue.empty(); // return false
```

**提示**

- `1 <= x <= 9`
- 最多调用 `100` 次 `push`、`pop`、`peek` 和 `empty`
- 假设所有操作都是有效的 （例如，一个空的队列不会调用 `pop` 或者 `peek` 操作）

### 题解：

```c++
class MyQueue {
    private:
        stack<int> inStack, outStack;
        void InToOut()
        {
            while (!inStack.empty())
            {
                outStack.push(inStack.top());
                inStack.pop();
            }
        }
public:
    MyQueue() {

    }
    
    void push(int x) {
        inStack.push(x);
    }
    
    int pop() {
        if (outStack.empty())
            InToOut();
        int x = outStack.top();
        outStack.pop();
        return x;
    }
    
    int peek() {
        if (outStack.empty())
            InToOut();
        return outStack.top();
    }
    
    bool empty() {
        return inStack.empty() && outStack.empty();
    }
};

/**
 * Your MyQueue object will be instantiated and called as such:
 * MyQueue* obj = new MyQueue();
 * obj->push(x);
 * int param_2 = obj->pop();
 * int param_3 = obj->peek();
 * bool param_4 = obj->empty();
 */
```
