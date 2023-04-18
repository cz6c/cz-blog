# Router

目录
[[toc]]

### 强刷路由

1. 创建一个空白页，先跳空白页再回跳原页面，实现强刷当前路由效果

```js
// refresh.Vue
<template>
    <div class="refresh"></div>
</template>
<script>
export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$router.replace(from.path);
        });
    },
};
</script>


// 需要的地方调用
this.$router.replace({
    path: "/refresh",
});
```

2. 给路由加动态 key，实现强刷路由

```js
<router-view :key="$route.fullPath" />
```

### 动态清空路由

::: tip vue2 router3
原理：所有的 vue-router 注册的路由信息都是存放在 matcher 之中的，所以当我们想清空路由的时候，我们只要新建一个空的 Router 实例，将它的 matcher 重新赋值给我们之前定义的路由就可以了。现在我们只需要调用 resetRouter，就能得到一个空的路有实例，之后你就可以重新 addRoutes 你想要的路由了
:::

```js
export function resetRouter () {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}
export default router
```

::: tip vue3 router4
首先通过 `getRoutes()` 获得所有路线记录的完整列表。，然后通过 `removeRoute()` 按名称删除路由。
:::
```ts
// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = [];
const getRouteNames = (array: any[]) =>
  array.forEach(item => {
    WHITE_NAME_LIST.push(item.name);
    getRouteNames(item.children || []);
  });
getRouteNames(routes);

/**
 * @description: 重置路由
 */
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route;
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}
```

### 路由跳新标签页

```js
// 打开新标签  _self当前 _blank新标签页
goPage() {
    const routeUrl = this.$router.resolve({
        path: "/dispatchBig/index",
    });
    window.open(routeUrl.href, "_blank");
}
```

### H5 history 路由模式下，加载不到资源问题

开发环境下把 vue.config.js 中的 publicPath 改为 "/" 即可

- “./” 代表相对路径，一般配置这个，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径
- “/” 代表绝对路径，这样所有的资源都会被链接为绝对路径，这样打出来的包只能被部署在根路径下，可解决 HTML5 history 路由新标签页加载不到资源问题

生产环境需要服务器配置
具体配置参考 : https://router.vuejs.org/zh/guide/essentials/history-mode.html#hash-%E6%A8%A1%E5%BC%8F
