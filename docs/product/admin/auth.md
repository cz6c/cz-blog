# 权限

两种菜单权限处理方式：

- 前端控制
  
实现原理: 在前端固定写死路由的权限，指定路由有哪些权限可以查看。只初始化通用的路由，需要权限才能访问的路由没有被加入路由表内。在登陆后，通过用户的角色去遍历路由表，获取该角色可以访问的路由表，生成路由表，再通过 router.addRoutes 添加到路由实例。

缺点: 权限相对不自由，适合角色较固定的系统

- 后端控制

实现原理: 在登陆后，通过接口动态生成路由表，且遵循一定的数据结构返回。前端根据需要处理该数据为可识别的结构，再通过 router.addRoutes 添加到路由实例，实现权限的动态生成。

本项目采用第二中方式来实现菜单的动态生成，灵活度高，

## 菜单权限实现

首先初始化基础路由 

```ts
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import type { App } from "vue";
import type { AppRouteRecordRaw } from "/@/router/type";

export const Layout = () => import("/@/layout/index.vue");
export const IFrame = () => import("/@/views/iframe/index.vue");

export enum RouterEnum {
  // login path
  BASE_LOGIN_PATH = "/login",
  // basic home path
  BASE_HOME_PATH = "/dashboard",
  // redirect name
  REDIRECT_NAME = "Redirect",
}

// 公共菜单
const routesList: AppRouteRecordRaw[] = [
  // 根路由
  {
    path: "/",
    name: "Root",
    redirect: RouterEnum.BASE_HOME_PATH,
    meta: {
      title: "root",
    },
  },
  // 登录路由
  {
    path: "/login",
    name: "Login",
    component: () => import("/@/views/public/login.vue"),
    meta: {
      title: "login",
    },
  },
];

// Layout  404
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: "/:path(.*)*",
  name: "PAGE_NOT_FOUND_NAME",
  component: () => import("/@/views/public/404.vue"),
  meta: {
    title: "ErrorPage",
    hideBreadcrumb: true,
    hideMenu: true,
    hideTag: true,
  },
};
// Layout redirect
export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: "/redirect",
  component: Layout,
  name: "RouterEnum.REDIRECT_NAME",
  meta: {
    title: "REDIRECT_NAME",
    hideBreadcrumb: true,
    hideMenu: true,
    hideTag: true,
  },
  children: [
    {
      path: "/redirect/:path(.*)",
      name: RouterEnum.REDIRECT_NAME,
      component: () => import("/@/views/public/auth-redirect.vue"),
      meta: {
        title: "REDIRECT_NAME",
        hideBreadcrumb: true,
        hideMenu: true,
        hideTag: true,
      },
    },
  ],
};

const routes = [...routesList, PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE] as RouteRecordRaw[];

// app router
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ left: 0, right: 0 }),
  routes,
});

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

export default router;

// 配置路由器
export function setupRouter(app: App<Element>) {
  app.use(router);
}
```
::: warning 注意
后端接口返回的数据中必须包含PageEnum.BASE_HOME_PATH指定的路由
:::

然后动态路由部分，我们通过 getMenuList 接口获取数据，并对接口数据进行处理使它转化成路由

详细代码在 `/@/store/modules/auth.ts` 中

getMenuListAction 主要代码，如下所示
```ts
let routeList: AppRouteRecordRaw[] = [];
//判断是否开启动态路由
if (productConfig.isDynamicAddedRoute) {
  const { data } = await getMenuList();
  routeList = menuToRoute(data.list);
} else {
  routeList = await getStaticRoutes();
}
// 重置路由
resetRouter();
routeList.forEach(route => {
  router.addRoute(route as RouteRecordRaw);
});
// 对菜单进行排序
routeList.sort((a, b) => {
  return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
});
this.dynamicRoutes = routeList;
```

## 细粒度权限

通过对涉及权限按钮进行逐个编码，生成一个权限编码表存于后端，然后在通过接口去获取对应用户的权限编码数组，在实际页面中只需要去判断，当前页面的权限按钮是否存在此数组中即可实现按钮权限的控制。

项目封装了自定义指令来快捷判断出对应按钮的权限

通常，这些编码只需要在登录后获取一次即可。

```ts
async getPermCodeListAction(): Promise<string[] | unknown> {
  try {
    const { data } = await getPermCodeList();
    this.permCodeList = data;
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
},
```

指令代码如下所示：

```vue
<el-button v-auth="'1000'" type="primary"> 拥有code ['1000']权限可见 </el-button>
```