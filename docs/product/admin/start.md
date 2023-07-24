# 开始

## 准备

- [node](http://nodejs.org/) 和 [git](https://git-scm.com/) -项目开发环境，node版本建议`v16.18.1`以上
- [Vue3](https://v3.vuejs.org/) - 熟悉 Vue 基础语法
- [Vite4](https://vitejs.dev/) - 熟悉 vite 特性
- [TypeScript](https://www.typescriptlang.org/) - 熟悉`TypeScript`基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 es6 基本语法
- [Vue-Router](https://next.router.vuejs.org/) - 熟悉 vue-router 基本使用
- [Element-Plus](https://element-plus.org/zh-CN/) - 熟悉 ui 基本使用
- [Pinia](https://element-plus.org/zh-CN/) - 熟悉状态管理插件的基本使用

## 安装使用

- 获取项目代码

```bash
git clone https://github.com/cz6c/vue-cz-admin.git
```

- 安装依赖，推荐使用pnpm包管理

```bash
pnpm install
```

- 运行

```bash
pnpm run dev
```

- 打包

```bash
# 测试环境打包
pnpm run build:test
# 生产环境打包
pnpm run build:test
```

## npm script

```yaml
"scripts": {
  # 运行项目
  "dev": "vite",
  # 构建项目 测试
  "build:test": "vite build --mode test",
  # 构建项目 生产
  "build:prod": "vite build --mode production",
  # 直接预览本地 dist 文件目录
  "preview": "vite preview",
  # 执行 eslint 校验，并修复部分问题
  "lint:eslint": "eslint --cache --max-warnings 0  \"src/**/*.{vue,ts,tsx}\" --fix",
  # 执行 prettier 格式化（该命令会对项目所有代码进行 prettier 格式化，请谨慎执行）
  "lint:prettier": "prettier --write  \"src/**/*.{js,json,tsx,css,less,scss,vue,html,md}\"",
  # 执行 stylelint 格式化
  "lint:stylelint": "stylelint --cache --fix \"src/**/*.{vue,less,postcss,css,scss}\" --cache --cache-location node_modules/.cache/stylelint/",
  # lint-staged能够让lint只检测暂存区的文件（这里用于husky，提交前校验）
  "lint:lint-staged": "lint-staged",
  # 自动生成husky
  "prepare": "husky install",
  # 提交代码
  "cz": "git add . && czg",
  # 格式化svg
  "svgo": "svgo -f ./src/assets/svg -o ./src/assets/svg"
},
```