# 路由

项目路由配置统一存放于 `src/router` 下面，
`src/router/modules` 用于存放路由模块，在该目录下的文件会自动注册。

::: warning 注意事项
整个项目所有路由 name 不能重复
所有的多级路由最终都会转成二级路由
:::

## 路由模块示例

`src/router/routes/modules` 内的 .ts 文件会被视为一个路由模块。如下所示


```ts
import type { AppRouteRecordRaw } from "/@/router/type";
import { Layout } from "/@/router";

export default {
  path: "/system",
  name: "System",
  component: Layout,
  meta: {
    title: "组织架构",
    icon: "menu-system",
    orderNo: 2,
  },
  redirect: "/system/user",
  children: [
    {
      path: "/system/user",
      name: "User",
      component: () => import("/@/views/system/user/index.vue"),
      meta: {
        title: "用户管理",
      },
    },
    {
      path: "/system/role",
      name: "Role",
      component: () => import(`/@/views/system/role/index.vue`),
      meta: {
        title: "角色管理",
      },
    },
  ],
} as AppRouteRecordRaw;
``` 

## 路由配置说明



```ts
import type { RouteMeta, RouteRecordName } from "vue-router";
import { defineComponent } from "vue";

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import("*.vue")>)
  | (() => Promise<T>);

export interface AppRouteMeta extends RouteMeta {
  // 菜单名称
  title: string;
  // 菜单图标
  icon?: string;
  // 是否隐藏该菜单
  hideMenu?: boolean;
  // 当前激活的菜单。用于配置hideMenu true时左侧激活的菜单路径
  activeMenu?: string;
  // 是否隐藏该路由在面包屑上面的显示
  hideBreadcrumb?: boolean;
  // 菜单排序
  orderNo?: number;
  // 需要内嵌的iframe链接地址
  frameSrc?: string;
  // 标签页固定
  affix?: boolean;
  // 当前菜单名称或自定义信息禁止添加到标签页
  hideTag?: boolean;
  // 显示在标签页的最大数量
  dynamicLevel?: number;
  // 是否忽略KeepAlive缓存
  ignoreKeepAlive?: boolean;
}

export interface AppRouteRecordRaw {
  // 路由地址
  path: string;
  // 路由名字（必须保持唯一）
  name: RouteRecordName;
  // 路由元信息
  meta: AppRouteMeta;
  // 路由重定向
  redirect?: string;
  // 按需加载需要展示的页面
  component?: Component | string;
  // 子路由配置项
  children?: AppRouteRecordRaw[];
}
```

## 外部页面嵌套

只需要将 frameSrc 设置为需要跳转的地址即可

```ts
const IFrame = () => import('/@/views/iframe/index.vue');
{
  path: "/iframe/doc",
  name: "IFrameDoc",
  component: IFrame,
  meta: {
    frameSrc: "https://blog.cz6hy9.top/product/admin/",
    title: "内嵌文档",
  },
},
```

## 外链

只需要将 path 设置为需要跳转的HTTP 地址即可

```ts
{
  path: "https://blog.cz6hy9.top/product/admin/",
  name: "DocExternal",
  component: IFrame,
  meta: {
    title: "外部文档",
  },
},
```

## 新增路由模块

如何新增一个路由模块?

首先需要在项目 `/@/views` 下创建一个页面文件，示例 `/@/views/test/test1/index.vue`

然后在 `src/router/modules` 内新增一个 `test.ts` 模块文件。如下所示

```ts
import type { AppRouteRecordRaw } from "/@/router/type";
import { Layout } from "/@/router";

export default {
  path: "/test",
  name: "Test",
  component: Layout,
  meta: {
    title: "测试",
    icon: "menu-system",
    orderNo: 6,
  },
  redirect: "/test/test1",
  children: [
    {
      path: "/test/test1",
      name: "Test1",
      component: () => import("/@/views/test/test1/index.vue"),
      meta: {
        title: "测试1页面",
      },
    },
  ],
} as AppRouteRecordRaw;
```

此时路由已添加完成，不需要手动引入，放在src/router/modules 内的文件会自动被加载。

验证：访问 ip:端口/test/test1 出现对应组件内容即代表成功。

## 路由刷新

项目中采用的是重定向方式，并且封装了hooks 方便调用，具体代码如下所示

```ts
import { RouterEnum } from "/@/router";
import { unref } from "vue";
import { useRouter, Router } from "vue-router";

/**
 * @description: 重新加载页面
 */
export function useRedo(router: Router) {
  const { replace, currentRoute } = router || useRouter();
  const { query, params = {}, name, fullPath } = unref(currentRoute);
  function redo(): Promise<boolean> {
    return new Promise(resolve => {
      if (name === RouterEnum.REDIRECT_NAME) {
        resolve(false);
        return;
      }
      if (name && Object.keys(params).length > 0) {
        params["_origin_params"] = JSON.stringify(params ?? {});
        params["_redirect_type"] = "name";
        params["path"] = String(name);
      } else {
        params["_redirect_type"] = "path";
        params["path"] = fullPath;
      }
      replace({ name: RouterEnum.REDIRECT_NAME, params, query }).then(() => resolve(true));
    });
  }
  return { redo };
}
```
Redirect页面代码，如下所示

```vue
<template>
  <div></div>
</template>
<script lang="ts" setup name="Redirect">
import { unref } from "vue";
import { useRouter } from "vue-router";

const { currentRoute, replace } = useRouter();
const { params, query } = unref(currentRoute);
const { path, _redirect_type = "path" } = params;

Reflect.deleteProperty(params, "_redirect_type");
Reflect.deleteProperty(params, "path");

const _path = Array.isArray(path) ? path.join("/") : path;

if (_redirect_type === "name") {
  replace({
    name: _path,
    query,
    params,
  });
} else {
  replace({
    path: _path.startsWith("/") ? _path : "/" + _path,
    query,
  });
}
</script>
```

实际调用

```ts
import { useRedo } from "/@/hooks/usePage";

// 执行刷新
const { redo } = useRedo(router);
await redo();
```

## 多标签页

标签页使用的是 `keep-alive` 和 `router-view` 实现，实现切换 tab 后还能保存切换之前的状态。

::: tip 开启多标签页缓存有 3 个条件
1. 在 src/config.ts 内将 openKeepAlive 设置为 true
2. 路由设置 name，且不能重复
3. 路由对应的组件的 name 必须与路由设置的 name 保持一致 （因为 :include - 字符串或正则表达式，只有名称匹配的组件会被缓存）
:::

如何让某个页面不缓存?

可在 router.meta 下配置，将 ignoreKeepAlive 配置成 true 即可关闭缓存。