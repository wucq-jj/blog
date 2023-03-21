# 	工作笔记

## gateway-server

### 2021-11-25

websocket保活机制联调成功 但出现一个小BUG 一次发了两条PING[^于2021-11-26解决]

### 2021-11-26

1. 解决一次发两条PING的BUG
2. websocket保活机制增加到gateway-server代码上[^以联调通过]
3. 包过滤 已完成提取出对应的IP 端口 协议 每日有效时间 和天数
3. 

### 2021-11-29

1. 增加连接检测函数

   ```c
   bool testAccess(char *ip, int port, char *protocol, char *timeStart, char *timeStop, int *days, int days_len, struct linkList *head);
   ```

2. 对初版连接检测函数进行优化 形成最终版

   ```c
   bool testAccess(char *ip, int port, char *protocol, char *currentTime, int currenDays, struct linkList *head);
   ```

3. 进行函数的单元自测，自测通过

### 2021-11-30

1. 增加获取当前小时和分钟函数

   ```c
   char *getCurrentTimeHourMinute();
   ```

2. 增加获取当前是星期几的函数

   ```c
   int getCurrentTimeWeekday();								
   ```

## 2021-12


### 2021-12-2

1. 增加删除函数

   ```c
   void linkListDeleteAccordToIp(struct linkList *head, const char *ip);
   void linkListDeleteAccordToPort(struct linkList *head, int port);
   void linkListDeleteAccordToProtocol(struct linkList *head, const char *protocol);
   ```

2. 增加打印函数

   ```C
   void linkListPrint(struct linkList *head);
   ```

3. 增加从string中解析策略

   ```C
   void parsePolicyFromString(struct linkList *head, const char *str);
   ```


### 2021-12-06

1. 交接狄柯工作 配置QT开发环境
2. 编写交接文档（目的：能够运行源码）

### 2021-12-07

1. 测试编译出包过滤dll
2. 添加包过滤代码 进行本地调试

### 2021-12-08

1. 修改获取本地时间函数（根据windows的API来获得）

   ```C
   /* 
    *获得当前小时和分钟 例如：23:59
    */
   char* getCurrentTimeHourAndMinute();
   
   /*
    *	获得当前星期数
    */
   int	getCurrentTimeDayOfWeek();
   ```

2. 包过滤测试成功 还差一个策略增加的时需要及时添加进链表（需要触发信号去做判断）

### 2021-12-09

1. 修改struct linkListApp结构体

   ```C
   修改后
   struct linkListApp {
   	char* protocol;
   	char* ip;
   	int port;
   };
   ```

2. 添加链表删除函数

   ```C
   /*
    *	删除除头结点以外的所有结点 
    */
   void linkListDeleteAll(struct linkList* head);
   ```

### 2021-12-10

1. 交接狄柯工作 配置S项目客户端开发环境
2. 编写交接文档（目的：能都编译 运行）

## 广汽项目

### 2021-12-13

1. 了解QT开发框架

   ```
   快捷键
   Ctrl + r  	运行
   Ctrl + b	编译
   Ctrl + /	注释
   Ctrl + f	查找
   Ctrl + enter	换行
   Ctrl + DEL	删除行
   Ctrl + shift + ↑/↓	整行移动
   Ctrl + i	自动对齐
   F4			切换头文件源文件
   F1			帮助文档
   
   ```

### 2021-12-14

1. 槽函数和信号可以重载，如果重载的话 需要用函数指针 指向目标函数 函数指针的作用域和槽函数或信号的作用域一致
1. 学习QT remote object 并成功编译通过demo

### 2021-12-15

1. 学习QT https 客户端知识 并尝试些demo

### 2021-12-16

1. win 编译openssl

### 2021-12-20

1. QT demo 能够简单post请求和get请求

### 2021-12-22

1. 客户端接口正常加密

   ```
   https post请求 接口加密统一为两段加密 加密后的数据为 密文1 + 密文2 （密文1后拼接密文2，拼接后的整体密文放在post请求的body中）
   密文1 由 明文1 加密而来
   密文2 由 明文2 加密而来
   
   明文1		{"random_number":"4321h4jdsdsdsd2h34j23h48j23","user_agent":"Huawei TAS-AN00,Anroid,10,Client,2.3.0","ts":"2020-01-02 23:00:00"}   
   明文1 字符串长度固定为128（包括 双引号 大括号 冒号 逗号） 
   明文1 数据构成为三个部分 random_number,user_agent和ts 三部分
   先说第二第三部分 
   第二部分 为真实的 user_agent 客户端的 user_agent 是什么就是什么（主要就是客户端的设备信息 是window 还是Linux 然后 Client的版本号什么的）
   第三部分 为时间戳 就是当前的时间 格式固定为 "2021-01-01 23:59:59" 类型
   再说第一部分
   因为明文1 要求长度固定为128，当128 - strlen("第二部分") - strlen("第三部分") 后 剩下的长度就是第一部分整体长度 第一部分的格式为"random_number":"XXXXXXXXXXXX" ,所以 要求 strlen("第一部分") == 之前算的剩下长度，就要往random_number的值中添加随机数 以达到长度相等 
   所以就得到了明文1 且固定字符串长度为128
   
   接下来对明文1 要进行加密 
   自己用一个随机的 user_agent 进行sha256后，得出秘钥，再用该秘钥对明文1 进行加密 就得出密文1   随机的UA 要放在http请求头中
   xhsaofdhASH-asdn+dsnkdAA
   
   
   
   ```
   
