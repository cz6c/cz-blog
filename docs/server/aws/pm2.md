## pm2 部署后端项目 experss

#### 上传项目代码

在文件中上传项目代码 一般放在 www/wwwroot 目录下
[![ppaEC3q.md.png](https://s1.ax1x.com/2023/03/21/ppaEC3q.md.png)](https://imgse.com/i/ppaEC3q)

#### 添加项目

项目启动文件填 npm，把项目运行脚本改为 nppm run start
端口号应该项目代码中监听的端口号，并且需要需要开放（aws 和宝塔都需要配置）
[![ppaEPg0.md.png](https://s1.ax1x.com/2023/03/21/ppaEPg0.md.png)](https://imgse.com/i/ppaEPg0)

#### 添加数据库

添加完数据库，导入本地数据库文件到服务器
修改项目代码中链接数据库的代码（数据库名称，账号，密码等），默认端口为 3306
注：如果碰到添加不了数据库时，可修改 root 密码刷新页面后重新添加
[![ppaEivV.md.png](https://s1.ax1x.com/2023/03/21/ppaEivV.md.png)](https://imgse.com/i/ppaEivV)

#### 使用 navicat premium 访问服务器数据库

[![ppaKiFS.md.png](https://s1.ax1x.com/2023/03/21/ppaKiFS.md.png)](https://imgse.com/i/ppaKiFS)

如果出现 10060 连接问题：

1. `mysql -u root -p` 登录 mysql 输入密码
2. `SELECT host,user FROM mysql.user;` 查询用户允许访问状态
3. `GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'yuor_password' WITH GRANT OPTION;` 把 root 允许访问权限设置为全部 %
4. `flush privileges;` 更新权限表
5. `DELETE FROM `user` WHERE Host='10.155.123.55' AND User='kaka';` 删除时使用这个

### 跨域问题

#### withCredentials 设置跨域访问时是否携带 cookie 等信息

因为 experss 中使用 cors 中间件对跨域进行了处理，默认把 `Access-Control-Allow-Origin` 设置为 `*`，
而 `withCredentials` 设置为 true 时，需要 `Access-Control-Allow-Origin` 不能设置为 `*`，必须指定域名，
可以把 withCredentials 设置为 false 解决，或者给`Access-Control-Allow-Origin` 指定域名，

```
Access to XMLHttpRequest at 'http://35.76.99.97:9999/user/info' from origin 'http://35.76.99.97' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
```

### 配置域名和 https

1. 购买域名和 ssl 证书，然后给对应域名配置 ssl 证书，并下载
2. 把下载后的证书放人项目中，并在 app.ts 中加入以下代码，开启 https 服务

```
const http = require("http");
const https = require("https");
const fs = require("fs");
const options = {
  key: fs.readFileSync(path.join(__dirname, "../9534144_www.cz6hy9.top.key")),
  cert: fs.readFileSync(path.join(__dirname, "../9534144_www.cz6hy9.top.pem")),
};
// 创建服务
const httpsServer = https.createServer(options, app);
const httpServer = http.createServer(app);

httpsServer.listen(9999, () => {
  console.log("Example app listening on port 9999!");
});

httpServer.listen(9998, () => {
  console.log("Example app listening on port 9998!");
});
```

3. 直接在 pm2 中设置映射
   [![ppdK524.md.png](https://s1.ax1x.com/2023/03/22/ppdK524.md.png)](https://imgse.com/i/ppdK524)
   [![ppdKhPU.md.png](https://s1.ax1x.com/2023/03/22/ppdKhPU.md.png)](https://imgse.com/i/ppdKhPU)
   [![ppdK4GF.md.png](https://s1.ax1x.com/2023/03/22/ppdK4GF.md.png)](https://imgse.com/i/ppdK4GF)
