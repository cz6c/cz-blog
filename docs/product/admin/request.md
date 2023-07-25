# 接口请求

项目接口请求使用的是 `Axios`，并对其进行了配置和封装，具体代码在 `/@/utils/request.ts`

## 请求/响应拦截器配置

```ts
// request 拦截器 ==> 对请求参数做处理
service.interceptors.request.use(
  config => {
    config.headers["ctoken"] = config.headers["ctoken"] || getToken();
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  },
);
// response 拦截器 ==> 对响应做处理
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 当请求不为200时，报错
    if (res.code !== 200) {
      if (res.code === -403) {
        // 登录过期或权限变更处理
        const { webLogout } = useAuthStore();
        webLogout();
        router.replace(RouterEnum.BASE_LOGIN_PATH);
        return;
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  error => {
    console.log("err" + error); // for debug
    return Promise.reject(error);
  },
);
```

## 请求方法封装

项目封装了最常用的 `get` 和 `post` 方法，方法需要接收 2 个泛型参数，第一个为 请求参数类型 `P`, 第二个为 响应数据类型 `R`，建议在封装业务接口时传入这两个泛型参数，这样可以使我们得到更好的类型支持。

```ts
// 封装 get post 方法
interface Response<T> {
  code: number; // 状态码
  message: string; // 接口消息
  data: T;
}
export const createGet = <P extends Record<string, any>, R>(url: string, config: AxiosRequestConfig = {}) => {
  return (params?: P): Promise<Response<R>> => {
    return service.request({
      method: "get",
      url,
      params,
      ...config,
    });
  };
};
export const createPost = <P extends Record<string, any>, R>(url: string, config: AxiosRequestConfig = {}) => {
  return (data?: P): Promise<Response<R>> => {
    return service.request({
      method: "post",
      url,
      data,
      ...config,
    });
  };
};
```

## 业务接口封装

代码参考 `/@/api/system/user` 

首先根据接口文档定义好请求参数及响应数据的类型，如下所示

```ts
import { GetListParams, GetListResponse } from "/@/api/public/index.d";
// 详情
export interface UserItem {
  id: number;
  roleId: number | string;
  username: string;
  avatar: string;
  status: 0 | 1;
  isDel: 0 | 1;
}
// 新增/编辑
export interface UserInfo extends Omit<UserItem, "id" | "status" | "isDel"> {
  id?: number;
  status?: 0 | 1;
  isDel?: 0 | 1;
}
// 列表
export type UserListResponse = GetListResponse<UserItem>;
export interface UserListParams extends GetListParams {
  username?: string;
}

```

然后，再进行业务接口的封装

```ts
import { createGet, createPost } from "/@/utils/request";
import { UserListParams, UserListResponse, UserItem, UserInfo } from "./index.d";

// 获取列表
export const getUserListApi = createGet<UserListParams, UserListResponse>("/admin/user/list");
// 获取信息
export const getLoginUserInfoApi = createGet<never, UserItem>("/admin/user/info");
// 新增
export const saveUserApi = createPost<UserInfo, never>("/admin/user/save");
// 编辑
export const updateUserApi = createPost<UserInfo, never>("/admin/user/update");
// 状态切换
export const statusChangeApi = createPost<{ id: number; status: string | number | boolean }, never>(
  "/admin/user/status",
);
// 删除
export const delUserApi = createPost<{ id: number }, never>("/admin/user/del");
```

## 跨域配置

跨域本质是浏览器基于同源策略的一种安全手段，当协议、主机、端口其中一项不相同的时候就会产生跨域。

本地开发时，只需要在 `.env.development` 配置文件中，配置 `VITE_PROXY` 即可，它接收一个二维数组，数组的每一项会自动生成一个代理配置，数组项的第一个值为接口的baseURL，第二个值为后端接口地址

```sh
# 代理
VITE_PROXY = [["/api","https://api.cz6hy9.top"]]
# base api
VITE_BASE_URL = /api
```

## 多个后端地址配置

大致步骤和上面差不多，示例：

```sh
# 代理
VITE_PROXY = [["/api","https://api.cz6hy9.top"],["/test","https://test.cz6hy9.top"]]
```

然后,我们在使用 `createGet` 和 `createPost` 封装业务接口时，可以在第二个参数 `config` 中传入 `baseURL` 覆盖 默认配置的 `baseURL` ，参考下面代码

```ts
export const getUserListApi = createGet<UserListParams, UserListResponse>("/admin/user/list",{ baseURL:"/test" });
```

最后，需要在哪里调用，引入使用即可
