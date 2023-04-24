首先我们在根目录分别新建.env.development，.env.production

.env.development 文件
用于serve，开发环境

```
# just a flag
ENV = 'development'

# base api
VUE_APP_BASE_API = 'https://www.realbiapi.xcdemo.cn'
```

.env.production 文件
用于build，线上环境

```
# just a flag
ENV = 'production'

# base api
VUE_APP_BASE_API = 'https://www.api.realbi.com'
```

webpack 打包指令

```
"build": "vue-cli-service build  --mode development",
"build:prod": "vue-cli-service build  --mode production",
```

baseURL使用
process.env.VUE_APP_BASE_API


判断当前项目运行环境为开发环境
 process.env.NODE_ENV === "development"
