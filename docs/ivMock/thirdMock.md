# 模拟三面

## 1.HTML 语义化的好处？

- 代码结构：使页面没有 CSS 的情况下，也能够呈现出很好的内容结构。
- 有利于SEO：爬虫依赖标签来确定关键字的权重，因此可以和搜索引擎建立良好的沟通，帮助爬虫抓取更多的有效信息。
- 提升用户体验：例如 title、alt 可以用于解释名称或者解释图片信息，以及 label 标签的灵活运用。
- 便于团队开发和维护：语义化使得代码更具有可读性，让其他开发人员更加理解你的 HTML 结构，减少差异化。
- 无障碍：方便无障碍引擎对网页内容进行解析，如屏幕阅读器、盲人阅读器、移动设备等。

## 2.对比 JS，CSS 做动画有什么好处？

- `transition`：侦听属性发生变化时触发，搭配其他样式属性可以实现大多数过渡动画。
- `animation`：自动触发，搭配`@keyframes`能够实现大多数较复杂的循环动画。
- CSS 可以调用 GPU 的能力进行渲染，动态设置较困难，适合效果固定的动画。
- JS 做动画会占用 JavaScript引擎，并使用 CPU 进行计算，动态设置较简单，适合做效果复杂的动画。

**PS**：GPU 加速原理：浏览器的 GPU 加速功能是将需要进行动画的元素提升到一个独立的 layer，这样就可以避免重排（Reflow）和重绘（Repaint）。原先用 CPU 绘制位图来实现的动画效果将转让给 GPU使用图层合成来实现；如果两张图层内部没有发生改变，浏览器就不会进行重排和重绘，而是直接使用 GPU 的缓存来绘制每个图层，这样可以充分利用 GPU 的资源，减轻 CPU 的负担，使动画更流畅，还节省了很多绘图时间。可以使用 transform 和 opacity 属性来实现动画，当设置了其中一个，浏览器会自动进行这一优化操作。

## 3.HTTP 有哪些字段？

`Cookie`：对应服务器通过`Set-Cookie`设置的一个HTTP协议。

`Cache-Control`：用来指定当前的请求/回复中的，是否使用缓存机制。

`If-Modified-Since`：允许在对应的资源未被修改的情况下返回304未修改。

`If-None-Match`：允许在对应的内容未被修改的情况下返回304未修改。

`Origin`：发起一个针对跨域资源共享的请求，（要求服务器在响应中加入`Access-Control-Allow-Origin`的消息头）

## 4.GET 和 POST 有什么区别？

- GET 一般是用来获取数据，POST 一般是用来提交数据。
- GET 请求只能进行url编码，而 POST 支持多种编码方式。
- GET 请求会被浏览器主动 cache，而 POST 不会，除非手动设置。
- GET 参数通过 URL 传递，POST 放在 Request body 中。

## 5.字符串如何调用到原型链上的方法?

首先在原型链上添加方法，然后必须通过实例化对象之后去调用它，不能直接调用。

``` javascript
String.prototype.myfunc = function() {}
var str = new String();
console.log(str.myfunc());
```

## 6.CSS：Pointer events

 // 目前绝大多数的 Web 内容都假设用户的指针定点设备为鼠标，然而近年来新兴的设备支持更多种不同方式的指针定点输入，如各类触控笔和触摸屏幕等。这就有必要扩展现存的定点设备事件模型，以有效追踪各类指针事件。

指针事件（Pointer events）是一类可以为定点设备所触发的 DOM 事件。它们被用来创建一个可以有效掌握各类输入设备（鼠标、触控笔和单点或多点的手指触摸）的统一的 DOM 事件模型。`PointerEvent` 接口继承了所有 `MouseEvent`中的属性，以保障原有为鼠标事件所开发的内容能更加有效的迁移到指针事件。

## 7.CSS 盒模型是什么?

当对一个文档进行布局的时候，浏览器的渲染引擎会根据标准之一的 CSS 基础盒模型将所有元素表示为一个个矩形的盒子，该盒子由 margin、border、padding、content 组成。

盒模型分为两种，分别是标准盒模型和怪异盒模型。CSS3 提供了一个属性用于声明盒模型的类型，它就是`box-sizing`，可以设置以下值：

- **content-box**：标准盒模型（默认）
- **border-box**：怪异盒模型

标准盒模型认为：盒子的实际尺寸 = 内容（设置的宽/高）+ 内边距 + 边框：

``` javascript
// 没设置 box-sizing 则为默认 content-box 标准盒模型
.box {
    width: 200px;
    height: 200px;
    padding: 10px;
    border: 1px solid #eee;
    margin: 10px;
}
// 此时内容宽度为 200px，实际宽度为 200+10+10+1+1=222
```

怪异盒模型认为：盒子的实际尺寸 = 设置的宽/高 = 内容 + 内边距 + 边框：

```javascript
.box {
    width: 200px;
    height: 200px;
    padding: 10px;
    border: 1px solid #eee;
    margin: 10px;
    box-sizing: border-box;
}
// 此时内容宽度为 200-10-10-1-1=178，实际宽度为 200px
```

## 8.requestAnimationFrame 是什么？有什么用？

requestAnimationFrame() 是 HTML5 提供的一个专门用于请求动画的 API， 可以重复播放动画，对应的函数为 cancelAnimationFrame()，接受一个由requestAnimationFrame() 默认传出的ID，用于停止动画。

`requestAnimationFrame()`、`setTimeout()`、`setInterval()`：

1. setTimeout() 通过设定间隔时间来不断改变图像位置，达到动画效果，容易出现卡顿和抖动现象，因为 setTimeout() 任务会被放进异步队列，只有主线程任务执行完毕后才会执行队列中的任务，实际执行时间会比设定时间晚。
2. 使用 requestAnimationFrame() 可保证每个刷新间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节省函数执行的开销。
3. 在隐藏或不可见的元素中，requestAnimationFrame() 将不会进行重绘或重排，这当然就意味着更少的的 CPU，GPU 和内存使用量。

## 9.[ ].slice.call() 的原理？

[ ].slice.call() 常用来将伪数组转化成真正的数组。要了解原理我们应该了解以下几点：

- 这里的 [] 是构造函数 Array 的一个实例，所以继承了 slice() 方法，所以有：`Array.prototype.slice.call() === [].slice.call()`。
- call() 方法是实现转化的关键， 它会调用函数并且改变 this 的指向。
- slice(begin, end) 方法接受两个参数，返回数组从 begin 开始至 end（不包括end）部分的浅拷贝。
- 伪数组：有一个明确的标识——`length`属性，并且是以索引形式进行存储如：`let a = {0: 'a', 1: 'b', 2: 'c', length: 3}`。

总之，就是通过 call() 改变 this 的指向，让伪数组可以调用 slice() 方法返回一个真正的数组。



