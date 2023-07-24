# Linux 环境配置

[[toc]]

## git

### 安装

使用yum安装

```shell
yum install git
```

初始化配置

```shell
git config --global user.name "cz" (git的用户名)
git config --global user.email "chenzb961@163.com" (git的用户名邮箱)
```

### 使用shh链接git

生成shh密钥

```shell
ssh-keygen -t rsa -C "chenzb961@163.com"
```
然后一路enter，成功后切换到ssh目录下 cd ~/.ssh/ 查看证书

注意:这文件下的id_rsa 是私钥，id_rsa.pub表示公钥

实现git和github的链接

1. 首先登陆github，https://github.com/
2. 登陆之后点击头像，点击Settings.
3. 然后点击【SSH and GPG Keys】-----> 【New SSH Key】
4. 然后填写SSH Key数据。名字（随便写），Key是公钥
5. 使用命令 ssh git@github.com 来链接github，验证是否成功

### git常见命令

基本提交步骤

```shell
git init                         //第一次配置：初始化本地仓库

git pull 远程url   //每次提交前先拉取一下
git status         //查看文件状态
git add .          //添加所有文件到暂存区  add 文件名    添加指定文件
git commit -m xxx  //提交当前分支     -o 文件名 -m xxx  提交指定文件

git remote add origin 远程url   //第一次配置：远程仓库别名
git push -u origin             //第一次配置：下次提交可以直接给push

git push           //提交

git log            //查看提交记录
```

开发到一半需要切换分支，先复制，回到分支在粘贴即可

```shell
git stash       //复制
git stash pop   //粘贴
```

分支命令

```shell
git branch        //查看所有分支
git branch xxx    //创建xxx分支   -b xxx 创建并切换到xxx分支
git checkout xxx  //切换到xxx分支
git merge xxx     //把xxx分支和当前所在分支合并
git branch -d xxx //删除xxx分支
```

## node、PM2

### 安装 node

```shell
wget https://nodejs.org/dist/v14.16.0/node-v14.16.0-linux-x64.tar.xz
```

解压到 uer/ 目录

```shell
tar xvf node-v14.16.0-linux-x64.tar.xz -C /usr
```

修改解压文件名字为 node

解压文件的 bin 目录底下包含了 node、npm 等命令，我们可以使用 ln 命令来设置软连接：

```shell
ln -s /usr/node/bin/node /usr/local/bin/
ln -s /usr/node/bin/npm /usr/local/bin/
```

此时就可以使用 node npm 命令了

### 安装 PM2

```shell
npm install pm2 -g
```

安装好后在 node/bin 目录下会出现一个 pm2 文件，同样设置软连接

```shell
ln -sf /usr/node/bin/pm2 /usr/local/bin/
```

查看进程

```shell
pm2 ls
```

## Nginx 

### 安装 Nginx

安装编译工具及库文件

```shell
yum -y install make zlib zlib-devel gcc-c++ libtool openssl openssl-devel
yum install -y pcre pcre-devel
```

创建 nginx 文件夹并进入 nginx 文件夹

```shell
mkdir /usr/local/nginx
cd /usr/local/nginx
```

下载

```shell
wget https://nginx.org/download/nginx-1.22.0.tar.gz
```

解压并进入 nginx 目录

```shell
tar -zxvf nginx-1.22.0.tar.gz
cd nginx-1.22.0
```

使用 nginx 默认配

```shell
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre=/usr/local/pcre-8.45
```

编译安装

```shell
make && make install
```

创建软连接

```shell
ln -sf /usr/local/nginx/sbin/nginx /usr/local/bin/
```

查看 nginx 版本

```shell
nginx -v
```

### Nginx 配置

创建 Nginx 运行使用的用户 www：

```shell
> /usr/sbin/groupadd www
> /usr/sbin/useradd -g www www
```

配置 nginx.conf ，将/usr/local/webserver/nginx/conf/nginx.conf 替换为以下内容

