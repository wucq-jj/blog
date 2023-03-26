---
title: 字符串
index: true
comment: false
icon: edit
editLink: false
date: 2023-03-26
pageview: true
Word: true
category:
  - 数据结构-字符串
tag: 
  - LeetCode
footer: 天行健，君子以自强不息；地势坤，君子以厚德载物

---





## 387.字符串中的第一个唯一字符（简单题）

给定一个字符串 `s` ，找到 *它的第一个不重复的字符，并返回它的索引* 。如果不存在，则返回 `-1` 。

```
示例1：
输入: s = "leetcode"
输出: 0
```

```
示例2：
输入: s = "loveleetcode"
输出: 2
```

```
示例3：
输入: s = "aabb"
输出: -1
```

**提示:**

- `1 <= s.length <= 105`
- `s` 只包含小写字母

### 题解：

```c++
class Solution {
public:
    int firstUniqChar(string s) {
        unordered_map<int, int> umap;
        for (auto i : s)
            umap[i]++;
        for (int i = 0; i < s.size(); i++)
            if (1 == umap[s[i]])
                return i;
        return -1;
    }
};
```



## 383.赎金信（简单题）

给你两个字符串：ransomNote 和 magazine ，判断 ransomNote 能不能由 magazine 里面的字符构成。

如果可以，返回 true ；否则返回 false 。

magazine 中的每个字符只能在 ransomNote 中使用一次。

 ```
 示例1：
 输入：ransomNote = "a", magazine = "b"
 输出：false
 ```

```
示例2：
输入：ransomNote = "aa", magazine = "ab"
输出：false
```

```
示例3:
输入：ransomNote = "aa", magazine = "aab"
输出：true
```

提示：

- 1 <= ransomNote.length, magazine.length <= 105
- ransomNote 和 magazine 由小写英文字母组成

### 题解1 暴力枚举：

```C++
class Solution {
public:
    bool canConstruct(string ransomNote, string magazine) {
        for (int i = 0; i < magazine.length(); i++)
        {
            for (int j = 0; j < ransomNote.length(); j++)
            {
                if (magazine[i] == ransomNote[j])
                {
                    ransomNote.erase(ransomNote.begin() + j);
                    break;
                }
            }   
        }

        if (ransomNote.length() == 0)
            return true;
        return false;
    }
};
```

### 题解2哈希法:

```c++
class Solution {
public:
    bool canConstruct(string ransomNote, string magazine) {
        int hash[26] = {0};

        for (int i = 0; i < magazine.length(); i++)
        {
            hash[magazine[i] - 'a']++;
        }

        for (int i = 0; i < ransomNote.length(); i++)
        {
            hash[ransomNote[i] - 'a']--;
            if (hash[ransomNote[i] - 'a'] < 0)
                return false;
        }
        return true;
    }
};
```



## 242.有效的字母异位词

给定两个字符串 `s` 和` t` ，编写一个函数来判断 `t` 是否是 `s` 的字母异位词。

注意：若 `s` 和 `t `中每个字符出现的次数都相同，则称 `t `和 `t` 互为字母异位词。

示例1：

```
输入: s = "anagram", t = "nagaram"
输出: true
```

示例2：

```
输入: s = "rat", t = "car"
输出: false
```

**提示:**

- `1 <= s.length, t.length <= 5 * 104`
- `s` 和 `t` 仅包含小写字母

### 题解：

```c++
class Solution {
public:
    bool isAnagram(string s, string t) {
        int i;
        int hash1[26] = {0};
        int hash2[26] = {0};

        for (i = 0; i < s.length(); i++)
            hash1[s[i] - 'a']++;
        for (i = 0; i < t.length(); i++)
            hash2[t[i] - 'a']++;

        for (i = 0; i < 26; i++)
            if (hash1[i] != hash2[i])
                return false;
        return true;
    }    
};

优化：
class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.length() != t.length())
            return false;
        int hash[26] = {0};

        for (int i = 0; i < s.length(); i++)
        {
            hash[s[i] - 'a']++;
            hash[t[i] - 'a']--;
        }
        for (int i = 0; i < 26; i++)
            if (0 != hash[i])
                return false;
        return true;
    }
    
};
```