2. 客户端特殊接口加密   登录接口加密 /api/v2/auth/login

   ```
   特殊的接口加密 有登录客户端系统接口 激活用户接口 更新和重置用户信息 虚假的UA要放在https请求头里
   举例 ：登录客户端系统接口 /api/v2/auth/login
   密文1 和普通接口的密文1 一样
   密文2 有两部分组成 {
       "ed1":"user_name",
       "ed2":{
              "user_name":"登录用户名",
    "password":"登录密码_sha512 再调用StringToHex()",
              "usb_id":"设备标识",
   "serial_number":"U盘序列号",
              "ts":1612678221527
       }
   }
   ed1 部分 的值 用真实的user_agent进行sha256后得出秘钥 用秘钥加密 ed1 的值 得出密文 
   "ed1":"user_name"      -------------->           "ed1":"fweuifh1231ni_+QFF312"
   ed2 部分 的值 用sha512并StringToHex后的密文进行sha256 后得出秘钥 用秘钥进行加密 ed2 的值 得出密文
   
   "ed2":{"user_name":"登录用户名","password":"登录密码","usb_id":"设备标识","serial_number":"U盘序列号","ts":1612678221527}"                     ----------------->            ed2":"fjweioJOIINdqwoi+12joiUIN"
   
   
   
   整体消息再用真实的user_agent的sha256后进行加密
   {"ed1":"fweuifh1231ni_+QFF312", ed2":"fjweioJOIINdqwoi+12joiUIN"}  --------------------> fjwioefjioawefjiowe&&*HUIBIUHUIIh^&hudiq
   此时密文2 就完成
   整体密文 = 密文1 + 密文2
   
   ```
   

### 2021-12-23

1. 修改加密代码
2. 正在本地自测解密代码()

2021-12-24

1. 登录接口加密方式修改（**对笔记的描述也已经修改 详见2021-12-22**）
2. 对sandbox PC 客户端进行裁剪
2. 建立sandbox分支

### 2021-12-29

- 登录接口加密成功 能够成功返回正确密文
- 建立CarSafety 仓库

### 2021-12-30

- 4月阶段述职
- 裁剪激活接口

### 2021-12-31

- 激活接口调试成功 能够成功激活用户

  ```
  激活码的sha512_256 后 作为加密ed2的秘钥 在初始化的时候要传入激活码
  ```

  

# 2022

## 2022-01

### 2022-01-04

- 判断是否需要激活接口 调试成功 

  ```c++
  接口：/api/v2/auth/check
  int IsActive(const __USBData &str_usb_data,
                           __HttpsCommData &pcommdata);
  int ParseisActiveData(const sParseNetReturnValueData &data,
                            __sUsbStateResultInfo m_usb_state_info);                     
  ```

- 用户激活接口 解析部分 调试成功

  ```c++
  /api/v2/user/activate
  
  int ParseUserActiveData(const sParseNetReturnValueData &data);
  ```

### 2022-01-05

- Web调试登录接口 获取JS发送的登录账号 密码 

- 添加函数 根据指定的Key 从Json字符串中获取value

  ```c++
  QString MainWindow::GetValueByKeyFromJsonString(const QString &json, const QString &key){
      QJsonDocument jsondocLoginInfo = QJsonDocument::fromJson(json.toLocal8Bit().data());
      QJsonObject jsonobjLoginInfo = jsondocLoginInfo.object();
  
      QJsonObject::iterator index = jsonobjLoginInfo.find(key);
      QString value = index.value().toString();
      return value;
  }
  ```

- Web调试用户激活接口 获取JS发送的激活码和账户

### 2022-01-06

- 添加登出接口 

  ```
  /api/v2/auth/logout
  
  int UserLogout(__HttpsCommData& pcommdata);
  
  int ParseLogoutData(const sParseNetReturnValueData &data);
  ```

- 调试登出接口 

### 2022-01-07

- 整理初版客户端exe所需库和依赖，使之能够运行

### 2022-01-08

- 调整登出按钮 使之与登出接口一致
- 编写签名接口

### 2022-01-10

- 调整获取哈希文件的方式，从web端获取文件地址变为QT自己获取文件地址

- 添加删除文件按钮对应的代码（但还需前端完善后调试）

- 添加打开文件所在文件夹对应的代码（但还需前端完善后调试）

- QString 转 const char *

  ```c++
  Qstring str = "helloworld";
  char *s;
  QByteArray ba = str.toLatin1(); 
  s = ba.data();
  
  toLatin1、toLocal8Bit都是QString转QByteArray的方法，Latin1代表ASCII，Local8Bit代表unicode。
  ```

### 2022-01-11

- 签名数据保存在客户端
- 串联流程

### 2022-01-12

- 

### 2022-01-19

- 添加签名失败的几个BUG
- 增加显示用户名
- 增加显示关于客户端信息
- 删除按钮就只删除记录 不删除签名后的本地文件

### 2022-01-20

- 添加记录上限 暂时被定死（下一版本做成用户设置）
- 调试界面

### 2022-01-21

- 解决重新登录有登出弹框残影BUG

- 解决解析登录数据缺少关键字BUG

- 出包 GAC_EE_SecureClient_V1.0.01_GQDZ_Win.exe

- 获取主板序列号

  ```
  CMD > WMIC BASEBOARD GET SERIALNUMBER
  SerialNumber 
  PGTXH0MCYCV2ZC
  
  
  
  ```

