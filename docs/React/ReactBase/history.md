# 初探 React 

## 简介

本文档将结合 React 的官方文档以及极客时间王沛的 React 课程进行学习，主要通过一些简单的例子来学习 React 的思想。React 文档版本：v17.0.2。

React 是2013年由 FaceBook 推出的一款前端开发框架。

## 历史背景

FaceBook 的工程师在开发过程中发现一些简单的功能常常出现 Bug，即状态并不能即时更新。该问题的根源是：

- 传统的 DOM API 关注太多细节，用 jQuery 操作太复杂。

- 应用程序状态分散，难以追踪和维护。

### UI 细节问题

解决思路：始终**整体刷新**页面，简化 DOM 的操作。

### 数据模型问题

解决思路：传统 MVC 数据模型 ——> Flux 单向数据流模型

传统 MVC 模型中：model、view 错综复杂，数据双向绑定，难以追踪问题

<img :src="$withBase('/React/MVC.png')" alt="mvc 模型"/>

Flux 架构：一种设计模式，核心思想是单项数据流，通过状态改变传递数据，最终重新渲染。主要实现：Redux、MobX。

<img :src="$withBase('/React/Flux.png')" alt="Flux 模型"/>

## 总结

传统 Web UI 开发存在着这样一些问题，React 的设计就是为了解决这些问题，始终整体刷新和单向数据流是 React 的核心。

相较于传统，React 带来了以下一些新东西：

- 一个新的概念：组件
- 四个必须的 API：
  1. ReactDOM.render() 方法让 React 组件渲染到某个具体的 DOM 节点。
  2. 组件的 render() 方法渲染对应的组件。
  3. 组件的 setState() 方法，用于改变组件的状态，触发组件的 render() 方法重新渲染组件。
  4. 组件之间通过 props 传递任何数据。
- 单向数据流
- 完善的错误提示

## 入门 JSX

```jsx
const element = <h1>Hello, World!</h1>;
```

上述的标签语法既不是字符串也不是模板语法，而是一种语法糖。这种语法被称为 JSX，是一个 JavaScript 的语法扩展，支持我们在 JavaScript 中直接写 HTML 标记。建议在 React 中配合使用 JSX，JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。JSX 可能会使人联想到模板语言，但它具有 JavaScript 的全部功能。

### 为什么使用 JSX？

React 认为渲染逻辑本质上与其他 UI 逻辑内在耦合，比如，在 UI 中需要绑定处理事件、在某些时刻状态发生变化时需要通知到 UI，以及需要在 UI 中展示准备好的数据。

React 并没有采用将标记与逻辑进行分离到不同文件这种人为地分离方式，而是通过将二者共同存放在称之为“组件”的松散耦合单元之中，来实现关注点分离。

React 不强制要求使用 JSX，但是大多数人发现，在 JavaScript 代码中将 JSX 和 UI 放在一起时，会在视觉上有辅助作用。它还可以使 React 显示更多有用的错误和警告消息。

### 在 JSX 中嵌入表达式

JSX 本身就是表达式，在编译之后，JSX 表达式会被转为普通 JavaScript 函数调用，并且对其取值后得到 JavaScript 对象。

```javascript
const element = <h1>Hello, World!</h1>;
```

可以通过使用引号，来将属性值指定为字符串字面量：

```javascript
const element = <div tabIndex="0"></div>;
```

同时，可以在大括号内放置任何有效的 JavaScript 表达式，比如运算，函数调用等：

```javascript
const element = <Demo foo={1 + 2 + 3 + 4} />
```

> 注意：应该仅使用引号（对于字符串值）或大括号（对于表达式）中的一个，对于同一属性不能同时使用这两种符号。同时，因为 JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 `camelCase`（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定。如 class -> className，tabindex -> tabIndex。

也可以在子元素中嵌入表达式：

```javascript
const name = 'Wang';
const element = <div>Hello, {name}!</div>
```

### JSX 表示对象

Babel 会把 JSX 转译成一个名为 `React.createElement()` 函数调用。

```javascript
// JSX
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
// 模板语法
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

这两种代码完全等效，`React.createElement()` 会预先执行一些检查，以帮助你编写无错代码，实际上它创建了一个这样的对象：

```javascript
// 简化过的结构
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

这些对象被称为 “React 元素”。它们描述了你希望在屏幕上看到的内容。React 通过读取这些对象，然后使用它们来构建 DOM 以及保持随时更新。

### JSX 防止注入攻击

React DOM 在渲染所有输入内容之前，默认会进行转义。它可以确保在你的应用中，永远不会注入那些并非自己明确编写的内容。所有的内容在渲染之前都被转换成了字符串。这样可以有效地防止 XSS（cross-site-scripting, 跨站脚本）攻击。

## 元素渲染

在 React 项目的 index.html 文件中有一个 <div\>:

```html
<div id="root"></div>
```

我们称之为根 DOM 节点，该节点内的所有内容都将由 React DOM 管理。想要将一个 React 元素渲染到根 DOM 节点中，只需把它们一起传入 `ReactDOM.render()`：

```
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

### 更新已渲染的元素

React 元素是不可变对象。一旦被创建，你就无法更改它的子元素或者属性。一个元素就像电影的单帧：它代表了某个特定时刻的 UI。根据已有的知识（后面还有别的方法），更新 UI 唯一的方式是创建一个全新的元素，并将其传入 `ReactDOM.render()`。

考虑一个实时更新 DOM 节点的例子：

```javascript
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}
// 每秒都调用 ReactDOM.render()
setInterval(tick, 1000);
```

React DOM 会将元素和它的子元素与它们之前的状态进行比较，并只会进行必要的更新（通过一些算法）来使 DOM 达到预期的状态。在上面的例子中，尽管每一秒都会新建一个描述整个 UI 树的元素，React DOM 只会更新实际改变了的内容。
