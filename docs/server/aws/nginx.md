## 指令安装 Nginx

### 安装 Nginx

1. 安装编译工具及库文件

> yum -y install make zlib zlib-devel gcc-c++ libtool openssl openssl-devel
> yum install -y pcre pcre-devel

2. 创建 nginx 文件夹并进入 nginx 文件夹

> mkdir /usr/local/nginx
> cd /usr/local/nginx

3. 下载

> wget https://nginx.org/download/nginx-1.22.0.tar.gz

4. 解压并进入 nginx 目录

> tar -zxvf nginx-1.22.0.tar.gz
> cd nginx-1.22.0

5. 使用 nginx 默认配

> ./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre=/usr/local/pcre-8.45

6. 编译安装

> make && make install

7. 创建软连接

> ln -sf /usr/local/nginx/sbin/nginx /usr/local/bin/

8. 查看 nginx 版本

> nginx -v

### Nginx 配置

1. 创建 Nginx 运行使用的用户 www：

> /usr/sbin/groupadd www
> /usr/sbin/useradd -g www www

2. 配置 nginx.conf ，将/usr/local/webserver/nginx/conf/nginx.conf 替换为以下内容

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

3. 检查配置文件的正确性，并重载配置文件

> nginx -t
> nginx -s reload # 重新载入配置文件

4. 启动 nginx

> nginx

5. 查看进程

> ps -ef

### 其他命令

> nginx -s reopen # 重启 Nginx
> nginx -s stop # 停止 Nginx

## 宝塔安装

### 软件商店安装

### 配置 nginx

基本上宝塔安装`nginx`的时候配置的差不多，
需要注意部署前端项目时，要先在宝塔网站上添加一个站点，并把站点的域名配置好，添加成功后会在 wwwroot 下创建一个项目文件，
修改`nginx`配置文件做反向代理，修改项目文件路径和域名，如下所示

```
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
```