- 获得GUID

  ```
  CMD > WMIC CSPRODUCT GET UUID
  UUID
  7DBFA693-FE6E-D9B9-6C73-CE8676949500
  ```

### 2022-01-24

- 获取本机的GUID 和 SN

- 发现新增的Windows设备 在校验的时候存在问题 返回22000

-  /api/v2/user/check 设备校验的请求字段变更

  ```
  usb_id -> device_id
  ```

- UserLogin 用户登录的设备校验从设备中读取

- UserActive 用户激活的设备校验从设备中读取

-  /api/v2/user/activate设备校验的请求字段变更

  ```
  usb_id -> device_id
  ```

### 2022-01-25

- 协助后端 调试签名接口
- 编写多文件签名接口

### 2022-01-26

- 解决重登失败BUG
- 编写多文件接口 能够接受到数据

### 2022-01-27

- 完成多文件签名

## 2022-02

### 2022-02-09

- 修改弹窗提示，全部改为中文提示

- 修改错误码 登录相关的错误码41000~41999   签名相关错误码42000~42999

  ```
  	//登录错误码
  	//type 41001    系统错误
      //type 41002    登录失败    服务器返回空数据
      //type 41003    登录失败    解析服务器返回的数据失败
      //type 41004    登录失败    用户被禁用
      //type 41005    登录失败    用户未注册或未激活
      //type 41006    登录失败    密码错误
      //type 41007    登录失败    其他错误
      //type 41008    登录失败    连接超时
      
      
      //激活错误码
      //type 41101    激活失败    激活失败
      
      
      //签名错误码
      //type 42001    系统错误
      //type 42002    签名失败    签名文件数量超出上限
      //type 42003    签名失败    签名文件内容为空
      //type 42004    签名失败    签名文件的大小超出限制
      //type 42005    签名失败    数据加密失败
      //type 42006    签名失败    连接超时
      //type 42007    签名失败    从服务器获得数据为空
      //type 42008    签名失败    signed_data 为空
      //type 42009    签名失败    会话超时
      //type 42010    签名失败    其他错误 需要看ret
      //type 42101    打开失败    文件夹不存在 或者已经改名
      //type 42102    打开失败    文件不错在 或者文件路径已改名
  ```

  ```
  
  ```

  

### 2022-02-10

- 添加spdlog日志
- readAll() 方法调用后会清空原来数据 把原来的数据转移到所赋值的对象中

### 2022-02-11

- 

### 2022-02-14

- 增加设备不存在错误提示

- 增加设备禁用错误提示

  ```
  1. 发现一个BUG 账户A绑定设备1   账户B 在设备1上登录，没有返回值，没有错误提示，返回的数据为空
  2. 用户登录自己绑定的设备（该设备已被禁用）， 返回20000  返回的错误码不对  应该返回22002
  ```

- ```
  显示分支 git branch -a
  切换分支 git checkout 分支名
  ```

- 参与讨论 优化登录 用户激活 校验设备的错误码

- ```
  用remote object 实现win-29auth.exe 与 客户端通讯
  ```

### 2022-02-15

- 调试错误提示码
- 添加证书下载接口 待调试

### 2022-02-16

- 修改客户端流程 一上线就调用校验登录设备接口 判断当前设备状态
- 登录界面添加离线登录判断
- 增加配置文件设置 放在当前路径下

### 2022-02-17

- 编写离线登录逻辑

### 2022-02-18

- 离线登出逻辑完成
- 把离线登录逻辑单独从OnLogin摘出

### 2022-02-21

- 下载车端证书接口 待调试
- 下载客户端证书接口 待调试
- 校验客户端证书接口 待调试

### 2022-02-22

- 增加登录接口返回权限的修改

- 场景权限增加到配置文件中

- 梳理离线登录流程

- ```
  配置文件增加 最大离线错误次数 当前错误次数
  ```

- 待修改 删除配置文件中的设备信息

### 2022-02-23

- 离线场景调试完成
- 重写加密配置文件生成

### 2022-02-24

- 上午转正答辩
- 登录流程配置文件部分修改
- 加密配置文件全部替换完成
- 增加获取代签名的数据 待调试

### 2022-02-25

- 获取待签名的数据  调试成功
- 客户端证书校验

### 2022-02-28

- 校验车端证书校验 dll

## 2022-03

### 2022-03-01

- ```
  解决工作界面右上角点X关闭按钮 未用户登出的接口 BUG
  ```

- ```
  解决登录界面右上角点击X关闭按钮 关闭程序 BUG 
  ```

- 

### 2022-03-02

- ```
  解决Windows程序不允许多个程序多开的 BUG
  ```

### 2022-03-03

- 开始写29认证

### 2022-03-04

- 29认证回调函数

### 2022-03-05

- ```
  客户端和29dll 通讯机制
  
  29		----->>>>		client
  1.获取ClientDataToSign
  	{"type":1}
  	
  2.获取CarDataToSign
  	{"type":2}
  	
  3.获取ClientSignatureAndClientCert
  	{"type":3,"ClientDataToSign":"XXXXXXXXXXX"}
  	
  4.获取检验车端证书结果
  	{"type":4, "DataToSign":"XXXXXXXXXXXXX","Signature":"XXXXXXXXXXXXXX","CarCert":"XXXXXXXXXXX"}
  
  
  29		<<<<--------	client
  
  1.发送DataToSign
  	{
  		"type":1,
  		"data":{
  					"result":0,		// 0 成功 -1 失败
  					"ClientDataToSign":"XXXXXXXXXX"
  				}
  	}
  	
  2.发送CarDataToSign
  	{
  		“type”:2,
  		"data":{
  					"result":0,
  					"CarDataToSign":"XXXXXXXX"
  				}
  	}
  	
  3.发送ClientSignatureAndClientCert
  	{
  		“type”:3,
  		"data":{
  					"result":0,			// 非0  失败 无cert 无Signature
  					"ClientCert":"XXXXXXXXXXXXX"
  					“Signature”:"XXXXXXXXXXXXXXXXXXX"
  				}
  	}
  	
  4.发送车端证书校验结果
  	{
  		"type":4
  		"data":{
  					"result":0			//0成功 -1 失败
  				}	
  	}
  	
  ```

