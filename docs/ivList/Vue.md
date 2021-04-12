# Vue

## `v-show` 和 `v-if` 的区别

`v-show` 通过控制 CSS 的 `display: none` 设置组件是否显示，每个组件都会进行缓存；`v-if` 通过 Vue 本身的机制来控制组件渲染与销毁；

当组件需要频繁切换时使用 `v-show`，当组件不经常切换时使用 `v-if`；

## 为何 v-for 需要 key

- 首先 key 不能是 index 和 random
- diff 算法中通过 tag 和 key 来判断，是否是 sameNode
- 减少渲染次数，提升渲染性能

## 描述 Vue 组件生命周期（有父子组件的情况）

- 流程图
- 父子组件生命周期关系

## Vue 组件如何通讯

1. 父子组件通讯可以使用 props 和 this.$emit
2. 两个组件没用关系或者层级比较深可以用自定义事件的方式
   event.$on 和 event.$emit 进行事件定义和触发，使用 event.$off 进行事件解绑
3. 使用 vuex 进行通讯

## 描述组件渲染和更新的过程

初次渲染：

- 解析模板为 render 函数（可能在开发环境下完成，vue-loader）
- 触发响应式，监听 data 属性 getter 和 setter（此过程在执行 render 之前完成）
- 执行 render 函数，生成 vnode，patch(elem, vnode)

更新过程：

- 修改 data，触发 setter（此前 getter 中已被监听）
- 重新执行 render 函数，生成 newVnode
- patch(vnode, newVnode)

## 双向数据绑定 v-model 的实现原理

- input 元素的`value = this.name`
- 给 input 绑定一个事件 `this.name = $event.target.value`
- data 更新触发 re-render 

## 插槽

slot 基本使用：可以把父组件的子元素、子节点插入到子组件的<\slot>中，可以设置默认值

作用域插槽：子组件定义一个动态属性比如：

``` vue
:slotData="webData"
```

父组件使用以下代码接受子组件的数据，然后插入到子组件的<\slot>中

```vue
v-slot="slotProps"  {{slotProps.slotData.title}}
```



具名插槽：父组件定义 v-slot:xxx，子组件 <\slot name="xxx"> 进行对应

## computed 和 watch 的区别

computed：计算属性，有缓存，不支持异步

watch：观察属性变化，不支持缓存，支持异步

watch 怎么实现深度监听：deep: true

## Vue-router 的两种模式

hash、history（需要服务端支持）

## keep-alive 是什么？

缓存组件即组件只会渲染一次，频繁切换不用重复渲染，Vue 常见性能优化

相对来说`v-show` 只是使用 CSS 的 display 属性进行显隐控制，比较低级，用在小型组件；keep-alive 在 Vue（框架）层级进行的 Js 对象的渲染，可以用在很多场景，比如大型组件列表 tab 切换。

## 为何组件 data 必须是一个函数？

当我们用 Vue 创建两个实例的时候，相当于实例继承了 data 函数，当修改里面的数据的时候，不会影响到其他实例。

## ajax 请求放在哪个生命周期

mounted

