# 注册aws服务器

[[toc]]

## 获取服务器

### 注册账号

### 创建实例

设置默认语言、地区

[![ppULNyq.md.jpg](https://s1.ax1x.com/2023/03/21/ppULNyq.md.jpg)](https://imgse.com/i/ppULNyq)

控制台进入 ec2

[![ppULYSs.md.png](https://s1.ax1x.com/2023/03/21/ppULYSs.md.png)](https://imgse.com/i/ppULYSs)

新增密钥对

（公钥在服务器，私钥保存到本地，后续用于登录服务器，建议选用 pem 格式）
[![ppUOfvn.md.png](https://s1.ax1x.com/2023/03/21/ppUOfvn.md.png)](https://imgse.com/i/ppUOfvn)

创建实例

[![ppUL0TU.md.jpg](https://s1.ax1x.com/2023/03/21/ppUL0TU.md.jpg)](https://imgse.com/i/ppUL0TU)
[![ppUL8YQ.md.jpg](https://s1.ax1x.com/2023/03/21/ppUL8YQ.md.jpg)](https://imgse.com/i/ppUL8YQ)
[![ppULtln.md.png](https://s1.ax1x.com/2023/03/21/ppULtln.md.png)](https://imgse.com/i/ppULtln)

关联弹性 IP

先分配一个弹性 IP，在把实例 id 和弹性 IP 关联起来
[![ppULQw8.md.jpg](https://s1.ax1x.com/2023/03/21/ppULQw8.md.jpg)](https://imgse.com/i/ppULQw8)
[![ppULlTS.md.jpg](https://s1.ax1x.com/2023/03/21/ppULlTS.md.jpg)](https://imgse.com/i/ppULlTS)

设置安全组

[![ppUO5D0.md.png](https://s1.ax1x.com/2023/03/21/ppUO5D0.md.png)](https://imgse.com/i/ppUO5D0)

## ssh 连接服务器

### cmd 连接

cd 到私钥目录

```shell
ssh -i "awskey20230325.pem" ec2-user@ec2-18-163-105-12.ap-east-1.compute.amazonaws.com
```

### electerm pem 密钥连接（推荐使用）

## 设置 root 密码

### 创建 root 密码

```shell
soudo passwd root
```

### 切换 root 用户

```shell
su root
```

### 修改 sshd_config 文件

```shell
vim /etc/ssh/sshd_config
```

修改

```shell
PasswordAuthentication yes
permitRootLogin yes
esc 输入:wq 保存
```

### 重启 sshd 服务

```shell
// 查看是否启动
systemctl status sshd.service
// 启动
systemctl start sshd.service
// 重启
systemctl restart sshd
```