- 

### 2022-03-07

- 继续完善29Demo
- 修改第二次登陆客户端 崩溃BUG
- 增加VMware虚拟机win10适配

### 2022-03-08

- 修改digest 文件内容太小BUG
- 修改离线登录流程 离线登录点击登录在判断一次是否能连接上服务器
- 测试V1.0.02.01版本

### 2022-03-09

- 发版V1.0.02.1

### 2022-03-10

- 编写win29auth demo

### 2022-03-11

- 完成win29auth demo  的verify car

### 2022-03-12

- 完善win29auth demo 
- 完善场景2

### 2022-03-14

- 场景2 增加初始化状态 
- 场景1 增加软件包数据加密接口
- 离线最大错误登录次数改为5次

### 2022-03-15

- 场景1 增加分割文件

### 2022-03-16

- 修改离线登录 未修改成功登录次数的BUG
- 修改离线登录 点击关闭按钮未杀死程序
- 场景1分割文件签名功能 50%

### 2022-03-17

- 场景1软件包升价签名完善

### 2022-03-18

- 发版V1.0.03

### 2022-03-21

- 新增车端指令下载接口
- 删除 一打开客户端就登录设备功能
- 新增场景3功能 在线登录 且有场景3权限就会自动下载车端指令

### 2022-03-22

- 新增设置URL 和 PORT
- 增加软件升级包签名提示文件弹窗
- 增加hash文件签名提示文件弹窗

### 2022-03-23

- 

### 2022-03-24

### 2022-03-25

### 2022-03-28

- 修复BUG 登出未初始化29状态

### 2022-03-29

### 2022-03-30

### 2022-03-31

- 场景3功能开发
- 客户端win7不适配问题排查

## 2022-04

### 2022-04-01

- 修复BUG 更换设备 配置文件更新
- 场景3功能完善

### 2022-04-02

- 场景3 增加连接状态
- 离线车端证书校验存在问题 已解决
- 发版

### 2022-04-06

- 两种方法获取PC   sn 和 guid 工具
- 配置文件加密存储
- 场景3 增加证书 设为wss 连接

### 2022-04-07

- 增加用姓名+ 密码 登录接口
- 修改未配置HOST 和 URL 用户激活弹窗提示错误问题
- 增加秘钥协商接口
- NSIS 打包工具学习

### 2022-04-08

- 软件升级包加密接口 上传数据最大限制在10MB 超过10MB取消上传
- 小于1MB的软件升级包 不做文件分割（代实现）
- 点击激活做一个秘钥协商 协商成功用秘钥去做用户激活加密 登录也用秘钥加密  判断秘钥是否存在 才决定秘钥是否再次请求   放在一个新的类里面 秘钥协商类

### 2022-04-11

- 给GAC的客户版本 去除姓名+用户名登录 + 29demo
- 软件升级包加密接口 超时设置60S
- 29demo程序适配win7
- 29demo 修复BUG 启动再关闭29服务程序崩溃
- 新增秘钥协商接口
- 发现BUG 往配置文件中存中文 读取显示乱码
- 29demo 需要增加校验客户端证书

### 2022-04-12

- 中文名字存入config BUG 定位

### 2022-04-14

- 修改秘钥协商接口 调试通过
- 发现中文写入配置文件失败问题原因 加密传入长度不正确
- 用共享秘钥调试登录接口 （秘钥协商）
- 解决登录失败，激活失败清空共享秘钥问题

### 2022-04-15

- 修复登录失败 和 激活失败 未删除共享秘钥BUG
- 调试用户激活接口
- 调试登出接口
- 22005错误码添加

### 2022-04-18

- 待实现：小于1MB数据的软件升级包加密
- 待实现：29demo 增加校验客户端证书 并把结果返回给客户端
- 编写广汽客户端接口设计文档

### 2022-04-19

- 实现小于1MB数据的软件升级包签名

- 修改秘钥协商接口

  ```
  旧接口
  {
  "key":"WjavLR/tN1aYM8O7g6hADoEHwYInAEtsaAaRoGuF7nNG84hZo9QjvpvsfkmfqRQaaUakaVTuhMGK2WolRdyNBEjCYSTRfB8yLq5Or",
  "device_id":"83f4d1f54578c49f9d928e800836d7f417b457797567ec5a57c06b3a52720ad060e7a9631ab3ec117e5bccefdaa8be9943841a13da40c1fb52fc3586d7dadd63",
  "ts":1612678221527
  }
  
  新接口
  {
  "key":"WjavLR/tN1aYM8O7g6hADoEHwYInAEtsaAaRoGuF7nNG84hZo9QjvpvsfkmfqRQaaUakaVTuhMGK2WolRdyNBEjCYSTRfB8yLq5Or",
  "device_id":"83f4d1f54578c49f9d928e800836d7f417b457797567ec5a57c06b3a52720ad060e7a9631ab3ec117e5bccefdaa8be9943841a13da40c1fb52fc3586d7dadd63",
  “signature”:”WjavLR/tN1aYM8O7g6hADoEHwYInAEtsaAaRoGuF7nNG84hZo9QjvpvsfkmfqRQaaUakaVTuhMGK2WolRdyNBEjCYSTRfB8yLq5Or”,
  “client_cert”:”WjavLR12312fwefhtyr5234gsrojoi32NION4nio2j423noiUNOIHwYInAEtsaAaRoGuF7nNG84hZo9QjvpvsfkmfqRQaaUakaVTuhMGK2WolRdyNBEjCYSTRfB8yLq5Or”,
  "ts":1612678221527
  }
  
  ```

