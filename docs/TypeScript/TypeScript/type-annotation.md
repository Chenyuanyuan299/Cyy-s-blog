# 初探类型注解文件 .d.ts 

在爬虫里面讲过，.ts 文件是不能直接使用引入的 .js 文件的，需要先经过类型注解文件“翻译”，类型注解文件我们通过 `npm install @type/xxx` 下载。本文主要学习不通过 npm 来安装，而是手写一个 .d.ts 文件。

## 描述文件中的全局类型

本文使用 jquery 的一些基础 api 做例子，需要在 index.html 引入 [jquery](https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js)。

首先初始化项目，然后在 src 下创建几个文件：

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
        <!-- 一定在 page 使用之前引入 jquery -->
    	<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js"></script>
		<script src="./page.ts"></script>
	</head>
	<body></body>
</html>
```

```typescript
// page.ts
$(function() {
  alert(123);
});
$(function() {
  $('body').html('<div>123</div>');
  new $.fn.init(); // init() 是一个构造函数
});
```

主要看的是 .d.ts 文件，我们使用 `declare` 来声明一个全局变量或者全局函数，这时候才可以在 page.ts 中使用它们。可以重复定义一个函数，这种方式叫做函数重载，函数可以以多种方式存在。因为是手写，所以针对 page.ts 的需要来写。

```typescript
// jquery.d.ts
// 定义全局变量
// declare var $: (param: () => void) => void;

// 定义全局函数
// 可以重复定义，这种形式叫做函数重载，函数可以以多种形式存在
interface JqueryInstance {
  html: (string) => {};
}
declare function $(readyFunc: () => void): void;
declare function $(selector: string): JqueryInstance;

// 定义全局对象和全局类，使用命名空间
declare namespace $ {
  namespace fn {
    class init {}
  }
}
```

如果 $ 只是函数，可以使用接口的语法实现函数重载：

```typescript
interface Jquery {
  (readyFunc: () => void): void;
  (selector: string): JqueryInstance;
}
declare var $: Jquery;
```

## 模块代码的类型描述文件

文章前半部分，使用的是 script 引入的 jquery 文件，本段使用模块化的方式引入 jquery：`npm install jquery --save`。然后删除 index.js 的引入，在 page.ts 中用 import 的形式引入 $。 

```typescript
// page.ts
import $ from 'jquery';

$(function() {
  alert(123);
});
$(function() {
  $('body').html('<div>123</div>');
  new $.fn.init();
});
```

```typescript
// Es6 重写 jquery.d.ts
declare module 'jquery' {
  interface JqueryInstance {
    html: (string) => JqueryInstance;
  }

  // 混合类型
  function $(readyFunc: () => void): void;
  function $(selector: string): JqueryInstance;
  namespace $ {
    namespace fn {
      class init {}
    }
  }
  export = $; // 导出$
}
```

