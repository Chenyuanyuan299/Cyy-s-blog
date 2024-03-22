# 模块化规范

模块化规范，即为 JavaScript 提供一种模块编写、模块依赖和模块运行的方案。它能降低代码复杂度，提高解耦性。

最原始的 JS 文件加载方式就是 Script 标签，如果把每一个文件看作一个模块，那么它们的接口通常暴露在全局作用域下，一些复杂的框架使用命名空间的概念来组织这些接口。这样的方式有一些很大的缺点：

1. 污染全局作用域；
2. 开发人员必须主观解决模块和代码库的依赖关系；
3. 文件只能按照 script 标签的书写顺序进行加载；
4. 在大型项目中各种资源难以管理，长期积累的问题导致代码库混乱不堪。

默认情况下，浏览器是同步加载 JS 脚本的，渲染引擎遇到 <script\> 就会停下，等到脚本加载完才继续渲染，如果是外部脚本还需要下载时间，这样很容易造成页面卡死。所以浏览器**允许脚本异步加载**。

可以在<script\> 中加上 async 或者 defer 字段来实现并行异步加载，所谓并行就是不阻塞渲染。两者的不同点是：

- defer：等到页面渲染完才会执行下载完的脚本，并且是按顺序执行；
- async：一旦下载完就会中断渲染，先执行脚本，多个脚本不保证按顺序执行。

## CommonJS（同步加载模块）

通过 `require` 方法**同步加载**所依赖的模块，通过 `exports` 或 `module.exports` 导出需要暴露的数据。Serve 端的实现是 Node.js。

### 定义模块

使用普通的函数写法就行：

```javascript
function hello() {}

modules.export = hello
```

### 加载模块

1. 按路径加载；
2. 查找 node_modules 目录加载；
3. 加载后的模块会按照实际文件名缓存，如 `require('express')` 和 `require('./node_modules/express')`，不会重复加载；
4. 核心模块拥有最高的加载优先级。

### 导出模块

Node.js 为每个模块提供一个 exports 变量，指向 module.exports。这相当于在每个模块头部，有一行这样的命令：`var exports = module.exports;`，这两个东西实际指向同一个内存空间，前者是后者的引用。

### 特点

1. 同步加载，适合于服务端；
2. 所有的模块都有单独的作用域；
3. 模块可以多次加载，但第一次加载就会运行一次，运行结果会被缓存，下次加载直接拿到缓存结果。

## AMD (Asynchronous Module Definition) 异步模块定义

采用**异步方式**加载模块，加载过程不影响后面语句的运行。依赖于这个模块的语句会被定义在回调函数中，等到加载完毕才执行。require.js 是 AMD 规范最热门的实现。

### 定义模块

必须采用 define() 函数来定义，如果依赖其他模块还要先导入：

```javascript
define([需要依赖的其他模块], function (){
    var add = function(x, y) {
        doSomething...
    	return ...;
    };
    return {
        add: add
    };
});
```

### 加载模块

同样使用 require 语句，但是要求有两个参数：`require([module], callback);`，前者是一个数组，每一项是要加载的模块，后者是加载成功后的回调。

### 导出模块

与 CommonJS 相似。

### 特点

1. AMD 允许输出的模块兼容 CommonJS；
2. 异步并行加载，不阻塞 DOM 渲染；
3. **推崇依赖前置**，即预执行，在模块使用之前就已经执行完毕。

## CMD (Common Module Definition) 通用模块定义

CMD 与 AMD 类似，sea.js 是 CMD 规范的一个实现。

### 定义、导入、导出

与 AMD 一样使用 define()，接收一个 factory 参数，可以是一个函数，也可以是一个对象或字符串；当 factory 作为函数时，接受三个参数：`function(require, exports, module)`：

- require 获取其他模块；
- exports 用来向外提供模块接口；
- module 存储与当前模块相关联的属性和方法。

```javascript
define(function(require, exports, module) {
  var $ = require('jquery.js') 
  exports.price= 200;  
});
```

### 特点

与 AMD 类似，不同之处在于 AMD 是提前执行且依赖前置，而 CMD 是延迟执行且依赖就近。

## UMD (Universal Module Definition) 

UMD 是 AMD 和 CommonJS 的糅合，它会先判断是否支持 Node.js 模块，存在则使用对应规范；然后判断是否支持 AMD，存在则使用对应规范；如果都不符合，则将模块公布到全局。

## ES Module

ES6 模块的设计思想，就是尽量的静态化，在编译时就确定模块的依赖关系，以及输入和输出的变量。

### 定义模块

跟 CommonJS 类似，普通函数即可。

### 加载模块

使用 import 来导入模块，有很多种写法，不一一列举，看以下总结。

### 导出模块

使用 export 或者 export default。

## 总结

<img :src="$withBase('/NodeJS/module.png')" alt="module"/>

### require/exports 与 import/export 的区别

**写法上**：

```javascript
// require/exports
const fs = require('fs')
exports.fs = fs
module.exports = fs

// import/export
import fs from 'fs'
import {default as fs} from 'fs'
import * as fs from 'fs'
import {readFile} from 'fs'
import {readFile as read} from 'fs'
import fs, {readFile} from 'fs'

export default fs
export const fs
export function readFile
export {readFile, read}
export * from 'fs'
```

同时，require 可以使用表达式和变量，import 不行。因为前者是在运行时执行，后者在编译阶段执行，编译阶段无法识别这些东西。

**输入上**：

- require 引入的变量，基本类型做赋值，引用类型是浅拷贝，可以修改；
- import 引入的变量，只读，不可修改，如果是对象，允许改写属性。

**执行上**：

- require 不具有变量提升，模块在运行时加载；
- import 具有变量提升，编译阶段就会加载模块并提升。

> ES2020 提案引入了 `import()` 函数，支持动态加载模块，也就是运行时执行的 import，可以按需加载、条件加载和动态的模块路径。`import()` 加载模块成功后，会返回一个 Promise 对象。

require/exports 和 import/export 本质上的区别，实际上也就是 CommonJS 规范与 ES Module 规范的区别。它们分别运行在 node 环境和 js 环境，babel 可以将 import 编译为 nodejs 支持的 require；而浏览器想要使用这些语法还必须借助 browserify 或者 webpack 工具，将 require 编译为浏览器识别的语法。

CommonJS 与 ES Module 三大差异：

1. CommonJS 输出的是值的拷贝，ES Module 输出的是值的引用；
2. CommonJS 是运行时加载，ES Module 是编译时输出接口；
3. CommonJS 的 `require()` 是**同步加载**模块，ES Module 的 `import` 命令是**异步加载**，有一个独立的模块依赖的解析阶段。

导致第二条差异的原因是：

CommonJS 加载的是一个对象（即 module.exports 属性），这个对象只有在脚本运行完才会生成。而 ES Module 加载的不是对象，而是通过 `export` 命令显式指定输出的代码，再通过 `import` 命令输入，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