- 待实现 更改登录流程  

  ```
  先秘钥协商 在校验登录设备 再登录或激活
  ```

### 2022-04-20

- 解决小于1MB软件升级包签名问题
- 登录流程修改完成

### 2022-04-21

- 29demo 增加校验客户端证书 并把结果返回给客户端
- 解决BUG 车端指令记录一次上传多条

### 2022-04-22

- 用第三方证书调试客户端场景

### 2022-04-24

- 学习整理Qwebsocket 
- 制作Qwebsocket demo

### 2022-04-25

- 发版V1.0.06
- 发现BUG  软件升级包签名如果存在同名的文件夹 签名失败

### 2022-04-26

- 解决 软件升级包签名如果存在同名的文件夹 签名失败 BUG

### 2022-04-27

- 优化软件升级包签名  文件操作放在线程中

### 2022-04-28

- 优化登出流程
- 修复BUG 未连接车端执行命令客户端卡死
- 更新签名工具   <u>**待完成**</u>
- 修改场景一签名返回值
- 客户端点击连接VIN 还有问题  <u>**待完成**</u>

### 2022-04-29

- 软件升级包签名 流程更改完毕
- 多hash文件签名 流程更改完毕
- 验签工具 验签功能完成，还原功能暂未完成

## 2022-05

### 2022-05-05

- 验签工具完善

### 2022-05-06

- 

### 2022-05-07

- 发现问题，如果解密秘钥长度小于等于12，则解密失败，但是加密时未有此问题 

### 2022-06-13

- websocket 心跳机制开发 待调试

### 2022-06-14

- 场景1 新增签名证书下载接口 调试通过
- WinSign 类添加 用于场景1签名的三种功能

### 2022-06-15

- WinSign 类开发

### 2022-06-16

- WinSign 类开发
- 客户端心跳机制优化 新增60生命秒定时器，如果60秒未成功连接上 就提示登出客户端

### 2022-06-17

- 客户端接口设计文档更新
- 发版V1.0.09
- WinSign 开发

### 2022-06-20

- dev 合并到 master

- ```
  git 合并 命令
  git checkout master
  git merge dev
  git push	//将本地的 master 上传到代码服务器上
  ```

- 开会 再次梳理场景1 l流程

- win 封装场景1 加解密接口

### 2022-06-21

- 切片加密开发

### 2022-06-22

- 切片加密开发

### 2022-06-23

- 切片加密开发
- 客户端依赖库安装包 

### 2022-06-24

- 

### 2022-06-25

- 

### 2022-06-27

- 

### 2022-06-28

- 

### 2022-06-29

- 客户端场景1 流程开发 能跑通流程

### 2022-06-30

- 客户端登录界面关于界面更新

## 2022-07

### 2022-07-01

- 发版V1.0.10 
- 修复本地 hash 失败 未退出loading 界面的问题

### 2022-07-04

- 还原工具开发 
- 发现一个问题 unsigned char * 转 QString 数据丢失

### 2022-07-05

- 客户端证书验证接口 增加 code 20000 判断
- 讨论问题
- 验签工具文件解密功能完成

### 2022-07-06

- 客户端验签工具开发

### 2022-07-07

- 客户端验签工具开发完成
- 修复一个BUG

### 2022-07-08

- 控制台查看 10.7.111.12

  ```
  1. sudo -i   密码 111111
  2. cd /media/dev/cbbc89e0-feed-4bce-ba35-3f01852d4fc7/docker_dedicated/console/default_sh
  3. docker-compose exec console_server_sh bash
  4. cd /var/log/supervisor/
  5. 异常日志   tail -f general_user-stderr---supervisor-vCqUfj.log
  6. 普通日志   tail -f general_user-stdout---supervisor-avPSGi.log
  ```

- 客户端 用户登出时 退出

### 2022-07-12

- 场景3 ADB 超时 websocket不关闭

### 2022-07-13

- 验签工具新增提示
- ADB开发

### 2022-07-14

- ```
  websocket -> worktab
  IDC 正常打开成功
  {type : IDC_OPEN, code : 10000}
  {type : IDC_OPEN, code : 20000} 失败
  {type : IDC_OPEN, code : 30000} 超时
  ```



### 2022-07-25

- 客户端 ADB开启 按钮 去除判断ADB已开启的功能

- 客户端 ADB 更新数据 去除判断ADB未开启的功能

