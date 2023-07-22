# 项目配置

目录
[[toc]]

## 环境变量配置

一共四个配置文件，都在平台根目录下，具体如下

```yaml
├── .env                  # 基础环境变量配置文件（优先级最低）
├── .env.development      # 开发环境变量配置文件
├── .env.production       # 生产环境变量配置文件
├── .env.test             # 测试环境变量配置文件
```

项目初始有八个环境变量，可根据不同环境配置不同的值，具体如下

```sh
# base title
VITE_APP_TITLE = vue-cz-admin

# prot
VITE_PORT = 8848

# 平台打包路径
VITE_PUBLIC_PATH = /

#ENV
VITE_NODE_ENV = development

# 代理
VITE_PROXY = [["/api","https://api.cz6hy9.top"]]

# base api
VITE_BASE_URL = /api

# 开启.gz压缩
VITE_USE_COMPRESS = false

# 打包体积分析
VITE_USE_REPORT = false
```

### 基础用法

```ts
const { VITE_PUBLIC_PATH } = import.meta.env;

console.log("当前环境变量VITE_PUBLIC_PATH为：", VITE_PUBLIC_PATH)

console.log("当前环境为：", process.env.NODE_ENV)

```

### 添加自定义配置

比如要在 .env.production 文件添加自定义配置 VITE_HANDSOME = true

1. 在 .env.production 中加入 VITE_HANDSOME = true，具体如下

```sh
# 自定义配置
VITE_HANDSOME = true
```

1. 加入类型支持，在 types/global.d.ts 文件的 ViteEnv 类型里，具体如下

```ts
interface ViteEnv {
  VITE_HANDSOME: boolean;
}
```

## config.ts配置

在这个文件中配置项目的全局变量，统一进行维护管理

```ts
interface ProductConfig {
  isDynamicAddedRoute: boolean;
  isPermCode: boolean;
}

export const productConfig: ProductConfig = {
  // 是否启用动态路由
  isDynamicAddedRoute: false,
  // 是否启用按钮权限控制
  isPermCode: false,
};
```

## vite 配置

项目单独把跨域代理配置和vite插件抽离到了build文件夹下面，通过模块化的方式进行封装处理，结构如下

```yaml
├─build               #  项目打包目录
│  ├─vite               #  vite配置
│  │  ├─plugins           #  vite插件
│  │  │  ├─component.ts     #  vite插件配置
│  │  ├─index.ts          #  vite插件统一注册
│  │  └─proxy.ts          #  proxy跨域代理
│  └─utils.ts            #  vite环境变量处理
```

然后再统一导入到vite.config.ts中进行注册和配置，如下所示

```ts
import { UserConfigExport, ConfigEnv, loadEnv } from "vite";
import { resolve } from "path";
import { createVitePlugins } from "./build/vite";
import { wrapperEnv } from "./build/utils";
import { createProxy } from "./build/vite/proxy";

const pathResolve = (dir: string) => {
  return resolve(process.cwd(), ".", dir);
};

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const isProduction = command === "build";
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  return {
    root,
    base: viteEnv.VITE_PUBLIC_PATH,
    resolve: {
      alias: [
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve("src") + "/",
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve("types") + "/",
        },
      ],
    },
    css: {
      preprocessorOptions: {
        // 配置全局scss文件
        scss: {
          additionalData: '@use "/@/assets/style/variables.scss" as *;',
        },
      },
    },
    /*  https://cn.vitejs.dev/config/server-options.html#server-proxy */
    server: {
      host: true,
      hmr: true,
      port: viteEnv.VITE_PORT,
      proxy: createProxy(viteEnv.VITE_PROXY),
    },
    plugins: createVitePlugins(viteEnv, isProduction),
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  };
};

```