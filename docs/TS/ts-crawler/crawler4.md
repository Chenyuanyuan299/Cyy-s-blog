# TypeScript + Express 爬虫实战（四）

本阶段进行前端界面的开发，使用的技术栈是 React。首先要考虑应该有一些什么样的功能，由于只是一个爬虫小项目，可以考虑一个页面用于可视化，然后一个页面进行登录，即对之前后端粗糙的两个页面进行改造。

## 初始化 React 前端项目

首先安装 CRA 脚手架，并通过脚手架初始化项目：npx create-react-app ts-crawler-fe --template typescript --use-npm

在该项目的 src 下创建文件夹 Pages，并创建 Home 和 Login 文件夹用于存放组件，并保留三个初始文件：

```tsx
// index.tsx
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

```tsx
// App.tsx
import React from 'react';

const App: React.FC = () => {
  return (
    <div>hello world</div>
  );
}

export default App;
```

```typescript
// react-app-env.d.ts
/// <reference types="react-scripts" />
```

## 编写登录表单及主页

之前的表单等东西写在后端，现在把它们分离出来。可以通过现有的组件库写一个好看的表单，我们使用 Ant Design of React：`npm install antd --save`。

在 Login 文件夹下创建 index.tsx，在 antd 上找一个好看的表单组件复制代码，并且创建 style.css：

```tsx
// Login/index.tsx
import { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import './style.css';

class NormalLoginForm extends Component {
  render() {
    return (
      <div className="login-page">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
        >
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
};

export default NormalLoginForm;
```

```css
// Login/style.css
.login-page { 
  width: 300px;
  padding: 20px 20px 0 20px;
  margin: 100px auto;
  border: 1px solid #ccc;
}
```

在 Home 文件夹下创建 index.tsx，并且创建 style.css：

```tsx
// Home/index.tsx
import { Component } from 'react';
import { Button, message } from 'antd';
import './style.css';

// const Home: () => JSX.Element = () => {};
// const Home: React.FC = () => {};
class Home extends Component {
  render() {
  	return (
    	<div className="home-page">
         	<div className="buttons">
            	<Button type="primary">爬取内容</Button>
            	<Button type="primary">退出</Button>
      		</div>
      	</div>
    )
  }
}

export default Home;
```

```css
// Home/style.css
.home-page {
  padding: 0 50px;
}
.home-page .buttons {
  width: 256px;
  margin: 30px auto;
  padding: 20px;
}
.home-page .ant-btn {
  width: 88px;
  margin: 10px;
}
```

## 实现路由跳转和发送 Ajax 请求

首先安装一些包：

- `npm install react-router-dom --save`：<Redirect to="xxx"\> 可以实现路由跳转。

- `npm install  @types/react-router-dom -D `：react-router-dom 的类型注解文件。

- `npm install axios --save`：使用 axios 发送 Ajax 请求。

- `npm install qs --save`：可以将对象转为 url 参数形式。
- `npm install @types/qs -D`：qs 的类型注解文件。

然后需要在 `package.json` 中配置代理：`"proxy": "http://localhost:7001"`，这样前端就可以访问后端的端口了。

接下来在之前的两个组件中使用 Ajax 请求数据：

```tsx
// Login/index.tsx
import { Component } from 'react';
import { Redirect } from 'react-router';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import request from '../../request';
import qs from 'qs';
import './style.css';

interface formFields {
  password: string;
}
class NormalLoginForm extends Component {
  state = {
    isLogin: false
  }
  onFinish = (values:formFields) => {
    request.post('/api/login', qs.stringify({
      password: values.password
    }), {
      headers: {
        // 该编码格式为key=value&key=value  
        "Content-Type": "application/x-www-form-urlencoded" 
      }
    }).then((res) => {
      const data: responseResult.login = res.data;
      if(data) {
        this.setState({
          isLogin: true
        });
        message.success("登录成功！");
      } else {
        message.error("密码错误！");
      }
    })
  };
  render() {
    const { isLogin } = this.state;
    // 判断是否登录，若登录进行路由跳转
    return isLogin ? <Redirect to="/" /> : (
      <div className="login-page">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
        >
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
};

export default NormalLoginForm;
```

```tsx
// Home/index.tsx
import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import request from '../../request';
import './style.css';

interface State {
  isLogin: boolean;
  loaded: boolean;
  data: responseResult.DataStructure;
}

class Home extends Component {
  state: State = {
      isLogin: true,
      loaded: false,
      data: {}
  };

  componentDidMount() {
    request.get('/api/isLogin').then((res) => {
      const data: responseResult.isLogin = res.data;
      if(!data) {
        this.setState({
          isLogin: false,
          loaded: true
        });
      } else {
        this.setState({
          loaded: true
        });
      }
    });

    request.get('/api/showData').then((res) => {
      const data: responseResult.DataStructure = res.data;
      if(data) {
        this.setState({
          data
        });
      }
    });
  }

  handleLogoutClick() {
    request.get('/api/logout').then((res) => {
      const data: responseResult.logout = res.data;
      if(data) {
        this.setState({
          isLogin: false
        });
        message.success("退出成功！");
      }
    });
  }

  handleCrawlerClick() {
    request.get('/api/getData').then((res) => {
      const data: responseResult.getData = res.data;
      if(data) {
        message.success("爬取成功！");
      }
    })
  }

  render() {
    const { isLogin, loaded } = this.state;
    if(isLogin) {
      if(loaded) {  
        return (
          <div className="home-page">
            <div className="buttons">
              <Button type="primary" onClick={this.handleCrawlerClick.bind(this)}>爬取内容</Button>
              <Button type="primary" onClick={this.handleLogoutClick.bind(this)}>退出</Button>
            </div>
          </div>
        )
      } 
      return null;
    }
    return (<Redirect to="/login" />)
  };
}

export default Home;
```

其中，request 包是对 axios 的一层简单封装，它的文件放在 src 下：

```typescript
// src/request.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: '/'
});

instance.interceptors.response.use(response => {
  return response.data;
})

export default instance;
```

responseResult 是一个类型注解文件，如果前后端都用 ts 来写，那么其实可以对它们交互的数据的类型进行统一封装：

```typescript
// src/responseResult.d.ts
// .d.ts文件不需要引入，直接使用
declare namespace responseResult {
  interface CourseItem {
    title: string;
    count: number;
  }
  
  interface DataStructure {
    [key: string]: CourseItem[];
  }
  type isLogin = boolean;
  type login = boolean;
  type logout = boolean;
  type getData = boolean;
  type showData = boolean | DataStructure;
}
```

最后记得在 App.tsx 引入这两个组件：

```tsx
// src/App.tsx
import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import LoginPage from './Pages/Login';
import HomePage from './Pages/Home';

const App:React.FC = () => {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/login" exact component={LoginPage} />
        </Switch>
      </HashRouter>
    </div>);
}

export default App;
```

## 数据可视化处理

对于爬取到的数据，我们可以将它可视化，用折线图展示，可以使用 ECharts，安装以下的包：

- `npm install --save echarts`：基于 JavaScript 的开源可视化图表库。
- `npm install @type/echarts -D`：echarts 的类型注解文件。

- `npm install --save echarts-for-react`：在 react 中使用 ECharts。
- ` npm install moment --save`：可以处理一些时间，本项目中用于处理时间戳。

然后就可以在 Home 中加入可视化部分了：

```tsx
// Home/index.tsx
import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, message } from 'antd';
import { EChartsOption, SeriesOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import request from '../../request';
import moment from 'moment';
import './style.css';

interface State {
  isLogin: boolean;
  loaded: boolean;
  data: responseResult.DataStructure;
}

class Home extends Component {
  state: State = {
      isLogin: true,
      loaded: false,
      data: {}
  };

  componentDidMount() {
    request.get('/api/isLogin').then((res) => {
      const data: responseResult.isLogin = res.data;
      if(!data) {
        this.setState({
          isLogin: false,
          loaded: true
        });
      } else {
        this.setState({
          loaded: true
        });
      }
    });

    request.get('/api/showData').then((res) => {
      const data: responseResult.DataStructure = res.data;
      if(data) {
        this.setState({
          data
        });
      }
    });
  }

  handleLogoutClick() {
    request.get('/api/logout').then((res) => {
      const data: responseResult.logout = res.data;
      if(data) {
        this.setState({
          isLogin: false
        });
        message.success("退出成功！");
      }
    });
  }

  handleCrawlerClick() {
    request.get('/api/getData').then((res) => {
      const data: responseResult.getData = res.data;
      if(data) {
        message.success("爬取成功！");
      }
    })
  }

  getOption : () => EChartsOption = ()   => {
    const { data } = this.state;
    const courseNames: string[] = [];
    const times: string[] = [];
    const tempData: {
      [key: string]: number[];
    } = {};
    for(let i in data) {
      const item = data[i];
      times.push(moment(Number(i)).format('MM-DD HH:mm'));
      item.forEach(innerItem => {
        const { title, count } = innerItem;
        if(courseNames.indexOf(title) === -1) {
          courseNames.push(title);
        }
        tempData[title] ? tempData[title].push(count) : (tempData[title] = [count])
      })
    }
    const result: SeriesOption[] = [];
    for(let i in tempData) {
      result.push({
        name: i,
        type: 'line',
        data: tempData[i]
      })
    }
    return {
      title: {
          text: '课程在线学习人数'
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data: courseNames

      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: times
      },
      yAxis: {
          type: 'value'
      },
      series: result
    };
  }

  render() {
    const { isLogin, loaded } = this.state;
    if(isLogin) {
      if(loaded) {  
        return (
          <div className="home-page">
            <div className="buttons">
              <Button type="primary" onClick={this.handleCrawlerClick.bind(this)}>爬取内容</Button>
              <Button type="primary" onClick={this.handleLogoutClick.bind(this)}>退出</Button>
            </div>
            <ReactECharts option={this.getOption()} />
          </div>
        )
      } 
      return null;
    }
    return (<Redirect to="/login" />)
  };
}

export default Home;
```

## 项目完善和上传

最后，还要对后端的代码做一些调整，主要是删除一些拆分到前端的代码，还有对返回的端口中数据类型的完善。

```typescript
// src/controller/CrawlerController.ts
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

// 对访问所有操作的登录状态进行管理
const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  const isLogin = !!(req.session ? req.session.login : false);
  if(isLogin) {
    // 登录后才可以进行下一步操作
    next();
  } else {
    res.json(getResponseData(null, '请登录'));
  }
}

@controller('/api')
export class CrawlerController {
  @get('/getData')
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    const secret = 'x3b174jsx'; // 此处是鉴权部分，secret 要写  Dell 老师给的
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = DellAnalyzer.getInstance();
    new Crawler(url, analyzer);
    res.json(getResponseData<responseResult.getData>(true));
  };

  @get('/showData')
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, '../../data/course.json');
      const result = fs.readFileSync(position, 'utf8');
      res.json(getResponseData<responseResult.showData>(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData<responseResult.showData>(false, '数据不存在'));
    }
  };
}
```

```typescript
// src/controller/LoginController.ts
import 'reflect-metadata'; 
import { Request, Response } from 'express';
import { controller, get, post } from '../decorator';
import { getResponseData } from '../utils/util';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

