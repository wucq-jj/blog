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

# `github` 推送失败 fatal: User canceled device code authentication remote: Support for password authentication was removed on August 13, 2021

推送本地仓库到`github`，输入账号密码，失败

![image-20230427174741087](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202304271747127.png)

经过百度得知：是因为自从 21 年 8 月 13 后不再支持用户名密码的方式验证了，需要创建个人访问令牌`(personal access token)`。
解决办法如下:
在 `github` 上生成令牌，应用于所需的仓库中

1. 登录`github`点击右上角头像下的`settings`按钮，点击左侧`Developer settings` 按钮

   ![image-20230427175314080](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202304271753146.png)

2. 点击`Personal access tokens` 下的`Tokens(classic)`按钮，之后点击右侧的`Generate new token`下的`Generate new token (classic)按钮`

   ![image-20230427180301036](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202304271803096.png)

3. Note 自己填写，`Expiration` 建议选择`No expiration` 永久不过期 ，但是会有风险，下面所有的都勾选

   ![image-20230427180227808](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202304271802856.png)

4. 点击`Generate token` 按钮生成`token`

   ![image-20230427180514066](https://wucq-jj-blog-resources.oss-cn-hangzhou.aliyuncs.com/blog-img/202304271805090.png)

5. 生成之后再次推送，选取`token`方法登录 输入刚刚生成的`token`





