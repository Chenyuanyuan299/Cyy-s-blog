# 性能优化

性能优化分为几个方面：

- 框架层面；
- 代码构建与图片压缩层面；
- 网络请求层面；
- 应用加载与执行渲染层面；
- 感官体验优化层面；

## 框架层面

**Vue3**

Vue3 主要做了体积优化（Tree-shaking）、编译优化和响应式系统优化，编译优化又分为：

- diff算法优化；
- 静态提升；
- 事件监听缓存；
- SSR优化；

**React**

由于 React 是细粒度更低的应用级框架，它将性能优化的几个方法交给用户使用。

在 React18 以前：

- shouldComponentUpdate（通过对比 state 和 props 确定是否要重新渲染）；
- PureComponent（与 shouldComponentUpdate 类似）；
- 使用 Immutable（减少渲染次数）；
- 避免使用内联函数（render 时不会创建单独的函数实例）；
- 事件绑定方式（在constructor 中预先 bind 当前组件，避免 render 操作中重复绑定）；

在 React 18 及之后：

- useState 中，避免重复创建初始状态；
- useEffect 中，设置正确的依赖项，避免反复调用 Effect 函数；
- 使用 useMemo 和 useCallback 防止在传递对象或者函数时重新渲染；
- 使用 useMemo 缓存复杂计算结果；

除此之外， 常见性能优化常见的手段有如下：

- 使用 React Fragments 避免额外标签（可以简写为 <>...</>，如果要传入 key，请从 react 中导入 Fragment）；
- 使用 React.memo（缓存组件，允许你的组件在 props 没有改变的情况下跳过重新渲染）；
- 懒加载组件（Suspense、lazy）；
- SSR 渲染；

## 代码构建与图片压缩层面

主要是通过 Webpack、Rollup 等模块打包工具，来达到：

- JS 代码压缩；
- CSS 代码压缩；
- Html 文件代码压缩；
- 文件大小压缩；
- 图片压缩（如 tinypng）；
- Tree Shaking；
- Code Splitting（代码分离）；
- 内联 chunk；

等优化效果。

## 网络请求层面

网络层面的优化，主要有以下手段：

- DNS 预解析、预加载、预渲染；
- 离线化（ServiceWorker、AppCache、离线包等）；
- HTTP 缓存；
- 数据缓存（localStorage、sessionStorage）；
- 资源加载（async、defer 标签）；
- 请求合并；
- HTTP 2；
- CDN（将数据缓存在离用户近的服务器上）；

## 应用加载与执行渲染层面

主要是通过对 JS、CSS 的执行进行优化，以及减少重排、重绘，有以下手段：

- 降低 JS 复杂度或者使用 Web Worker；
- CSS 代码优化（选择器、启用 GPU、避免表达式等）；
- 使用 requestAnimationFrame 实现视觉变化；
- 避免大型、复杂的布局和布局抖动；
- 简化绘制复杂度、减少绘制区域；
- 输入处理程序防抖节流；
- 使用懒加载；
- 使用 SSR 优化 SEO；

## 感官体验优化层面

主要是通过一些技术，优化用户体验，主要有以下手段：

- 骨架屏（使用简单的灰色块和线条，让用户在等待网络请求过程中获得视觉反馈）；
- Loading（添加一些过渡动画，减少用户等待焦虑）；