@controller('/api')
export class LoginController {
  static isLogin(req: BodyRequest): boolean {
    return !!(req.session ? req.session.login : false)
  }

  @get('/isLogin')
  isLogin(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);
    const result = getResponseData<responseResult.isLogin>(isLogin)
    res.json(result);
  }

  @post('/login')
  login(req: BodyRequest, res: Response): void {
    const { password } = req.body;
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.json(getResponseData<responseResult.login>(true));
    } else {
      if (password === '123' && req.session) {
        req.session.login = true;
        res.json(getResponseData<responseResult.login>(true));
      } else {
        res.json(getResponseData<responseResult.login>(false, '密码错误！'));
      }
    }
  };

  @get('/logout')
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData<responseResult.logout>(true));
  };
}
```

至此，整个爬虫小项目完毕。最后一步是将代码上传到 Github 仓库。当然之前也可以边做边上传。在 GitHub 上创建两个仓库，分别存放前后端的代码，使用 git 工具将代码上传。

- `git init`：初始化本地仓库。
- `git add .`：将修改操作的文件和未跟踪新添加的文件添加到 git 系统暂存区。
- `git commit -m "xxx"`：将暂存区中的内容添加到本地仓库中。
- `git remote add origin git@github.com:Chenyuanyuan299/ts-crawler-fe.git`：将本地仓库和远程仓库做连接。
- `git pull(git fetch + git merge)`：拉取远程仓库的代码并与本地代码合并。
- `git push -f -u origin master`：将本地的 master 分支推送到 origin 主机的 master 分支。

本项目主要学习了 TS 在前后端中的用法，以及了解了前后端的项目是如何交互，同时也学习了很多工具的使用，后续可能会回顾做一些新的总结。

















