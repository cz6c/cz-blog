# 基于 Node.js、Express 和 TypeScript 搭建项目

目录
[[toc]]


## 设置 TypeScript 开发环境

您将创建一个项目文件夹

运行 `npm init` 来初始化项目 ，创建一个 package.json 文件。

作为替代方案，您可以将以下 JSON 结构复制到您自己创建的 package.json 中：

```json
{
  "name": "node-typescript-api",
  "version": "1.0.0",
  "description": "Build an App with Node.js, Express, and TypeScript",
  "main": "index.js",
  "scripts": {},
  "license": "ISC"
}
```

如果您打算在应用程序中使用 TypeScript，最好在一开始就将其连接起来，

在这里您需要安装另一个 `ts-node` , 它可以让 .ts 在 Node 环境中从命令行运行 TypeScript 文件：

```shell
npm i -D typescript ts-node
```

考虑到 TypeScript 上下文，让我们也安装 node 的类型作为开发依赖项：

```shell
npm i -D @types/node
```

接下来，在项目的根文件夹中创建一个 tsconfig.json 文件。

此外，此文件允许您配置 typescript库 将如何编译项目内的 TypeScript 代码。使用以下 JSON 填充文件：

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "rootDir": "./",
    "esModuleInterop": true
  }
}
```
::: tip 配置文件的关键属性 `compilerOptions` , 定义了大部分 TypeScript 配置。
- `module`
指定要在编译的 JavaScript 代码中使用的模块系统。Node 环境中的标准模块系统是 CommonJS。
- `target`
属性定义已编译代码的目标 JavaScript 版本。
- `rootDir`
定义项目中typescript文件的根位置。
- `esModuleInterop`
标志启用 TypeScript 模块的默认导入
:::

## 构建 Express 服务器

接下来你需要安装 Express.js，这是一个在 Node 中创建服务器的流行包。

```shell
npm i express
```

考虑到 TypeScript 上下文，让我们也安装 Express 的类型作为开发依赖项：

```shell
npm i -D @types/express
```

在根目录下，创建src目录，再src目录下，创建一个app.ts ：

```ts
import express from 'express';

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});
```


安装 `Nodemon` ，它将通过在每次更改后自动重新启动服务器来加速您的开发。Nodemon 也作为开发依赖项安装，因为您只在开发阶段需要它。

```shell
npm i -D nodemon
```

在package.json文件中的scripts属性内，添加一个名为 serve 的脚本，用于启动服务器

因为通常您无法从命令行启动 typescript 文件，这时 ts-node  包就起了作用，

```json
"scripts": {
    "serve": "nodemon app.ts"
  }
```

现在你可以通过简单的运行来启动你的服务器：

```shell
npm run serve
```

服务器将在 3000端口 运行，应用程序运行的 URL 为http://localhost:3000。

## 配置常用的中间件

### 配置静态资源

此配置可让服务器上存储的一些静态文件，如 图片 视频 文档 等，直接通过外部接口的形式访问
在src目录下，创建静态文件夹public， 在app.ts 中，配置如下代码： 

```ts
import express from "express";
import path from "path";

const app = express();
const port = 3000;

// 配置静态资源
app.use(express.static(path.join(__dirname, "./public")));

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});
```

启动服务，我们就可以通过 `http://localhost:3000/xxxxx`  的形式访问到 public 目录下的xxxxx文件了。

### 配置跨域

```shell
npm i cors
npm i -D @types/cors
```

此配置能解决接口跨域问题， 在app.ts 中，配置如下代码： 

```ts
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

// 跨域
app.use(cors());

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});
```

### 配置请求体解析

此配置基于 body-parser 封装，解析请求体，在 app.ts 中，配置如下代码： 

```ts
import express from "express";

const app = express();
const port = 3000;

app.use(express.json()); // 解析json数据格式
app.use(express.urlencoded({ extended: true })); // 解析form表单提交的数据application/x-www-form-urlencoded

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});
```