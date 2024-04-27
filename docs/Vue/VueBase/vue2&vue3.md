# Vue 2.x 和 Vue 3.x

## 设计目标

Vue 3 相对于 Vue 2，做了很多方面的改进，Vue 3 的设计目标是：

- 更小
- 更快
- TypeScript 支持
- API 设计一致性
- 开放更多底层功能

## 优化方案

Vue 3 的优化可以从以下三个层面入手：

- 源码
- 性能
- 语法 API

### 源码

Vue 3 的源码采用了 monorepo 的方式进行管理，根据功能将不同的模块拆分到 packages 目录下的不同子目录中，这样使得模块拆分更细化，职责划分更明确，模块之间的依赖关系更明确，用户如果只想用其中的部分功能，可以单独依赖对应的库而不是引入整个 Vue。

Vue 3 对 TypeScript 做了支持，基于 TypeScript 来编写，提供了更好的类型检查，能支持复杂的类型推导。

### 性能

Vue 3 主要对以下三个方面对性能进行进一步优化：

- 体积优化
- 编译优化
- 响应式系统优化

**体积优化**

Vue 3 引入了 Tree-shaking，在打包时只会打包被使用到的文件，使打包的体积更小。Vue 2 则是打包整个库，不管是否使用到。

**编译优化**

编译优化主要分为以下方面：

- diff 算法优化：
    Vue 3 在 diff 算法中增加了静态标记，已经标记为静态的节点在 diff 过程中将不会被比较。同时，Vue 3 使用了最长递增子序列的思路，对 diff 算法做了优化，进一步提高了性能。

    关于静态类型的枚举如下：

    ```javascript
    export const enum PatchFlags {
        TEXT = 1, // 动态的文本节点
        CLASS = 1 << 1, // 2 动态的 class
        STYLE = 1 << 2, // 4 动态的 style
        PROPS = 1 << 3, // 8 动态属性，不包括类名和样式
        FULL_PROPS = 1 << 4, // 16 动态 key，当 key 变化时需要完整的 diff 算法做比较
        HYDRATE_EVENTS = 1 << 5, // 32 表示带有事件监听器的节点
        STABLE_FRAGMENT = 1 << 6, // 64 一个不会改变子节点顺序的 Fragment
        KEYED_FRAGMENT = 1 << 7, // 128 带有 key 属性的 Fragment
        UNKEYED_FRAGMENT = 1 << 8, // 256 子节点没有 key 的 Fragment
        NEED_PATCH = 1 << 9, // 512
        DYNAMIC_SLOTS = 1 << 10, // 1024 动态 solt
        HOISTED = -1, // 特殊标志是负整数表示永远不会用作 diff
        BAIL = -2 // 一个特殊的标志，指代差异算法
    }
    ```

- 静态提升：
    Vue 3 中对不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用，这样就免去了重复的创建节点，大型应用会受益于这个改动，免去了重复的创建操作，优化了运行时候的内存占用：

    ```javascript
    const _hoisted_1 = /*#__PURE__*/_createVNode("span", null, "你好", -1 /* HOISTED */)
    
    export function render(_ctx, _cache, $props, $setup, $data, $options) {
      return (_openBlock(), _createBlock(_Fragment, null, [
        _hoisted_1,
        _createVNode("div", null, _toDisplayString(_ctx.message), 1 /* TEXT */)
      ], 64 /* STABLE_FRAGMENT */))
    }
    ```

    可以看到，静态内容`_hoisted_1`被放置在`render`函数外，每次渲染的时候只要取`_hoisted_1`即可，同时`_hoisted_1`被打上了 `PatchFlag`，静态标记值为 -1，表示永远不会用于 diff。

- 事件监听缓存
    默认情况下绑定事件行为会被视为动态绑定，所以每次都会去追踪它的变化，开启优化后，将去掉静态标记，在下次 diff 中直接使用。

- SSR 优化
    当静态内容大到一定量级时候，会用`createStaticVNode`方法在客户端去生成一个 static node，这些静态 node，会被直接 innerHtml，就不需要创建对象，然后根据对象渲染。

**响应式系统优化**

在 Vue 2.x 中，引入了虚拟 DOM，收集依赖的细粒度从具体的 DOM 节点调整为组件，Vue 2 封装了一个名为 defineReactive 的函数，通过使用 Object.defineProperty 来侦测变化，在 getter 中收集依赖，在 setter 中触发依赖（也就是将单条属性转变为响应式）。依赖将会收集到 Dep（一个封装的类，实例提供了一个收集依赖的数组）。数据通过 Observer（基于 defineReactive，深度遍历所有属性并将其转变为响应式），当外界通过 Watcher 读取数据时，会触发 getter 从而将 Watcher 添加到依赖中，当数据发生变化，触发 setter，从而向 Dep 中的 Watcher 发送通知。

使用 Object.defineProperty 存在一些问题，比如对一个对象进行删除和添加属性时不会被劫持，或者对一个数组进行监听，数组调用 api 时也不会被劫持。所以 Vue 2 增加了 set、delete，并添加了拦截器以及重写了数组的方法才实现了数组的劫持。

Vue 3.x 中，换成了 Proxy 对对象进行监听，Proxy 相比 Object.defineProperty，有以下几点优势：

- Proxy 有更强大的拦截能力，有多达13种拦截方法，不只限于`apply`、`ownKeys`、`deleteProperty`、`has`，这是 Object.defineProperty 所不具备的；
- Proxy 使用更简洁的语法来定义拦截行为，可以直接通过 Proxy 生成的新对象来操作原对象，而 Object.defineProperty 需要在原始对象上定义拦截器；
- Proxy 可以对整个对象进行拦截，而 Object.defineProperty 只能对对象的指定属性进行拦截；

### 语法 API

Vue 2.x 使用 Options API，通过定义 methods、computed、watch 和 data 等属性与方法，共同处理页面逻辑，当组件变得复杂时，导致对应属性的列表也会增长，从而使组件难以阅读和理解，而在 Vue 3.x 中，换用 Composition API，组件根据逻辑功能来组织，一个功能所定义的所有 API 会放在一起（更加的高内聚，低耦合），即使项目很大，功能很多，我们都能快速的定位到这个功能所用到的所有 API。

同时，在 Vue 2.x 中用 mixin 来达到复用逻辑的效果，但是当混用过多后，首先会有命名冲突，其次数据来源也不清晰，造成了维护上的困难，使用 Composition API 的方式将更加清晰，并且少了很多 this 的使用，减少了 this 指向不明的问题。