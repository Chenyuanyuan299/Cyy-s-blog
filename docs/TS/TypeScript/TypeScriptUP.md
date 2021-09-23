# TypeScript 语法进阶

## 初探 [tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html)

### tsc

当我们执行 `tsc --init` 时，项目中会生成一个 `tsconfig.json ` 文件，该文件是 .ts 的编译配置文件。如果使用 `tsc xxx.ts` 编译某个 .ts 文件，并不会使用到配置文件（`ts-node` 可以），只有单独使用 `tsc` 才会触发配置文件。但是 `tsc` 会编译根目录下的所有 .ts 文件，这时候可以在 `tsconfig.json ` 添加：

```typescript
"include": ["./demo1.ts"]
```

这时候使用 `tsc` 编译，它会去配置文件里面查询，就会发现只需要编译该文件，然后编译。相对 include 还有 exclude，表示编译只忽略该文件。与 include 效果类似的还有 files，这些配置都是用于限制编译文件的。

### [compilerOptions](https://www.tslang.cn/docs/handbook/compiler-options.html)

一些常用的配置项：

| 选项               |  类型   | 默认值 |                             描述                             |
| :----------------- | :-----: | :----: | :----------------------------------------------------------: |
| noImplicitAny      | boolean |  true  |          在表达式和声明上有隐含的 `any`类型时报错。          |
| removeComments     | boolean | false  |          删除所有注释，除了以 `/!*`开头的版权信息。          |
| strictNullChecks   | boolean |  true  | 在严格的 `null` 检查模式下，`null` 和 `undefined` 值不包含在任何类型里，只允许用它们自己和 `any` 来赋值（有个例外， `undefined` 可以赋值到 `void`）。 |
| rootDir            | string  |   ./   |                    指定输入的文件的地址。                    |
| outDir             | string  |   ./   |                       重定向输出目录。                       |
| incremental        | boolean | false  |            增量编译，之前编译过的内容不会再编译。            |
| allowJs            | boolean | false  |                  允许编译 javascript 文件。                  |
| checkJs            | boolean | false  |      在 `.js` 文件中报告错误。与 `--allowJs` 配合使用。      |
| sourceMap          | boolean | false  |                   生成相应的 `.map` 文件。                   |
| noUnusedLocals     | boolean | false  |                 若有未使用的局部变量则抛错。                 |
| noUnusedParameters | boolean | false  |                   若有未使用的参数则抛错。                   |

## 联合类型和类型保护

联合类型指多个类型的合并类型，类型间用 | 分隔，结合类型保护使用更香。

```typescript
interface Bird {
  fly: boolean;
  sing: () => {};
}

interface Dog {
  fly: boolean;
  bark: () => {};
}
// animal 是一个联合类型，只能获取几个类型共有的属性或者方法
function trainAnial(animal: Bird | Dog) {
  // animal.fly 可以获取
  // animal.sing(); 报错
}
```

类型保护可以通过 if 判断来获取几个类型的非共有属性或者方法。

```typescript
// 使用类型断言的方式进行类型保护
function trainAnial(animal: Bird | Dog) {
  if (animal.fly) {
    (animal as Bird).sing();
  } else {
    (animal as Dog).bark();
  }
}

// 使用 in 语法进行类型保护
function trainAnialSecond(animal: Bird | Dog) {
  if('sing' in animal) {
    animal.sing();
  } else { // else 里一定没有 sing，推断为 Dog 类
    animal.bark();
  }
}

// 使用 typeof 做类型保护
function add(a: string | number, b: string | number) {
  if (typeof a === 'string' || typeof b === 'string') {
    return `${a}${b}`
  } 
  return a + b;
}

// 使用 instanceof 做类型保护
class NumberObj {
  count: number;
}
function addSecond(a: object | NumberObj, b: object | NumberObj) {
  if (a instanceof NumberObj && b instanceof NumberObj) {
    return a.count + b.count;
  }
  return 0;
}
```

## Enum 枚举类型

可以用枚举类型来对多个状态值进行管理，不多说，直接上代码：

```typescript
// 原来的写法
// const Status = {
//   OFFLINE: 0,
//   ONLINE: 1,
//   DELETED: 2
// };
// 枚举写法
enum Status {
  OFFLINE, // 默认为0，可以设置 OFFLINE = 1 使初始值为1，后面的属性递增
  ONLINE,
  DELETED
}
function getResult(status) {
  if (status === Status.OFFLINE) {
    return 'offline';
  } else if (status === Status.ONLINE) {
    return 'online';
  } else if (status === Status.DELETED) { 
    return 'deleted';
  }
  return 'error';
}
// console.log(getResult(Status.OFFLINE));
console.log(getResult(0));
```

## 泛型

泛型（generic）：把明确类型的工作推迟到创建对象或者调用方法的时候。

### 函数泛型

```typescript
function join<strOrNum>(a: strOrNum, b: strOrNum) {
  return `${a}${b}`;
}
join<string>('1', '1')

// some[] | Array<some>
function map<some>(a: some[]) {
  return a;
}
map<string>(['1', '1'])

// 可以定义多个泛型
function join2<T, T1>(a: T, b: T1) {
  return `${a}${b}`;
}
join2<string, number>('1', 1)
// 自动类型推断 <number, number>
// join2(1, 1);

// 可以把返回值定义为泛型
function join3<T>(a: T) {
  return a;
}
```

