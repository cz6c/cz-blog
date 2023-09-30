# 宝塔面板使用

[[toc]]

## 安装宝塔

```shell
wget -O install.sh https://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh ed8484bec
```

安装成功后有面板地址，账号密码，浏览器访问后登录面板（注：在 aws 安全组中开放宝塔面板的端口）

应用市场安装插件 `pm2`、 `mysql`、 `nginx`

常用命令
```shell
# 查看端口使用情况
netstat -ntlp

# 查看所有进程
ps -ef

# 强制、尽快终止进程
kill -9 pid
```

## 部署web 配置 nginx

部署前端项目时，要先在宝塔网站上添加一个站点，并把站点的域名配置好

添加成功后会在 wwwroot 下创建对应项目目录，把前端项目打包后的文件放入到该目录中即可

修改 `nginx` 配置文件做反向代理，如下所示：

```
  server
    {
        listen       80;
        server_name  www.cz6hy9.top; #重点1,修改为主机名或域名
        rewrite ^(.*)$ https://$host$1 permanent; #将所有HTTP请求通过rewrite指令重定向到 HTTPS
        root /www/wwwroot/www.cz6hy9.top; #重点2,项目根路径，默认是nginx/html/
        index index.html index.htm;
        try_files $uri $uri.html $uri/ /index.html; #这里是多页面访问配置，解决404错误
    }

  # HTTPS 服务
  server
    {
        listen       443 ssl;
        server_name  www.cz6hy9.top; #重点1,修改为主机名或域名
        # ssl证书上传到 nginx.conf 同一目录下
        ssl_certificate      9534144_www.cz6hy9.top/rect.pem; #重点2,ssl证书
        ssl_certificate_key  9534144_www.cz6hy9.top/rect.key; #重点3,ssl证书key
 
        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  10m; #超时
 
        # 加密协议等等
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        # ssl_ciphers PROFILE=SYSTEM;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_prefer_server_ciphers on;
 
        root /www/wwwroot/www.cz6hy9.top; #重点4,项目根路径，默认是nginx/html/
        #根索引文件，也就是输入ip或域名后在浏览器访问的第一页面
        index index.html index.htm;
        try_files $uri $uri.html $uri/ /index.html;#这里是多页面访问配置，解决404错误
    }
```


## pm2 部署 experss

### 上传项目代码

在文件中上传项目代码 一般放在 www/wwwroot 目录下

[![ppaEC3q.md.png](https://s1.ax1x.com/2023/03/21/ppaEC3q.md.png)](https://imgse.com/i/ppaEC3q)

### 添加项目

1. cd到项目目录，安装项目依赖

```shell
npm install
```

2. 配置环境变量



3. 启动项目

```shell
# 启动测试环境
pm2 start ecosystem.config.js --env development

# 启动正式环境
pm2 start ecosystem.config.js --env production

# 脚本启动
pm2 start "npm run start"
```

::: warning pm2启动ts项目报错 ts-node 问题
[PM2][WARN] Applications cz-app not running, starting...
[PM2][ERROR] Error: Interpreter /www/server/nvm/versions/node/v16.18.1/lib/node_modules/pm2/node_modules/.bin/ts-node is NOT AVAILABLE in PATH. (type 'which /www/server/nvm/versions/node/v16.18.1/lib/node_modules/pm2/node_modules/.bin/ts-node' to double check.)
 ELIFECYCLE  Command failed with exit code 1.
:::

1. cd 到pm2目录下安装依赖 
2. npm install typescript ts-node
3. cd 回项目目录启动

常用命令

```shell
# 查看服务列表
pm2 ls

# 实时显示日志
pm2 logs

# 终端的实时仪表板
pm2 monit

# 查看单个项目详情
pm2 show app_name

# 重启
pm2 restart app_name

# 热重启
pm2 reload app_name

## 暂停
pm2 stop app_name

# 删除
pm2 delete app_name

# 切换环境变量
NODE_ENV=production pm2 restart app_name --update-env
```

### 添加数据库

添加完数据库，导入本地数据库文件到服务器

修改项目代码中链接数据库的代码（数据库名称，账号，密码等），默认端口为 3306

注：如果碰到添加不了数据库时，可修改 root 密码刷新页面后重新添加

[![ppaEivV.md.png](https://s1.ax1x.com/2023/03/21/ppaEivV.md.png)](https://imgse.com/i/ppaEivV)

### navicat premium 访问服务器数据库

[![ppaKiFS.md.png](https://s1.ax1x.com/2023/03/21/ppaKiFS.md.png)](https://imgse.com/i/ppaKiFS)

#### 出现 10060 连接问题：

1. `mysql -u root -p` 登录 mysql 输入密码
2. `SELECT host,user FROM mysql.user;` 查询用户允许访问状态
3. `GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'yuor_password' WITH GRANT OPTION;` 把 root 允许访问权限设置为全部 %
4. `flush privileges;` 更新权限表
5. `DELETE FROM `user` WHERE Host='10.155.123.55' AND User='kaka';` 删除时使用这个

#### 出现没有权限访问问题

[![p93gZPf.md.png](https://s1.ax1x.com/2023/04/30/p93gZPf.md.png)](https://imgse.com/i/p93gZPf)

### 跨域问题

>Access to XMLHttpRequest at 'http://35.76.99.97:9999/user/info' from origin 'http://35.76.99.97' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.

:::warning withCredentials 设置跨域访问时是否携带 cookie 等信息
`experss` 中使用 `cors` 中间件对跨域进行了处理，默认把 `Access-Control-Allow-Origin` 设置为 `*`

`withCredentials` 设置为 true 时， `Access-Control-Allow-Origin` 不能设置为 `*`，必须指定域名

可以把 `withCredentials` 设置为 false 解决，或者给`Access-Control-Allow-Origin` 指定域名
:::