```
user  www www;
worker_processes auto;
error_log  /www/wwwlogs/nginx_error.log  crit;
pid        /www/server/nginx/logs/nginx.pid;
worker_rlimit_nofile 51200;

stream {
    log_format tcp_format '$time_local|$remote_addr|$protocol|$status|$bytes_sent|$bytes_received|$session_time|$upstream_addr|$upstream_bytes_sent|$upstream_bytes_received|$upstream_connect_time';

    access_log /www/wwwlogs/tcp-access.log tcp_format;
    error_log /www/wwwlogs/tcp-error.log;
    include /www/server/panel/vhost/nginx/tcp/*.conf;
}

events
    {
        use epoll;
        worker_connections 51200;
        multi_accept on;
    }

http
    {
        include       mime.types;
		#include luawaf.conf;

		include proxy.conf;

        default_type  application/octet-stream;

        server_names_hash_bucket_size 512;
        client_header_buffer_size 32k;
        large_client_header_buffers 4 32k;
        client_max_body_size 50m;

        sendfile   on;
        tcp_nopush on;

        keepalive_timeout 60;

        tcp_nodelay on;

        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
        fastcgi_buffer_size 64k;
        fastcgi_buffers 4 64k;
        fastcgi_busy_buffers_size 128k;
        fastcgi_temp_file_write_size 256k;
		fastcgi_intercept_errors on;

        gzip on;
        gzip_min_length  1k;
        gzip_buffers     4 16k;
        gzip_http_version 1.1;
        gzip_comp_level 2;
        gzip_types     text/plain application/javascript application/x-javascript text/javascript text/css application/xml;
        gzip_vary on;
        gzip_proxied   expired no-cache no-store private auth;
        gzip_disable   "MSIE [1-6]\.";

        limit_conn_zone $binary_remote_addr zone=perip:10m;
		limit_conn_zone $server_name zone=perserver:10m;

        server_tokens off;
        access_log off;

server
    {
        listen 888;
        server_name phpmyadmin;
        index index.html index.htm index.php;
        root  /www/server/phpmyadmin;

        #error_page   404   /404.html;
        include enable-php.conf;

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }

        location ~ .*\.(js|css)?$
        {
            expires      12h;
        }

        location ~ /\.
        {
            deny all;
        }

        access_log  /www/wwwlogs/access.log;
    }

        # HTTP 服务
    server
    {
        listen       80;
        server_name  www.cz6hy9.top; #重点1,修改为主机名或域名
        rewrite ^(.*)$ https://$host$1 permanent; #将所有HTTP请求通过rewrite指令重定向到 HTTPS

        #charset koi8-r;
        #access_log  logs/host.access.log  main;

        location / {
            #重点2,如要自定义路径请修改，默认是nginx/html/
            root /www/wwwroot/www.cz6hy9.top;
            #根索引文件，也就是输入ip或域名后在浏览器访问的第一页面
            index index.php index.html index.htm default.php default.htm default.html;
            #root   html;
            #index  index.html index.htm;
            #try_files $uri $uri.html $uri/ /index.html;#这里是多页面访问配置，解决404错误
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

       # 然后上传到 nginx.conf 同一目录下
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
            #重点2,如要自定义路径请修改，默认是nginx/html/
            root /www/wwwroot/www.cz6hy9.top;
            #根索引文件，也就是输入ip或域名后在浏览器访问的第一页面
            index index.php index.html index.htm default.php default.htm default.html;
            #try_files $uri $uri.html $uri/ /index.html;#这里是多页面访问配置，解决404错误
       }

        error_page 404 /404.html;
        location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }

    server
    {
        listen       80;
        server_name  api.cz6hy9.top; #重点1,修改为主机名或域名
        rewrite ^(.*)$ https://$host$1 permanent; #将所有HTTP请求通过rewrite指令重定向到 HTTPS
        location / {
            proxy_pass http://127.0.0.1:3000;#重点2,nodejs后端项目地址端口，开启HTTP强制转HTTPS后直接走HTTPS里的
            proxy_buffer_size 64k;
            proxy_buffering on;
            proxy_buffers 4 64k;
            proxy_busy_buffers_size 64k;
            proxy_max_temp_file_size 1024m;
            proxy_ssl_server_name  off;
        }
    }

     server
     {
       listen       443 ssl;
       server_name  api.cz6hy9.top; #重点1,修改为主机名或域名

       # 然后上传到 nginx.conf 同一目录下
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
            proxy_pass http://127.0.0.1:3030;#重点4,nodejs后端项目地址端口，开启HTTP强制转HTTPS后直接走HTTPS里的
            proxy_buffer_size 64k;
            proxy_buffering on;
            proxy_buffers 4 64k;
            proxy_busy_buffers_size 64k;
            proxy_max_temp_file_size 1024m;
            proxy_ssl_server_name  on;
       }
    }

include /www/server/panel/vhost/nginx/*.conf;
}
```

检查配置文件的正确性，并重载配置文件

```shell
nginx -t
nginx -s reload # 重新载入配置文件
```

启动 nginx

```shell
nginx
```

1. 查看进程

```shell
ps -ef
```

其他命令

```shell
nginx -s reopen # 重启 Nginx
nginx -s stop # 停止 Nginx
```