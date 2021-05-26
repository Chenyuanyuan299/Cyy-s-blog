# TypeScript + Express 爬虫实战（一）

如题，打算爬取 Dell 老师的一个个人小网页。主要是想顺便学习一下相关的知识。爬取的[网页地址](http://www.dell-lee.com/typescript/demo.html?secret=xxxxxxxx)，secret 可能会变动。 

项目初始化：`npm init -y`，生成 `package.json` 文件，运行 `npm install typescript -D`，引入 TypeScript，再运行 `tsc --init`，生成 `tsconfig.json` 文件，最后运行 `npm install -D ts-node` ，将 `ts-node` 引入 `package.json`。

创建 src 文件夹，创建一个 `crawler.ts` 文件，并在 `package.json` 的 script中加入 `"dev" : "ts-node ./src/crawler.ts"`。 

项目初始化完成，开始进行爬虫代码编写。

## 获取页面 html

首先要引入 superagent，用于获取网页 html 的内容：`npm install superagent --save`。superagent 可以用于node.js 里发送 ajax 请求。由于 superagent 是用 JS 写的，TS 并不能直接读取，需要类型注解文件来进行“翻译”，运行 `npm install @types/superagent -D` 获取。

```typescript
// ts -> .d.ts 翻译文件 -> js
import superagent from 'superagent';

class Crawler {
    private secret = 'x3b174jsx'; // 此处是鉴权部分，secret 要写 Dell 老师给的
    private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
    private rawHtml = '';

    // 异步请求数据
    async getRawHtml() {
        const result = await superagent.get(this.url);
        this.rawHtml = result.text; // 页面的HTML文件
    }; 

    constructor() {
        this.getRawHtml();
    }
}

const crawler = new Crawler();
```

## 对 html 文件中的数据进行处理

需要用到 cheerio 工具分析：`npm install cheerio --save`。同样的，我们还需要安装类型注解文件：`npm install @types/cheerio -D`

进一步优化代码，对数据进行处理并显示：

```typescript
import superagent from 'superagent';
import cheerio from 'cheerio';

interface Course {
	title: string;
	count: number;
}

class Crawler {
    private secret = 'x3b174jsx'; // 此处是鉴权部分，secret 要写  Dell 老师给的
    private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;

    getCourseInfo(html: string) {
        const $ = cheerio.load(html); // 解析 html
        const courseItems = $('.course-item'); // 选择器，获取对应类中的数据
		const courseInfos: Course[] = [];

        courseItems.map((index, element) => { // 解析数据
            const descs = $(element).find('.course-desc'); // 进一步选择数据
            const title = descs.eq(0).text(); // 使用eq进行精确选择
            const count = parseInt(descs.eq(1).text().split('：')[1], 10);
			courseInfos.push({
				title, count
			})
        });

		return { // 返回封装结果
			time: (new Date()).getTime(), // 获取当前时间对应人数 
			data: courseInfos
		}
    }

    // async getRawHtml() { // 耦合代码不好
    //     const result = await superagent.get(this.url);
    //     this.getCourseInfo(result.text)
    // }; 
    async getRawHtml() { // 解耦
        const result = await superagent.get(this.url);
        return result.text;
    };

    async initSpiderProcess() {
        const html = await this.getRawHtml();
        const result = this.getCourseInfo(html);
        console.log(result);
    }

    constructor() {
        this.initSpiderProcess();
    }
}

const crawler = new Crawler();
```

## 将处理后的数据存入 JSON 文件

我们重新修改一下代码，创建一个新的函数用于将数据转换为 JSON 形式并存入 JSON 文件。新建一个 data 文件夹，通过代码来生成文件。

```typescript
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import cheerio from 'cheerio';

interface Course {
  title: string;
  count: number;
}

interface courseResult {
  time: number;
  data: Course[];
}

interface Content {
  [propName: number]: Course[]; // 时间戳：{ 标题：人数 }
}

class Crawler {
  private secret = 'x3b174jsx'; // 此处是鉴权部分，secret 要写  Dell 老师给的
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
  private filePath = path.resolve(__dirname, '../data/course.json'); // 爬到的数据存储地

  getCourseInfo(html: string) {
    const $ = cheerio.load(html); // 解析 html
    const courseItems = $('.course-item'); // 选择器，获取对应类中的数据
    const courseInfos: Course[] = [];

    courseItems.map((index, element) => {
      // 解析数据
      const descs = $(element).find('.course-desc'); // 进一步选择数据
      const title = descs.eq(0).text(); // 使用eq进行精确选择
      const count = parseInt(descs.eq(1).text().split('：')[1], 10);
      courseInfos.push({
        title,
        count
      })
    })

    return {
      // 返回封装结果
      time: new Date().getTime(), // 获取当前时间对应人数
      data: courseInfos
    }
  }

  async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  generateJsonContent(result: courseResult) {
    let fileContent: Content = {}; // 初始化内容
    if (fs.existsSync(this.filePath)) { // 判断文件是否存在，如果存在就取出到 fileContent 中
      fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    }
    fileContent[result.time] = result.data; // 将新的数据存入 fileContent
    return fileContent;
  }

  // 将 fileContent 转为字符串并写入对应路径下的文件
  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content); 
  }

  async initSpiderProcess() {
    const html = await this.getRawHtml();
    const result = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(result);
    this.writeFile(JSON.stringify(fileContent));
  }

  constructor() {
    this.initSpiderProcess();
  }
}

const crawler = new Crawler();
```

## 使用组合设计模式优化代码

实际上爬取网页，除了读取 html 的操作和将处理后的数据写入文件的操作一样，具体怎么处理数据是不一样的，所以这一步对代码进行拆分，将一样的操作放在一个文件里，具体分析的操作放在另外一个文件里。

在 src 下创建一个新的文件 `dellAnalyzer.ts`，用于对爬到的数据进行操作，而原来的 `crawler.ts` 主要用于爬取网页和写入数据。

同时，对类中的方法做一些规范，并且使用单例模式对 DellAnalyzer 进行规范。

```typescript
// 新的 crawler.ts
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import dellAnalyzer from './dellAnalyzer';

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crawler {
  private filePath = path.resolve(__dirname, '../data/course.json'); // 爬到的数据存储地

  private async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }
  // 将 fileContent 转为字符串并写入对应路径下的文件
  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content); 
  }

  private async initSpiderProcess() {
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }

  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess();
  }
}
const secret = 'x3b174jsx'; // 此处是鉴权部分，secret 要写  Dell 老师给的
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

const analyzer = dellAnalyzer.getInstance();
new Crawler(url, analyzer);
```

```typescript
// dellAnalyzer.ts
import cheerio from 'cheerio';
import fs from 'fs';
import { Analyzer } from './crawler';

interface Course {
  title: string;
  count: number
}

interface courseResult {
  time: number;
  data: Course[]
}

interface Content {
  [propName: number]: Course[]; // 时间戳：{ 标题：人数 }
}

export default class DellAnalyzer implements Analyzer {
	private static instance: DellAnalyzer;
	static getInstance() { // 该方法直接挂在类上面
		if(!this.instance) { 
			this.instance = new DellAnalyzer()
		}
		return this.instance;
	}

	private getCourseInfo(html: string) {
		const $ = cheerio.load(html); // 解析 html
		const courseItems = $('.course-item'); // 选择器，获取对应类中的数据
		const courseInfos: Course[] = [];

		courseItems.map((index, element) => { // 解析数据
			const descs = $(element).find('.course-desc'); // 进一步选择数据
			const title = descs.eq(0).text(); // 使用eq进行精确选择
			const count = parseInt(descs.eq(1).text().split('：')[1], 10);
			courseInfos.push({ title, count });
		});

		return { // 返回封装结果
			time: new Date().getTime(), // 获取当前时间对应人数
			data: courseInfos
		};
	}

	private generateJsonContent(result: courseResult, filePath: string) {
    let fileContent: Content = {}; // 初始化内容
    if (fs.existsSync(filePath)) { // 判断文件是否存在，如果存在就取出到 fileContent 中
      if(fs.readFileSync(filePath, 'utf-8') != '') {
				fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
			};		
    }
    fileContent[result.time] = result.data; // 将新的数据存入 fileContent
    return fileContent;
  }

	public analyze(html: string, filePath: string) {
		const result = this.getCourseInfo(html);
		const fileContent = this.generateJsonContent(result, filePath);
		return JSON.stringify(fileContent);
	}

	private constructor() {}
}
```

## 项目开发管理

日常中，我们分享出去的应该是 JS 文件而不是 TS 文件，所以我们应该对 `package.json` 文件做一些修改。

- 首先删除 script 中的 `"dev" : "ts-node ./src/crawler.ts"` 指令，该指令是运行 .ts 的指令；

- 然后在 script 中加入 `"build": "tsc -w"`，并修改 `tsconfig.json` 中的 `"outDir": "./build"`，`-w` 是实时监听项目中的 .ts 文件，如果发生变化即时编译并更新 build 文件夹下的文件；

- 然后下载 nodemon：`npm install nodemon -D` ，这个工具的作用是当 build 文件夹下发生文件变化时执行一些语句。 在 script 中加入 `"start": "nodemon node ./build/crawler.js"`，表示当 build 文件夹发生变动，就执行 node 语句编译该 .js 文件。因为它会一直循环执行，所以我们要在 `package.json` 中加入：

  ```typescript
    "nodemonConfig": {
      "ignore": [
        "data/*"
      ]
    }
  ```

然后，我们首先在命令行终端里执行 `npm run build`，开启实时监听编译 .ts 文件，然后新开一个命令行终端执行 `npm run start`，监听编译后的文件夹 build 的变化并做出相应处理。现在，我们可以实时监听项目的变化了。

开两个命令行终端或许会有些麻烦，我们装一个新的工具 concurrently：`npm install concurrently -D`，用来并行执行上面两条命令。然后修改 `package.json` 的 `script`：

```typescript
"scripts": {
    "dev:build": "tsc -w",
    "dev:start": "nodemon node ./build/crawler.js",
    "dev": "concurrently npm:dev:*"
}
```

现在，我们可以直接通过 `npm run dev` 来运行了。最后修改 `package-json` 里的 dev 为 `"tsc && concurrently npm:dev:*"`，这样当我们运行 `npm run dev` 就会先编译再运行，否则可能出现还没编译就运行导致报错。

