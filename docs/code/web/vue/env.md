首先我们在根目录分别新建.env.development，.env.test，.env.production

.env.development 文件
用于serve，开发环境

```shell
# just a flag
ENV = 'development'

# base api
VUE_APP_BASE_API = 'https://www.development.com'
```

.env.test 文件
用于build，测试环境

```shell
# just a flag
ENV = 'test'

# base api
VUE_APP_BASE_API = 'https://www.api.test.com'
```

.env.production 文件
用于build，生产环境

```shell
# just a flag
ENV = 'production'

# base api
VUE_APP_BASE_API = 'https://www.api.production.com'
```

webpack 打包指令

```shell
"build:test": "vue-cli-service build  --mode test",
"build:prod": "vue-cli-service build  --mode production",
```

```ts
// baseURL使用
process.env.VUE_APP_BASE_API
// 判断当前项目运行环境为开发环境
 process.env.NODE_ENV === "development"
```

