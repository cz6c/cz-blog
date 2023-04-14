## Linux 安装 node、PM2

1. 安装 node

   > wget https://nodejs.org/dist/v14.16.0/node-v14.16.0-linux-x64.tar.xz

2. 解压到 uer/ 目录

   > tar xvf node-v14.16.0-linux-x64.tar.xz -C /usr

3. 修改解压文件名字为 node

4. 解压文件的 bin 目录底下包含了 node、npm 等命令，我们可以使用 ln 命令来设置软连接：

   > ln -s /usr/node/bin/node /usr/local/bin/
   > ln -s /usr/node/bin/npm /usr/local/bin/

5. 此次就可以使用 node npm 命令了

6. 安装 PM2

   > npm install pm2 -g

7. 安装好后在 node/bin 目录下会出现一个 pm2 文件，同样设置软连接

   > ln -sf /usr/node/bin/pm2 /usr/local/bin/

8. 查看进程
   > pm2 ls
