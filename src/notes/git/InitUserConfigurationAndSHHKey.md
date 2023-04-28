---
title: git
category:
  - git
tag: 
  - git
  - github
editLink: false   # 不允许编辑页面
date: 2023-04-27
---

# GIT 初始化用户配置SSH秘钥

1. 设置用户名和邮箱

   ```bash
   # 设置提交代码时的用户信息
   
   $ git config [--global] user.name "[name]"
   $ git config [--global] user.email "[email address]"
   ```

2. 配置`SSH`秘钥

   ```bash
    ssh-keygen -t rsa -C "XXXXXXX@12346.com"	//输入你自己的邮箱
    并练习回车三次
   ```

   ![image-20230427164322107](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202304271643175.png)

3. 前往生成的秘钥路径，复制`id_rsa.pub`(公钥)

   ```bash
   cd /c/User/Admin/.ssh/
   cat id_rsa.pub
   ```

   ![image-20230427164750804](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202304271647898.png)

4. 打开自己`github`仓库，点击右上角头像下的`settings`按钮，选择`SSH and GPG keys` 点击`New SSH key` 按钮

   ![image-20230427165644522](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202304271656582.png)

5. 把之前复制的`id_rsa.pub`复制到`key`中 `Title`自己取名就好

   ![image-20230427174531113](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202304271745147.png)

6. 点击 `Add SHH key` 按钮

7. 完成

