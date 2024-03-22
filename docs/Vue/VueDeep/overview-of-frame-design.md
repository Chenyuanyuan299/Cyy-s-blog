# 权衡的艺术

## 命令式和声明式

命令式框架的一大特点就是关注过程，而声明式框架更加关注结果。声明式代码的性能并不优于命令式。

声明式框架本身就是封装了命令式代码才实现了面向用户的声明式。

### 性能消耗

声明式代码的更新性能消耗 = 找出差异的性能消耗 + 直接修改的性能消耗。

|                    | 虚拟 DOM                        | innerHTML                          |
| ------------------ | ------------------------------- | ---------------------------------- |
| 纯 JavaScript 运算 | 创建新的 JavaScript 对象 + Diff | 渲染 HTML 字符串                   |
| DOM 运算           | 必要的 DOM 更新                 | 销毁所有旧 DOM<br />新建所有新 DOM |

使用 innerHTML，每次更新由于 innerHTML 属性的重新设置，都需要销毁 DOM 再新建 DOM，而使用虚拟 DOM，虽然多了一步 diff 消耗，但毕竟也是 JavaScript 层面，DOM 层只会更新变化的内容，相对于 innerHTML 更有优势。

## 运行时和编译时

设计框架有三种选择，纯运行时、纯编译时或者两者都包含。

- 纯运行时

纯运行时没有编译过程，没办法分析用户提供的内容，用户直接手写树形结构，调用 Render 函数渲染。

- 运行时 + 编译时

加入编译时，可以在 Compiler 获取用户更改的内容，然后提供给 Render 函数做进一步优化。

- 纯编译时

同样可以获取用户内容，但是有损灵活性，必须编译后才能使用。

# 框架设计的核心要素

- 提供友好的警告机制
- 控制框架的代码体积

Vue.js 使用 rollup,js 对项目进行构建，通过参数控制输出于开发或者生产环境的不同资源。

- 做到良好的 Tree-Shaking

Tree-Shaking 依赖于 ESM，在打包时除了会删除未使用的函数，还可以通过合理使用`/*#__PURE__*/`通知 rollup.js 删除不会产生副作用的函数。

- 构建产物的输出格式

iife、esm、cjs，其中，提供给打包工具的 esm 格式（后缀为 -bundler），参数`__DEV__`会变成参数`process.env.NODE_ENV !== 'production'`。

- 特性开关
- 错误处理

```javascript
// utils.js
let handleError = null
export default {
  foo(fn) {
    callWithErrorHandling(fn)
  }
  registerErrorHandle(fn) {
    handleError = fn
  }
}
function callWithErrorHandling(fn) {
  try {
    fn && fn()
  } catch (e) {
    handleError(e)
  }
}
```

- 良好的 TypeScript 支持

# Vue.js 3 的设计思路

Vue.js 3 是一个声明式的 UI 框架，设计一个这样的框架，首先得考虑前端页面都涉及什么内容：

- DOM 元素标签
- 属性
- 事件
- 元素的层级结构

Vue.js 可以用模版来描述 UI，也可以使用 JavaScript 对象来描述，后者更具有灵活性（后者其实就是虚拟 DOM）。

## 渲染器

渲染器的作用就是把虚拟 DOM 渲染为真实 DOM。

创建节点

``` javascript
const vnode = {
  tag: 'div',
  props: {
    onClick: () => alert('hello')
  },
  children: 'click me'
}

// vnode：虚拟 DOM；container：真实 DOM 元素；
function renderer(vnode, container) {
	const el = document.createElement(vnode.tag)
  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(
        key.substr(2).toLowerCase(), // 事件名称 onClick ---> click
        vnode.props[key] // 事件处理函数
      )
    }
  }

  if (typeof vnode.children === 'string') {
    el.appendChild(document.createTextNode(vnode.children))
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => renderer(child, el))
  }

  container.appendChild(el)
}
```

## 组件的本质

组件实际上就是一组 DOM 元素的封装，虚拟 DOM 不仅可以用来描述真实 DOM，还可以用来描述组件。

``` javascript
// 函数表示的组件
const MyComponent = function () {
  return {
    tag: 'div',
    props: {
      onClick: () => alert('hello')
    },
    children: 'click me'
  }
}

// 对象表示的组件
// const MyComponent = {
//   render() {
//     return {
//       tag: 'div',
//       props: {
//         onClick: () => alert('hello')
//       },
//       children: 'click me'
//     }
//   }
// }

const vnode = {
  tag: MyComponent
}

function renderer(vnode, container) {
  if (typeof vnode.tag === 'string') {
    mountElement(vnode, container) // 上文中的 renderer
  } else if (typeof vnode.tag === 'function') {
    mountComponent(vnode, container)
  }
  // 对象表示组件时的修改
  // else if (typeof vnode.tag === 'object') {
  //   mountComponent(vnode, container)
  // }
}

function mountComponent(vnode, container) {
  const subtree = vnode.tag()
  // 对象表示组件时的修改
  // const subtree = vnode.tag.render()
  renderer(subtree, container)
}

renderer(vnode, document.body)
```

## 模版的工作原理

虚拟 DOM 通过渲染器渲染成真实 DOM，模版则先通过编译器编译为渲染函数，然后渲染器再把渲染函数返回的虚拟 DOM 渲染成真实 DOM。