如何使用泛型作为一个具体的类型注解：

```typescript
const func: <T>(params: T) => T = (str) => {
  return str;
}
console.log(func<number>(123));
```

### 类中的泛型

```typescript
class DataManager<T> { // 在此处定义泛型
  constructor(private data: T[]) {};
  getItem(index: number): T {
    return this.data[index]
  }
}
const data = new DataManager<string>(['1', '2', '3']);
console.log(data.getItem(2));
```

泛型也可以继承于接口：

```typescript
interface Item {
  name: string;
}
class DataManager<T extends Item> {
  constructor(private data: T[]) {};
  getItem(index: number): string {
    return this.data[index].name;
  }
}
const data = new DataManager([{
  name: 'Wang'
}])
```

借助继承的语法，可以限定泛型的范围：

```typescript
class DataManager<T extends number | string> {
  constructor(private data: T[]) {};
  getItem(index: number): T {
    return this.data[index];
  }
}
```

### keyof

当我们想要对一个对象进行遍历，如果只是使用单纯的 key 写法，并不能通过各个属性的类型来限定返回的数据的类型，而且也不安全，因为当类型不存在可以直接返回 undefined 而不是报错通知你。这时候可以使用 keyof：

```typescript
interface Person {
  name: string;
  age: number;
  gender: string;
}
class Teacher {
  constructor(private info: Person) {};
  getInfo<T extends keyof Person>(key: T): Person[T] {
    return this.info[key];
  }
}

const teacher = new Teacher({
  name: "Wang",
  age: 18,
  gender: "female"
})

console.log(teacher.getInfo('name'));
console.log(teacher.getInfo('hello')); // 报错
```

## 命名空间 namespace

在代码量较大的情况下，为了避免各种变量命名相冲突，于是将功类似的函数、类等放入同一个命名空间内。

可以使用 namespace 来声明一个命名空间，通过 export 对外暴露命名空间内的类、接口等。在其他文件中，需要通过 `/// <reference path = "xxx.ts" />` 引入带命名空间的文件，并使用 `命名空间的名字.类（等）` 使用。本段初始化一个小项目来辅助理解命名空间。

项目初始化：使用 `npm init -y` 初始化，然后运行 `tsc --init` 引入 `tsconfig.json` 文件。

创建一个 src 目录，并放入两个文件：

```typescript
// components.ts
namespace Components {
  export interface user {
    name: string;
  }

  export class Header {
    constructor() {
      const elem = document.createElement('div');
      elem.innerText = 'This is Header';
      document.body.appendChild(elem);
    }
  }

  export class Content {
    constructor() {
      const elem = document.createElement('div');
      elem.innerText = 'This is Content';
      document.body.appendChild(elem);
    }
  }

  export class Footer {
    constructor() {
      const elem = document.createElement('div');
      elem.innerText = 'This is Footer';
      document.body.appendChild(elem);
    }
  }
}
```

```typescript
// page.ts
/// <reference path="components.ts" />

namespace Home {
  export namespace Wang {
    export const teacher: Components.user = {
      name: 'Wang'
    };
  }
  export class Page {
    constructor() {
      new Components.Header();
      new Components.Content();
      new Components.Footer();
    }
  }
}
```

并在 src 同级创建 `index.html`：

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Document</title>
		<script src="./dist/page.js"></script>	
	</head>
	<body>
    <script>
      new Home.Page();
    </script>
  </body>
</html>
```

修改 `tsconfig.json` 的配置：

```json
{
  "compilerOptions": {
    ...
    "module": "AMD", // AMD才支持outFile                           
    "outFile": "./dist/page.js", // 将src下所有.ts编译到同一个.js下
    "outDir": "./dist", // 指定输出文件目录
    "rootDir": "./src" // 指定输入文件目录
    ...
}
```

接下来可以用 `tsc -w` 编译并时刻监听了，然后运行 `index.html` 文件。

### import 对应的模块化

使用 ES6 的语法 import 重构下上面的三个文件：

```typescript
// components.ts
export class Header {
  constructor() {
    const elem = document.createElement('div');
    elem.innerText = 'This is Header';
    document.body.appendChild(elem);
  }
}

export class Content {
  constructor() {
    const elem = document.createElement('div');
    elem.innerText = 'This is Content';
    document.body.appendChild(elem);
  }
}

export class Footer {
  constructor() {
    const elem = document.createElement('div');
    elem.innerText = 'This is Footer';
    document.body.appendChild(elem);
  }
}
```

```typescript
// page.ts
import { Header, Content, Footer } from './components'

export default class Page {
  constructor() {
    new Header();
    new Content();
    new Footer();
  }
}
```

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Document</title>
    <!-- 该行引入文件用于兼容浏览器 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.js"></script>
		<script src="./dist/page.js"></script>
	</head>
	<body>
    <script>
      require(['page'], function(page) {
        new page.default()
      })
    </script>
  </body>
</html>
```



 