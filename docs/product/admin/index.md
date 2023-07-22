# 介绍

目录
[[toc]]

## 简介

`vue-cz-admin` 是一款开源免费且开箱即用的中后台管理系统模版，也可用于学习参考。使用了最新的 `Vue3`、`Vite4`、`Element-Plus`、`TypeScript`、`Pinia` 等主流技术开发。

## 预览



## Git 贡献提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

## 项目开发规范

### 1. 目录按功能不同来划分

```yaml
├─build               #  项目打包目录
│  ├─vite               #  vite配置
│  │  ├─plugins           #  vite插件
│  │  │  ├─component.ts     #  vite插件配置
│  │  ├─index             #  vite插件统一注册
│  │  └─proxy             #  proxy跨域代理
│  └─utils            #  vite环境变量处理
├─public              #  公共静态资源目录
├─src                 #  src目录
├─src                 #  项目src目录
│  ├─api                #  数据请求
│  │  ├─public          #  页面公共api
│  │  └─system          #  系统设置页面api
│  ├─assets             #  静态资源
│  │  ├─style             #  css资源
│  │  ├─images            #  图片资源
│  │  └─svg               #  svg资源
│  ├─components         #  公共组件
│  │  ├─SvgIcon           #  svg组件
│  │  │  └─index.vue
│  │  └─index.ts          #  组件统一注册
│  ├─directives         #  公共指令
│  │  ├─modules           #  指令模块
│  │  │  └─permission.ts      #  按钮权限指令
│  │  └─index.ts          #  指令统一注册
│  ├─layout             #  项目布局
│  ├─hooks              #  自定义hooks
│  ├─routes             #  路由
│  │  ├─modules           #  路由模块
│  │  │  └─system.ts      	#  系统设置路由
│  │  └─index.ts          #  路由统一注册
│  ├─store              #  状态管理
│  │  ├─modules           #  状态管理模块
│  │  │  └─auth.ts      	#  用户权限状态
│  │  └─index.ts          #  状态管理统一注册
│  ├─utils              #  工具
│  ├─views              #  页面
│  │  ├─system              #  系统设置
│  │  │  ├─components       #  页面组件
│  │  │  │  └─AddDialog.vue    #  新增组件
│  │  │  ├─useTable.vue        #  页面hooks
│  │  ├─ └─index.vue        #  列表页面
│  ├─APP.vue            #  页面入口
│  ├─config.ts          #  项目配置
│  ├─main.ts            #  入口文件
│  └─permission.ts      #  动态路由权限
├─types               #  类型文件目录
├─.env                #  公共环境变量
├─.env.development    #  开发环境变量
├─.env.test           #  测试环境变量
├─.env.production     #  生成环境变量
├─.eslintignore       #  eslint忽略文件配置
├─.eslintrc-auto-import  #  eslint
├─.eslintrc.js        #  eslint配置
├─.gitignore          #  git提交忽略文件配置
├─.prettierignore     #  prettierrc忽略文件配置
├─.prettierrc.js      #  prettierrc配置
├─.stylelintignore    #  stylelint忽略文件配置
├─.commitlint.config.js  #  git提交规范配置
├─index.html          #  index.html
├─package.json        #  依赖包管理以及命令配置
├─README.md           #  描述文件
├─stylelint.config.js #  stylelint配置
├─tsconfig.json       #  ts配置文件
└─vite.config.ts      #  vite配置文件
```

### 2. 代码书写规范

**命名规范**

- 组件命名统一使用大驼峰，页面命名统一使用小驼峰
- TS 类型文件命名统一后缀 .d.ts
- TS 定义类型统一使用大驼峰
- hooks 函数命名统一前面加 use
- store 状态模块命名后面统一加 Store
- handle 开头代表事件，

**工具约束代码规范**

除了约定的规范，可以借助一些工具和插件来协助进一步规范化。

- **vscode**：统一编辑器。
- **editorconfig**: 统一编辑器默认配置。
- **prettier**: 自动格式化代码。
- **eslint**: 检测代码语法规范和错误。
- **stylelint**: 检测和格式化样式文件语法。
- **husky**:可以监听 githooks 执行，在对应 hook 执行阶段做一些处理的操作。
- **lint-staged**: 只检测暂存区文件代码，优化 eslint 检测速度。
- **commitlint**：在 githooks 的 pre-commit 阶段对 commit 备注信息进行检测。

### 3. git 工作流

**分支管理**

- master，项目的主分支，管理生产环境代码
- develop，项目的测试分支，管理测试环境代码
- featrue，项目的开发分支，管理开发环境代码
- version，项目的版本分支，管理项目各版本代码

**开发部署工作流**

- 迭代版本：从 master 拉取代码到 featrue 下的新分支-->在新分支中开发新功能提交代码-->新功能开发完成后，合并新分支到 develop 触发测试环境构建-->测试没问题后，develop 合并到 master 触发生产环境构建-->测试并回归-->从 master 拉取代码到 version 下的新版本号分支
- 修复线上 bug：从 master 拉取代码到 featrue 下的新分支-->在新分支中修复 bug 提交代码-->合并新分支到 develop 触发测试环境构建-->测试没问题后，develop 合并到 master 触发生产环境构建-->测试并回归-->从 master 拉取代码到 version 下的新版本号分支

## 项目通用模版

1. 通用后台管理系统基础模版
2. 通用小程序基础模版
3. 通用 h5 端基础模版
4. 通用 node 端基础模版
5. 其他类型的项目默认模版
