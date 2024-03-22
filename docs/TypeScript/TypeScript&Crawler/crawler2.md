# TypeScript + Express 爬虫实战（二）

## 搭建 Express 并写简单路由

接下来使用 Express 搭建一个服务器，并对之前写过的代码进行重构。

使用 `npm install express --save` 安装 Express，同时安装类型注解文件：`npm install @types/express -D`。

在 src 下创建两个新的文件：

```typescript
// index.ts
import express from 'express';
import router from './router';

const app = express();
app.use(router); // 导入并使用路由

app.listen(7001, () => { // 监听端口
  console.log('server is running');
})
```

```typescript
// router.ts
import { Router, Request, Response } from 'express';
import Crawler from './crawler';
import dellAnalyzer from './dellAnalyzer';

const router = Router();
router.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});

router.get('/getData', (req: Request, res: Response) => {
  // 把爬虫实例的创建和数据处理实例的创建放到此处
  const secret = 'x3b174jsx'; // 此处是鉴权部分，secret 要写  Dell 老师给的
  const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
  const analyzer = dellAnalyzer.getInstance();
  new Crawler(url, analyzer);
  res.send('getData Success');
});

export default (router); // 记得导出路由
```

首先创建一个 express 实例，然后导入路由，通过每次发起请求，让爬虫自动工作并把数据写入 data 下的 course.json 文件。

> 用 TS 写最主要的是要注意 req 和 res 的类型定义，可以去类型注解文件里面找它们的类型定义。

## TS 编写 Express 的一些问题

如果别人可以访问 /getData 路由，每一次刷新 course.json 就多一条数据，会有安全问题，可以写一个简单鉴权：

```typescript
// router.ts
// 在根目录下创建一个表单
router.get('/', (req: Request, res: Response) => { 
  res.send(
    `<html>
      <body>
        <form method="post" action="/getData">
          <input type="password" name="password" />
          <button>登录</button>
        </form>
      </body>
    </html>`
  );
});
```

通过 req.body 来获取 input 中的数据，但是会报错：`TypeError: Cannot read property 'password' of undefined`，这是因为 Express 历史比较悠久，类型注解文件并没有对 req.body 做好处理，它的类型是 any：`const a = req.body; // a: any`。这时候需要下载一个中间件：body-parser：`npm install body-parser --save`，该中间件可以提前解析请求中的内容，更新 index.ts 文件：

```typescript
import express from 'express';
import bodyParser from 'body-parser';
import router from './router';

const app = express();
app.use(bodyParser.urlencoded({ extended: false })); // 一定要放在导入路由之前，先解析，后使用。
app.use(router);

app.listen(7001, () => {
  console.log('server is running');
})
```

> 目前 bodyParser 已经被弃用，可以直接使用 express 调用：`app.use(express.urlencoded({ extended: false }));`。

总结：使用 TS 写 express 的时候有两个问题：

- express 库的类型定义文件 .d.ts 文件不准确；
- 当使用中间件的时候，对 req 或 res 做了修改，类型并不能改变。

## 解决 Express 的类型定义文件问题

上面的第一个问题可以用接口解决，接口继承 Request，并对它进行一些拓展，这样就可以正常使用 req.body 了：

```typescript
// router.ts
interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined
  };
}
```

第二个问题，假如我们在 index.ts 里面写一个简单的中间件：

```typescript
app.use((req: Request, res: Response, next: NextFunction) => {
  req.teacherName = 'Wang';
  next();
});
```

由于 Request 类型里并没有 teacherName 属性，解决方法是使用类型融合，在 src 下创建一个新的文件 custom.d.ts：

```typescript
// 类型融合：该文件会和 express 的库类型定义文件进行融合
declare namespace Express {
  interface Request {
    teacherName: string;
  }
}
```

我自己目前的总结是：修改 .d.ts 文件不准确的类型定义时，使用接口继承的方式；

要添加新的属性并修改类型的时候，使用类型融合的方式编写新的 .d.ts 文件。

## 登录登出功能的开发及接口设置

首先安装一个中间件 cookie-session 帮助完成登录的功能：`npm install cookie-session --save`，同样的安装类型注解文件：`npm install @types/cookie-session -D`。在 index.ts 引入路由之前引入并使用该中间件：

```typescript
// index.ts
import cookieSession from 'cookie-session';
app.use(
  cookieSession({
    name: 'session', // Cookie的名称
    keys: ['teacher Wang'], // 用于签名和验证Cookie值的键列表
    maxAge: 24 * 60 * 60 * 1000 // 有效时间
  })
)
```

在 src 下创建一个文件夹 utils，将 crawler.ts、dellAnalyzer.ts 移入，并创建一个新的文件，该文件的作用是统一接口数据结构：

```typescript
// util.ts
interface Result {
  success: boolean; // 操作是否成功
  errMsg?: string; // 错误信息
  data: any; // 返回的数据

}

export const getResponseData = (data: any, errMsg?: string): Result => {
  if (errMsg) {
    return {
      success: false,
      errMsg,
      data
    };
  }
  return {
    success: true,
    data
  };
}
```

新的 router.ts 文件：

```typescript
import fs from 'fs';
import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import Crawler from './utils/crawler';
import DellAnalyzer from './utils/dellAnalyzer';
import { getResponseData } from './utils/util';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

// 对访问所有操作的登录状态进行管理
const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if(isLogin) {
    // 登录后才可以进行下一步操作
    next();
  } else {
    res.json(getResponseData(null, '请登录'));
  }
}

const router = Router();

router.get('/', (req: BodyRequest, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send(` 
      <html>
        <body>
          <a href='/getData'>爬取内容</a>
          <a href='/showData'>展示内容</a>
          <a href='/logout'>退出</a>
        </body>
      </html>
    `);
  } else {
    res.send(`
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password" name="password" />
            <button>登陆</button>
          </form>
        </body>
      </html>
    `);
  }
});

router.get('/logout', (req: BodyRequest, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.json(getResponseData(true));
});

router.post('/login', (req: BodyRequest, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.json(getResponseData(false, '已经登录过'));
  } else {
    if (password === '123' && req.session) {
      req.session.login = true;
      res.json(getResponseData(true));
    } else {
      res.json(getResponseData(false, '登录失败'));
    }
  }
});

router.get('/getData', checkLogin, (req: BodyRequest, res: Response) => {
  const secret = 'x3b174jsx'; // 此处是鉴权部分，secret 要写  Dell 老师给的
  const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
  const analyzer = DellAnalyzer.getInstance();
  new Crawler(url, analyzer);
  res.json(getResponseData(true));
});

router.get('/showData', checkLogin, (req: BodyRequest, res: Response) => {
  try {
    const position = path.resolve(__dirname, '../data/course.json');
    const result = fs.readFileSync(position, 'utf8');
    res.json(getResponseData(JSON.parse(result)));
  } catch (e) {
    res.json(getResponseData(false, '数据不存在'));
  }
});

export default router;
```



