---
title: 数组
index: true
comment: false
icon: edit
editLink: false
date: 2023-03-23
pageview: true
Word: true
category:
  - 数据结构-数组
tag: 
  - 简单题

footer: 天行健，君子以自强不息；地势坤，君子以厚德载物
---


## 566. 重塑矩阵 (简单题)

在 MATLAB 中，有一个非常有用的函数 reshape ，它可以将一个 m x n 矩阵重塑为另一个大小不同（r x c）的新矩阵，但保留其原始数据。
给你一个由二维数组 mat 表示的 m x n 矩阵，以及两个正整数 r 和 c ，分别表示想要的重构的矩阵的行数和列数。重构后的矩阵需要将原始
矩阵的所有元素以相同的 行遍历顺序 填充。如果具有给定参数的 reshape 操作是可行且合理的，则输出新的重塑矩阵；否则，输出原始矩阵。

![image-20230323173407623](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202303231734705.png)

```
输入：mat = [[1,2],[3,4]], r = 1, c = 4
输出：[[1,2,3,4]]
```

![image-20230323173435026](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202303231734115.png)

```
输入：mat = [[1,2],[3,4]], r = 2, c = 4
输出：[[1,2],[3,4]]
```

### 题解：

```c++
class Solution {
public:
    vector<vector<int>> matrixReshape(vector<vector<int>>& mat, int r, int c) {
        int m = mat.size();
        int n = mat[0].size();
        if (m * n != r * c)
            return mat;	//判断是否符合
        vector<vector<int>> res(r, vector<int>(c));
        for (int i = 0; i < m * n; i++)
            res[i/c][i%c] = mat[i/n][i%n];	//一次遍历 把符合的都放入
        return res;
    }
};
```