- 修复ADB 批量关闭第二个的时候 发给服务端数据还是第一个的BUG  原因是 数据未清除

  ```js
  //虚拟机 C:\Users\sysdev\Desktop\dev\GACClient\gac-client\src\win-client\Resources\launcher\work_table\table.js
  
   else if (confirmMsg.type == "deleteADBOpen") {
          // checkedADBOpens这个数组里面包含的就是要关闭的ADB数组数据
  //        ifShowLoading(true)
          let item = {
              type : "deleteADBOpen",
              checkedADBOpens
          };
  
          sendMessage(JSON.stringify(item));
          checkedADBOpens = [];
          closeModal();
      }
  ```

### 2022-07-26

- 模拟29程序 开发 

  ```
  实现命令行方式打开客户端 并传入参数(用QT的方法)
  ```

- 客户端 支持29程序 离线方式启动

### 2022-07-27

- 模拟29程序开发

  ```
  实现命令行方式打开客户端 并传入参数(用windows api 的方法)
  ```

- 客户端 支持29程序 离线方式启动

### 2022-07-28

- 场景3 ADB需求讨论 

  ```
  1. ADB关闭界面 需要增加分页
  2. 新增ADB关闭结果界面 记录最近一次批量关闭的结果（关闭失败  关闭成功）
  ```

- 29程序启动客户端 登录报错时 关闭客户端程序

## 2022-08

### 2022-08-01

- 场景2 29程序启动成功后需要打开界面
- 场景3 ADB开启界面更改 增加两个字段  VIN SN
- 场景2 29程序离线登录开发完成

### 2022-08-02

- 场景3 ADB开启错误三次 一分钟禁止开启
- ADB开启接口 修改
- 客户端界面有BUG
- 离线模式启动完成

### 2022-08-03

- 获取特殊用户信息接口开发

- 联调获取特殊用户信息接口 （未调通）

- 获取标准输出的方法有问题 

  ```
  问题：QT 窗体自带一个循环， 获取标准输出的方式是一个死循环， 这样一执行就会卡死
  解决方案：把循环放在线程里面去做
  ```

### 2022-08-04

- 验签工具把文件解密方法放在线程中进行操作
- ADB关闭 接口 和 查询接口修改 增加 sn 字段
- 模拟29程序启动客户端开发完成
- 发版V1.0.13
-  

### 2022-08-04

- 合并分支V1.0.13
- 优化登录程序 对29程序登录做适配



### 2022-08-15

- BUG 135547 修复

  ```
  原因：	29模拟程序(win_demo29auth.exe) 无法感知29服务的状态，在29服务关闭重启后，29模拟程序还是连接旧的29服务
  修改：	1. 29auth.dll 新增一个接口 用于接收是否连接29服务成功
  	  2. 模拟程序 新增两个按钮 用于控制连接与断开29服务
  验证版本 Version:v1.0.14
  
  提示： 当与29程序断开时，用户要主动点击 connect 按钮 进行连接
  ```


### 2022-08-16

- 29auth.dll 代码优化

### 2022-08-17

- 居家隔离

### 2022-08-18

- 居家隔离



### 2022-08-22

- 29-auth.dll 增加 QCoreApplication 主消息循环

- 修复客户端BUG 修改ADB关闭界面当前页个数 数据消失

  ```
  失败原因，获取当前页数据参数时，获取方法是toInt, 但是字段是String 类型 
  ```

  

### 2022-08-23

- 整理29动态库 和 29 可执行程序 文档

### 2022-08-24

- 发版V1.0.14
- 测试给广汽的定制版本

### 2022-08-25

- 学习C++Primer Plus

### 2022-08-26

- 修复29模拟启动程序运行卡死BUG

  ```
  登录一个设备不存在的账号，就出现卡死
  修复方法
  ```

### 2022-08-29

- 撰写专利文档

### 2022-08-30

- 撰写专利文档

### 2022-08-31

- 修复BUG 136912 

  ```
  BUG 原因 字符串存在单引号 ' 在调用JS方法时候，传入的字符串被截取到单引号了 ' 然后就报错了
  修改方法 增加转义   ' 变成  \'
  ```

- 修复BUG136924

  ```
  BUG 原因 从界面获取界面信息的页数类型转换错误  获取的是string 转的 是 int 
  修改方法 根据获取类型 智能判断
  ```

- 

### 2022-09-01

- 写专利

### 2022-09-02

- 发版本

### 2022-09-05

- 职级文档编写

### 2022-09-06

- 卸载程序删除保留我的数据按钮

- ADB更新数据 代码逻辑修改 

  ```
  从 追加的方法变为覆盖方法
  ```

- ADB批量关闭逻辑修改 待完成

### 2022-09-07

- ADB批量关闭逻辑修改完成

### 2022-09-08

- 修复点击改变ADB关闭结果界面的显示页数，ADB关闭界面被改变的错误
- 新增错误码 22010 22009

### 2022-09-09

- 卸载程序 删除保留我的数据选项，并调整布局
-  

### 2022-09-13

- ADB关闭和ADB关闭结果页面 问题（当前有11条数据，每页显示10条，在 第二页， 改变当前页的大小 为30， 结果界面为空）

  ```
  原因： 客户端在计算第二页数据时候， 计算结果为 0
  解决思路 2种 ： 一种是当前页显示数据为空 可以切换到上一页 （客户端实现）
  一种是自动更新当前是第几页， 重新设置当前为第几页 需要提供一个新的方法
  ```

### 2022-09-14

- 发版 V1.0.16

### 2022-09-15

- 准备第二篇专利文档

### 2022-09-19

- 修复BUG

### 2022-09-20

- 客户端界面调整

### 2022-09-21

- 优化登录客户端启动和登录成功流程，使界面资源加载动画消失
- 发现问题 离线登录 显示BUG
- 整理客户端手册

