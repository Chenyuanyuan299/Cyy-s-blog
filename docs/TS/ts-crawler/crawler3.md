# TypeScript + Express 爬虫实战（三）

通过前两节，基本实现了登录功能和路由管理等内容，这部分会引入装饰器和元数据等内容，重新实现项目的路由功能。

原来的路由文件，我们不再进行逻辑部分的书写：

```typescript
import { Router } from 'express';

export default Router();
```

## 引入 controller 拆分路由

在 src 下创建一个文件夹 controller，并创建几个文件，我们将对原来的路由文件进行拆分，登录部分的路由放在 LoginController.ts 文件中，数据的获取及展示放到 CrawlerController.ts 文件中，并在 index.ts 统一将它们导出，具体如下：

```typescript
// controller/CrawlerController.ts
import fs from 'fs';
import path from 'path';
import 'reflect-metadata'; 
import { Request, Response, NextFunction } from 'express';
import { controller, get, use } from '../decorator';
import Crawler from '../utils/crawler';
import DellAnalyzer from '../utils/dellAnalyzer';
import { getResponseData } from '../utils/util';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

// 对访问所有操作的登录状态进行管理，这是一个中间件
const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  const isLogin = !!(req.session ? req.session.login : false);
  if(isLogin) {
    // 登录后才可以进行下一步操作
    next();
  } else {
    res.json(getResponseData(null, '请登录'));
  }
}

@controller('/')
export class CrawlerController {
  @get('/getData')
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    const secret = 'x3b174jsx'; // 此处是鉴权部分，secret要写Dell老师给的
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = DellAnalyzer.getInstance();
    new Crawler(url, analyzer);
    res.json(getResponseData(true));
  };

  @get('/showData')
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, '../../data/course.json');
      const result = fs.readFileSync(position, 'utf8');
      res.json(getResponseData(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData(false, '数据不存在'));
    }
  };
}
```

```typescript
// controller/LoginController.ts
import 'reflect-metadata'; 
import { Request, Response } from 'express';
import { controller, get, post } from '../decorator';
import { getResponseData } from '../utils/util';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

@controller('/')
export class LoginController {
  static isLogin(req: BodyRequest): boolean {
    return !!(req.session ? req.session.login : false)
  }
  @get('/')
  home(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);
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
  };

  @post('/login')
  login(req: BodyRequest, res: Response): void {
    const { password } = req.body;
    const isLogin = LoginController.isLogin(req);
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
  };

  @get('/logout')
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData(true));
  }
}
```

```typescript
// controller/index.ts
export * from './CrawlerController';
export * from './LoginController';
```

## 将装饰器独立出来

现在每个路由都对应一个方法，具体的逻辑并没有很大的改变，然后我们对每个方法使用一个装饰器进行装饰，使每个路由得以正确访问，同时，我们对这两个类 CrawlerController、LoginController 也加上了装饰器，方便对类中的路由进行统一管理。这些装饰器我们放在另一个文件夹中，如下。

在 src 下创建一个新的文件夹 decorator，并且创建几个文件，每一个文件对应一个装饰器：

```typescript
// decorator/controller.ts
// 总控制文件，类的装饰器定义，路由的导入都在此完成
import router from '../router';
import { RequestHandler } from 'express'; 
import { Methods } from './request';

// 使用装饰器工厂，引入root方便对路由进行扩展
export function controller(root: string) { 
  // 此处target的类型是构造函数（写法：new (...args: any[]) => any）
  return function (target: new (...args: any[]) => any) {
    for(let key in target.prototype) {
      const path: string = Reflect.getMetadata('path', target.prototype, key);
      const method: Methods = Reflect.getMetadata('method', target.prototype, key);
      const middlewares: RequestHandler[] = Reflect.getMetadata('middlewares', target.prototype, key);
      const handler = target.prototype[key];
      if(path && method) {
        const fullPath = root === '/' ? path : `${root}${path}`
        if(middlewares && middlewares.length) {
          router[method](fullPath, ...middlewares, handler);
        } else {
          router[method](fullPath, handler);
        }
      }
    }
  };
}
```

其中：

- target.prototype 表示该装饰器装饰的类的原型对象，上面有几个类中定义的方法；

- path 表示该方法对应的路径；

- method 表示该方法请求的类型：get、post等；

- handler 表示方法体；

- middlewares 表示中间件；

```typescript
// decorator/request.ts
// 将请求类型和路由通过元数据的方式绑定在方法上
import { CrawlerController, LoginController } from '../controller'

export enum Methods {
  get = 'get',
  post = 'post'
}

function getRequestDecorator(type: Methods) {
  return function (path: string) {
    return function(target: CrawlerController | LoginController, key: string) {
      // 'path' 键，path 值，target 类的原型对象，key 方法名
      // 即在类的原型对象上的名为key的方法上定义一对元数据
      Reflect.defineMetadata('path', path, target, key);
      Reflect.defineMetadata('method', type, target, key);
    }
  }
}

export const get = getRequestDecorator(Methods.get);
export const post = getRequestDecorator(Methods.post);
```

```typescript
// decorator/use.ts
// 中间件的装饰器文件
import 'reflect-metadata';
import { RequestHandler } from 'express'; 
import { CrawlerController, LoginController } from '../controller'

export function use(middleware: RequestHandler) {
  return function(target: CrawlerController | LoginController, key: string) {
    // 使用数组，将所有中间件通过元数据的方式绑定到对应的方法上
    const originMiddlewares = Reflect.getMetadata('middlewares', target, key) || [];
    originMiddlewares.push(middleware);
    Reflect.defineMetadata('middlewares', originMiddlewares, target ,key);
  }
}
```

同样的，在 index.ts 中统一将它们导出：

```typescript
// decorator/index.ts
export * from './controller';
export * from './use';
export * from './request';
```

现在的 src/index.ts：

```typescript
import express from 'express';
import cookieSession from 'cookie-session';
import './controller/LoginController';
import './controller/CrawlerController';
import router from './router';

const app = express();
// 用于解析 body
app.use(express.urlencoded({ extended: false }));
// 通过该中间件，将Cookie存储在客户端
app.use(
  cookieSession({
    name: 'session', // Cookie的名称
    keys: ['teacher Wang'], // 用于签名和验证Cookie值的键列表
    maxAge: 24 * 60 * 60 * 1000 // 有效时间
  })
)
app.use(router);

app.listen(7001, () => {
  console.log('server is running');
})
```

整个运行过程是，首先执行 index.ts，在 import 的时候将会自动执行  CrawlerController、LoginController，然后它们创建类的时候将会导入装饰器，其中 controller.ts 会设置这些类中的路由，几个装饰器通过挂在类的方法上的元数据进行数据交互，最后方法将会在对应路由下执行，页面被渲染。





