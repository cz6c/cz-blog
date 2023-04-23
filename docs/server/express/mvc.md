# 基于mvc模型，进行模块化接口开发

目录
[[toc]]

## mvc模型

将应用程序划分为三种组件，模型 - 视图 - 控制器（MVC）设计定义它们之间的相互作用

- 模型（Model） 用于封装与应用程序的业务逻辑相关的数据以及对数据的处理方法。Model 有对数据直接访问的权力，例如对数据库的访问。“Model”不依赖“View”和“Controller”，也就是说， Model 不关心它会被如何显示或是如何被操作。但是 Model 中数据的变化一般会通过一种刷新机制被公布。为了实现这种机制，那些用于监视此 Model 的 View 必须事先在此 Model 上注册，从而，
View 可以了解在数据 Model 上发生的改变。（比如：观察者模式）

- 视图（View）能够实现数据有目的的显示（理论上，这不是必需的）。在 View 中一般没有程序上的逻辑。为了实现 View 上的刷新功能，View 需要访问它监视的数据模型（Model），因此应该事先在被它监视的数据那里注册。

- 控制器（Controller）起到不同层面间的组织作用，用于控制应用程序的流程。它处理事件并作出响应。“事件”包括用户的行为和数据 Model 上的改变。


## 基于mvc模型封装，

将在src 目录下，创建controllers， models，routes三个文件夹目录


### models链接数据库

::: tip 注：前提条件
本地已安装配置mysql 数据库，为了方便的理解下面的代码，建议创建一个同名的数据库 sequelize_db
:::

安装 mysql 数据库，sequelize 操作数据库

```shell
npm i mysql2 sequelize
```

初始化数据库，在src目录下新建 config 文件夹，并在文件夹下新建 db.ts，代码如下：

```ts
import { Sequelize } from "sequelize";

const db = new Sequelize("sequelize_db", "root", "123456", {
  host: "127.0.0.1", //数据库地址,默认本机
  port: 3306, //端口，默认3306
  dialect: "mysql", //数据库类型
  pool: {
    //连接池设置
    max: 5, //最大连接数
    min: 0, //最小连接数
    idle: 10000,
  },
});

export default db;
```

验数据库是否连接成功在 app.ts 文件中，写入以下代码，运行项目在控制台看结果

```ts
// 验证数据库是否连接成功
app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
```

创建数据库映射模型，以 user 模块为例，在 models 目录下创建 user.ts 文件，

配置 users 表，并把模型暴露出去，代码如下：

```ts
import { DataTypes } from "sequelize";
import db from "../config/db";

// Define schema
const UserModel = db.define(
  "users",
  {
    // Define attributes
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false, // 不要默认时间戳
    // Freeze Table Name
    freezeTableName: true,
  }
);

// Export model Product
export default UserModel;
```

### controllers操作数据库

处理业务逻辑，以 user 模块为例，在 controllers 目录下创建 user.ts 文件，实现用户的增删改查逻辑，代码如下：

```ts
import { Request, Response, NextFunction } from "express";
import { CODE_SUCCESS } from "../utils/constant";
import UserModel from "../models/users";

export default class userController {

  public static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await UserModel.findAll();
      res.json({
        code: CODE_SUCCESS,
        msg: "success",
        data: list,
      });
    } catch (err) {
      console.log(err);
      next(new Error(err));
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      await UserModel.create(req.body);
      res.json({
        code: CODE_SUCCESS,
        msg: "success",
      });
    } catch (err) {
      console.log(err);
      next(new Error(err));
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      await UserModel.update(req.body, {
        where: {
          id: req.body.id,
        },
      });
      res.json({
        code: CODE_SUCCESS,
        msg: "success",
      });
    } catch (err) {
      console.log(err);
      next(new Error(err));
    }
  }

  public static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      await UserModel.destroy({
        where: {
          id: req.body.id,
        },
      });
      res.json({
        code: CODE_SUCCESS,
        msg: "success",
      });
    } catch (err) {
      console.log(err);
      next(new Error(err));
    }
  }
}
```

### routes路由模块化

创建目录结构，在routes目录下 ，创建index.ts ，并创建 modules 文件夹

模块化，在 modules 文件夹中将根据不同业务模块创建对应的 ts 文件用于管理该模块的路由

以 user 模块路由为例，user.ts 中代码如下：

```ts
import express from "express";
import userController from "../../controllers/user";

const router = express.Router();

router.get("/user/list", userController.list);
router.post("/user/create", userController.create);
router.post("/user/update", userController.update);
router.post("/user/destroy", userController.destroy);

export default router;
```

注：代码中的 userController 为业务处理类，类中包含模块各路由的业务处理函数。

将 modules 文件夹目录中所有模块导入到 index.ts 统一进行管理

```ts
import express from "express";
import { CODE_ERROR, CODE_TOKEN_EXPIRED } from "../utils/constant";
import userRouter from "./modules/user";
const router = express.Router();

router.use("/api", userRouter); 

// 自定义统一异常处理中间件
router.use((err, req, res, next) => {
  console.log("err===", err);
  res.json({
    code: err.name === "UnauthorizedError" ? CODE_TOKEN_EXPIRED : CODE_ERROR,
    msg: err.message,
  });
});

export default router;
```

注：代码中统一对路由异常进行封装处理，只要在各模块的路由处理函数中，使用 next(new Error(err)) 抛出错误信息，自定义统一异常处理中间件 就能接收到错误信息，统一处理成接口报错信息返回到客户端

路由注入，在 app.ts 中导入 index.ts 并注入到服务中。

```ts
import express from "express";
import cors from "cors";
import routes from "./routes/index";

const app = express();
const port = 3000;

// 跨域
app.use(cors());

app.use(express.json()); // 解析json数据格式
app.use(express.urlencoded({ extended: true })); // 解析form表单提交的数据application/x-www-form-urlencoded

// 路由
app.use(routes);

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});
```

### utlis 下 constant.ts 代码如下

```ts
const CODE_ERROR = 400; // 请求响应失败c
const CODE_SUCCESS = 200; // 请求响应成功
const CODE_TOKEN_EXPIRED = 401; // 授权失败
const PRIVATE_KEY = "cz6"; // 自定义jwt加密的私钥
const JWT_EXPIRED = 60 * 60 * 6; // 过期时间6小时

export {
  CODE_ERROR,
  CODE_SUCCESS,
  CODE_TOKEN_EXPIRED,
  PRIVATE_KEY,
  JWT_EXPIRED,
};
```


