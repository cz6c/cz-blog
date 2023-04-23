# 配置jwt鉴权

目录
[[toc]]

## 安装 express-jwt、jsonwebtoken

```shell
npm i express-jwt
npm i jsonwebtoken
```

## 注入jwt

在 routes 文件夹 index.ts 中 注入jwt模块： 

```ts
import express from "express";
import { PRIVATE_KEY } from "../utils/constant";
import { expressjwt } from "express-jwt";

const router = express.Router();

// 注入jwt认证模块
router.use(
  expressjwt({
    // 设置密钥
    secret: PRIVATE_KEY,
    //algorithms 防止潜在的降级攻击所必需的。⚠️ 不要混合使用对称和非对称（即 HS256/RS256）算法：在没有进一步验证的情况下混合算法可能会导致降级漏洞。
    algorithms: ["HS256"],
    // 设置jwt认证白名单，比如/api/login登录接口不需要拦截
  }).unless({
    path: ["/login"],
  })
);

export default router;
```

## 生成token

在登录接口中通过查询到的用户信息生成token：

```ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/users";
import { PRIVATE_KEY, JWT_EXPIRED, CODE_SUCCESS } from "../utils/constant";

export default class AuthController {
  /**
   *  jwt.sign({ id: username }, 'my_token',{ expiresIn: '6h' }) }
   *  调用 jsonwebtoken 的 sign() 方法来生成token，接收三个参数，
   *  第一个是载荷，用于编码后存储在 token 中的数据，也是验证 token 后可以拿到的数据；
   *  第二个是密钥，自己定义的，验证的时候也是要相同的密钥才能解码；
   *  第三个是options，可以设置 token 的过期时间。
   */
  public static async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    const item: any = await UserModel.findAll({
      where: {
        username: username,
      },
    });
    if (!item[0]) {
      next(new Error("用户不存在"));
    } else if (item[0].password === password) {
      res.json({
        code: CODE_SUCCESS,
        msg: "登录成功",
        data: jwt.sign({ id: item[0].id }, PRIVATE_KEY, {
          expiresIn: JWT_EXPIRED,
        }),
      });
    } else {
      next(new Error("密码错误"));
    }
  }
}
```

## 解析token

在 utils 文件下 新建 auth_jwt.ts ，封装解析 token 工具函数：

```ts
import jsonwebtoken from "jsonwebtoken";
import { Request } from "express";
import { PRIVATE_KEY } from "./constant";

// 解析token
export function decode(req: Request) {
  const Authorization = req.get("Authorization");
  const arr = Authorization.split(" ");
  const token = arr[1];
  return jsonwebtoken.verify(token, PRIVATE_KEY);
}
```

在需要使用用户信息来查询对于数据时，调用该函数解析token：

```ts
import { Request, Response, NextFunction } from "express";
import { CODE_SUCCESS } from "../utils/constant";
import { decode } from "../utils/auth_jwt";
import UserModel from "../models/users";

export default class userController {
  public static async info(req: Request, res: Response, next: NextFunction) {
    const jwtPayload: any = decode(req);
    try {
      const item = await UserModel.findAll({
        attributes: { exclude: ["password"] }, //过滤掉password字段
        where: {
          id: jwtPayload.id,
        },
      });
      if (!item[0]) {
        next(new Error("用户不存在"));
      } else {
        res.json({
          code: CODE_SUCCESS,
          msg: "success",
          data: item[0],
        });
      }
    } catch (err) {
      console.log(err);
      next(new Error(err));
    }
  }
}
```