### 2022-09-22

- 整理客户端手册

### 2022-09-23

- 发版V1.0.17

- 会话断开弹窗点击关闭和取消都强制登出，返回登出界面

- ```
  问题：使用同事提供的弹窗取消和关闭捕获消息方法，但是发现程序崩溃了 查看日志发现一直有关闭弹窗的消息发送给客户端
  与同事一起，进行代码调试，一步一步打alert弹窗查看，发现关闭弹窗被调用了两次就崩溃了，开始排查为什么弹窗被调用了两次
  最后发现是客户端在收到会话断开消息的时候会清空场景1的数据并关闭弹窗，此时调用的关闭弹窗导致又发消息给客户端，然后消息进入死循环一直
  发送，最后崩溃。
  解决方法：客户端会话断开时不清空场景1数据，而是每次重新登录时初始化场景1数据
  ```

- 

### 2022-09-26

- 电脑固态硬盘掉了，导致系统坏了，重装电脑

### 2022-09-27

- 获取签名证书接口增加 增加 pri 字段，获取签名证书的私钥

### 2022-09-28

- 撰写专利

### 2022-09-29

- 完成第二批专利交底书

### 2022-10-08

- 联调场景1 国标签名

### 2022-10-09

- 验签工具 适配国标证书
- 安装ubuntu20.04
- 下载车端CA证书接口优化

### 2022-10-10

- 场景2 车端CA证书增加多个 **<u>联调通过</u>**

### 2022-10-11

- ```C
  vimrc 配置
  "	语法高亮
  set syntax=on
  "	显示行号
  set number
  "	去掉输入错误的提示音
  set noeb
  "	自动缩进
  set autoindent
  set cindent
  "统一缩进
  set tabstop=4
  set softtabstop=4
  set shiftwidth=4
  "	高亮
  set hlsearch
  
  
  "	打开上一次的地方
  au BufReadPost * if line("'\"") > 0|if line("'\"") <= line("$")|exe("norm '\"")|else|exe "norm $"|endif|endif
  
  ```

- 

### 2022-10-12

- ```C 
  模拟ADB关闭
  https://platform.demo:7000/api/v1/idc/close_adb_result
  {
      "vin":"gMLZMVS256u2aYv4",
      "mt":"89sW2",
      "close_status":1
  }
  
  1成功       2失败   
  
  ```

- ```
  模拟ADB开启
  wss://platform.demo:5000/api/v2/webSocketIDC/M0d3ZjhmakRlcXdvWUVPUTExODlzVzEy
  wss://platform.demo:5000/api/v2/webSocketIDC/(vin + mt 的base64值)
  // // 验证码申请
  
  // {
  //     "method_type":2,
  //     "vin":"3Gwf8fjDeqwoYEOQ11",
  //     "mt":"89sW12",
  //     "ts":"3421532453241234"
  // }
  
  //IDC回复开启结果：open_result 1成功，2失败
  {
          "method_type":3,
      "vin":"3Gwf8fjDeqwoYEOQ11",
      "mt":"89sW12",
      "open_result":1,
      "ts":"3421532453241234"
  }
  ```

### 2022-10-13

- 新增DecryptDataV2

### 2022-10-14

- 打包代码增加是否存在旧的客户端判断
- 注释打包代码开机自启动部分 

### 2022-10-17

- 看书

### 2022-10-18

- DES学习

### 2022-10-19

- 基于openssl EVP DES 算法封装

### 2022-10-20

- DES工具开发

### 2022-10-21

- DES工具开发

### 2022-10-24

- DES工具开发

### 2022-10-25

- 修复国标验签中文路径失败问题

  ```
  发现问题：测试提出BUG，发现国标证书用户带有中文字符签名后进行验签， 验签失败
  定位问题：进行一步一步排查定位，在定位到不是验签时中文名的问题，在命令行工具gmssl 能用带有中文路径的进行签名，就往签名之前的流程排查，发现在国标签名时，传输中文路径的字符串的转码方法为toStdString().c_str() 该方法用于传输中文有问题，后改为toLocal8Bit().data() 并增加上是否是国标证书判断，而后解决该问题
  ```

- 发版V1.0.20

### 2022-10-26

- 完成DES工具

### 2022-10-27

- 

### 2022-10-28

- 

### 2022-11-07

- 制作模拟IDC报文工具

### 2022-11-08

- Linux 配置 Nginx

  ```bash
  1 安装依赖库
  sudo apt-get install openssl libssl-dev
  
  sudo apt-get install libpcre3 libpcre3-dev
  
  sudo apt-get install zlib1g-dev
  
  sudo apt-get install gcc
  
  sudo apt-get install g++
  
  2.下载代码并解压
  cd ~
  wget http://nginx.org/download/nginx-1.21.6.tar.gz
  #解压
  tar -zxvf nginx-1.21.6.tar.gz
  #进入目录
  cd nginx-1.21.6
  
  3.安装配置
  ./configure --prefix=/usr/local/nginx --with-http_stub_status_module --without-http-cache --with-http_ssl_module --with-http_gzip_static_module --with-ipv6 
  
  4.编译安装
  make
  make install
  
  5.验证
  #进入nginx安装目录
  cd /usr/local/nginx
  #启动nginx
  ./sbin/nginx
  
  6.配置ipv6
  配置文件是./conf/nginx.conf
  nginx主程序是./sbin/nginx
  
  配置ipv6
  sudo vim ./conf/nginx.conf
  
  server{
  	listen 80;		
  	listen [::]:8081 ipv6only=on;			#自己指定ipv6地址
  }
  ####################
  #如果浏览器访问不了 说明防火墙端口未开放
  # ufw allow 80/tcp		输入配置的端口
  # ufw reload
  ####################
  参考 http://t.csdn.cn/oXR4d
  
  7.nginx 配置https
  参考 https://blog.csdn.net/lu_linux/article/details/92078658
  
  
  ```

  

