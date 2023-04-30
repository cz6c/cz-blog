# 宝塔使用

目录
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

        #charset koi8-r;
        #access_log  logs/host.access.log  main;

        location / {
            root /www/wwwroot/www.cz6hy9.top; #重点2,项目根路径，默认是nginx/html/
            #根索引文件，也就是输入ip或域名后在浏览器访问的第一页面
            index index.html index.htm;
            #root   html;
            #index  index.html index.htm;
            #try_files $uri $uri.html $uri/ /index.html; #这里是多页面访问配置，解决404错误
        }

        error_page  404 /404.html;

        # redirect server error pages to the static page /50x.html
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

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

       location / {
            root /www/wwwroot/www.cz6hy9.top; #重点4,项目根路径，默认是nginx/html/
            #根索引文件，也就是输入ip或域名后在浏览器访问的第一页面
            index index.html index.htm;
            #try_files $uri $uri.html $uri/ /index.html;#这里是多页面访问配置，解决404错误
       }

        error_page 404 /404.html;
        location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }
```


## pm2 部署 experss

### 上传项目代码

在文件中上传项目代码 一般放在 www/wwwroot 目录下

[![ppaEC3q.md.png](https://s1.ax1x.com/2023/03/21/ppaEC3q.md.png)](https://imgse.com/i/ppaEC3q)

### 添加项目

#### 终端添加

1. cd到项目目录，安装项目依赖

```shell
npm install
```

2. 配置环境变量

生成配置文件 `ecosystem.config.js`
```shell
pm2 ecosystem
```
常见配置如下
```js
module.exports = {
  apps: [
    {
      // 应用程序名称
      name: "cz-app",
      // 执行文件
      script: "./src/app.ts",
      // 是否启用监控模式，默认是false。如果设置成true，当应用程序变动时，pm2会自动重载。这里也可以设置你要监控的文件。
      watch: true, // watch: './',
      // 不用监听的文件
      ignore_watch: ["node_modules", "logs"],
      // 开发环境配置--env_dev
      env_dev: {
        NODE_ENV: "development",
      },
      // 测试环境配置--env_test
      env_test: {
        NODE_ENV: "test",
      },
      env: {
        NODE_ENV: "production",
      },
      // 应用程序启动模式，这里设置的是 cluster_mode（集群），默认是fork
      exec_mode: "cluster_mode",
      // 应用启动实例个数，仅在cluster模式有效 默认为fork；或者 max
      instances: 4,
      // 最大内存限制数，超出自动重启
      max_memory_restart: 8,
      // 自定义应用程序的错误日志文件(错误日志文件)
      error_file: "./logs/app-err.log",
      // 自定义应用程序日志文件(正常日志文件)
      out_file: "./logs/app-out.log",
      // 设置追加日志而不是新建日志
      merge_logs: true,
      // 指定日志文件的时间格式
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      // 最小运行时间，这里设置的是60s即如果应用程序在* 60s内退出，pm2会认为程序异常退出，此时触发重启* max_restarts设置数量，应用运行少于时间被认为是异常启动
      min_uptime: "60s",
      // 设置应用程序异常退出重启的次数，默认15次（从0开始计数）,最大异常重启次数，即小于min_uptime运行时间重启次数；
      max_restarts: 10,
      // 异常重启情况下，延时重启时间
      restart_delay: "60s",
    },
  ],

  // 环境部署
  deploy: {
    // 生成环境
    // 1、上传代码到云端仓库
    // 2、部署命令预览：
    // 首次部署: $ pm2 deploy ecosystem.json production setup
    // 更新版本: $ pm2 deploy ecosystem.json production update
    // 返回上一个版本: $ pm2 deploy ecosystem.json production revert 1
    // 3、执行首次部署：$ pm2 deploy ecosystem.json production setup
    // 4、执行部署运行：$ pm2 deploy ecosystem.json production
    // 5、看到 success 成功，报错看错误自行百度
    production: {
      // ssh的用户名，登录远程服务器的用户名
      user: "dzm",
      // 要发布的机器，远程服务器的IP或hostname，此处可以是数组同步部署多个服务器
      host: "10.0.90.164",
      // 要发布的代码分支，远端名称及分支名
      ref: "origin/master",
      // 代码Git仓库地址
      repo: "git@gitlab.dzm.net:dzm/nuxt-test",
      // 服务器存储代码地址，远程服务器部署目录
      path: "/usr/local/var/www/production",
      // ssh权限配置
      ssh_options: ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      // 1、在 setup 前触发，如安装 git
      "pre-setup": "",
      // 2、在 setup 后触发，如做一些其他配置
      "post-setup": "",
      // 3、在 deploy 前触发，执行本地脚本
      "pre-deploy-local": "",
      // 4、在 deploy 前触发，执行远程脚本
      "pre-deploy": "git fetch --all",
      // 5、在 deploy 后触发，执行远程脚本，如 npm install，部署后需要执行的命令
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      // 环境变量
      env: {
        // 指定为生成环境
        NODE_ENV: "production",
      },
    },
  },
};
```

3. 启动项目

```shell
# 启动测试环境
pm2 start ecosystem.config.js --env development

# 启动正式环境
pm2 start ecosystem.config.js --env production

# 脚本启动
pm2 start "npm run start"
```

::: tip pm2启动ts项目报错 ts-node 问题
1. cd 到pm2目录下安装依赖 
2. npm install typescript ts-node
3. cd 回项目目录启动
:::

1. 常用命令

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

#### 面板添加

端口号为项目代码中监听的端口号，并且需要需要开放（aws 和宝塔都需要配置）

[![ppaEPg0.md.png](https://s1.ax1x.com/2023/03/21/ppaEPg0.md.png)](https://imgse.com/i/ppaEPg0)

直接在 pm2 中设置映射

[![ppdK524.md.png](https://s1.ax1x.com/2023/03/22/ppdK524.md.png)](https://imgse.com/i/ppdK524)
[![ppdKhPU.md.png](https://s1.ax1x.com/2023/03/22/ppdKhPU.md.png)](https://imgse.com/i/ppdKhPU)
[![ppdK4GF.md.png](https://s1.ax1x.com/2023/03/22/ppdK4GF.md.png)](https://imgse.com/i/ppdK4GF)

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

:::tip withCredentials 设置跨域访问时是否携带 cookie 等信息
`experss` 中使用 `cors` 中间件对跨域进行了处理，默认把 `Access-Control-Allow-Origin` 设置为 `*`

`withCredentials` 设置为 true 时， `Access-Control-Allow-Origin` 不能设置为 `*`，必须指定域名

可以把 `withCredentials` 设置为 false 解决，或者给`Access-Control-Allow-Origin` 指定域名
:::

