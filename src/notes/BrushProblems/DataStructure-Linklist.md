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