- 创建ZhangQiYandemo windows 客户端

### 2022-11-09

- 摘除ZhangQiYandemo windows 客户端 中 GAC部分

### 2022-11-10

- ZhangQiYandemo windows 客户端开发

### 2022-11-11

- GAC 发版V1.0.21

### 2022-11-14

- 封装AES 加密算法
- 封装SM4 加密算法

### 2022-11-15

### 2022-11-16

- 设置IP PORT 下载地址完毕

### 2022-11-17

- 封装 加解密流程

### 2022-11-18

- 封装加解密流程 
- win 版本 ZhongQiYan 终止 采用Linux 命令行开发

### 2022-12-21

- --filelist 读取完毕





## 2023

### 2023-01-10

- ```
  邮箱地址：https://10.2.158.10/
  账号：wu_changquan
  密码：x-wcq1234qwer
  
  广汽代码仓库：https://10.6.6.5/
  账号：wu_changquan	
  密码：x-wcq123
  
  CRM：https://192.168.1.18/
  账号：吴昌泉14469
  密码：x-wcq12345
  ```

- gac 测试 29SDK 多次调用获取客户端证书和签名数据  没有问题

### 2023-01-11

- 整理29错误信息文档
- gac 客户端修改，29程序启动客户端不显示客户端程序界面
- gac 处理29在线启动客户端会话超时现象。

### 2023-01-13

- 早上外出到S项目地点
- zqy 项目非国标签名 增加 证书 和 私钥打印

### 2023-01-30

- zqy 项目 sign 工具 签名 增加 签名成功后的文件打印

### 2023-01-31

- 发现离线登录不上，原来是服务器创建的离线验证码是在未来时间 所以登录不上去
- 修改GetDeviceInfo 小工具 

### 2023-02-06

- 提供广汽最新客户端安装包







# GAC_EE_SecureClient_V1.0.01_GQDZ_Win

- 用户登录界面
- 用户激活界面
- 切换界面按钮 （来回切换登录界面和激活界面）
- 状态栏（V_1 版本不做）
- 记录的json要有唯一的ID标识

# GAC_EE_SecureClient_V1.0.02_GQDZ_Win

- 绑定设备功能




# GAC_EE_SecureClient_V1.0.03_GQDZ_Win

- 删除 一打开客户端就校验登录设备功能
- 新增场景3功能 在线登录 且有场景3权限就会自动下载车端指令
- 新增点击登录 和 校验 判断配置中有无设置URL 和 PORT
- 增加hash文件签名 和 软件升级包签名的提示按钮

# GAC_EE_SecureClient_V1.0.04_GQDZ_Win

# GAC_EE_SecureClient_V1.0.05_GQDZ_Win

- 离线登录只显示场景2
- 软件升级包签名需要增加loading界面
- 用户名+工号登录接口改变
- 数据加密采用秘钥协商加密方式
- demo3 中文乱码BUG

# GAC_EE_SecureClient_V1.0.06_GQDZ_Win

- 软件升级包小于1MB数据的签名
- 秘钥协商报文修改
- 登录激活流程更改 需要测试重新测试
- 29demo 把校验PC的结果返回给客户端
- 解决BUG 车端指令记录一次上传多条
- 三方证书调试场景1场景2

# GAC_EE_SecureClient_V1.0.07_GQDZ_Win

- 文件签名大小不能超过10GB
- 大文件操作放入线程
- 发现BUG  loading界面 未屏蔽按键事件
- 更新签名校验工具（还原功能未完成）

# GAC_EE_SecureClient_V1.0.09_GQDZ_Win

- 客户端增加心跳机制
- BUG修复

# GAC_EE_SecureClient_V1.0.10_GQDZ_Win

- 场景1 功能变动， 新增三种签名方式

# GAC_EE_SecureClient_V1.0.13_GQDZ_Win

- 配置文件 和 日志 路径修改 当前用户下的/GAC_Client/client.log  Client_Config.ini
- adb 开启增加 错误次数判断, adb 开启增加VIN SN 字段
- 模拟29程序启动客户端



# GAC_EE_SecureClient_V1.0.14_GQDZ_Win

- 模拟29程序启动客户端在线登录流程优化
- 场景3 ADB 模块 新增分页功能
- 场景3 ADB 模块 新增ADB关闭结果页面
- 

# GAC_EE_SecureClient_V1.0.15_GQDZ_Win

- 修复BUG 两个
- 优化29登录程序

# GAC_EE_SecureClient_V1.0.16_GQDZ_Win

- 控制台连接不上广汽时，进行签名 新增提示
- 场景3ADB 功能优化
- 建议恢复优化

# GAC_EE_SecureClient_V1.0.17_GQDZ_Win

- 客户端界面整体UI更新
- host 设置下拉默认选项框
- 修复BUG

# GAC_EE_SecureClient_V1.0.18_GQDZ_Win

- 预制域名 修改为广汽提供域名
- 场景1签名方式支持国标证书
- 验签工具适配国标证书
