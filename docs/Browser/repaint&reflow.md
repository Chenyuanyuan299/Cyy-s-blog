# 重排（Reflow）和重绘（Repaint）

## 重排的触发

重排也称为回流，当通过 JS 或 CSS 修改 DOM 元素的几何属性（比如长度、宽度）时，会触发完整的渲染流水线，这就是重排。

重排的触发一般有以下几种情况：

- 页面一开始渲染的时候（这避免不了）
- 添加或删除可见的DOM元素
- 元素的位置发生变化
- 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
- 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代
- 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）

还有一些容易被忽略的操作：比如获取一些特定属性的值

> offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft、clientWidth、clientHeight

这些属性有一个共性，就是需要通过即时计算得到。因此浏览器为了获取这些值，也会进行回流

除此还包括`getComputedStyle`方法，原理是一样的

## 重绘的触发

当修改的属性不涉及几何属性（比如字体颜色）时，会省略流水线中的 Layout、Layer 过程，这种情况称为重绘。触发重排一定会触发重绘。除此之外，还有以下几种情况：

- 颜色的修改
- 文本方向的修改
- 阴影的修改

## 如何减少或避免

避免重排：

- 如果想设定元素的样式，通过改变元素的`class`类名（尽可能在 DOM 树的最里层）
- 避免设置多项内联样式
- 应用元素的动画，使用`position`属性的`fixed`值或`absolute`值
- 避免使用`table`布局，`table`中每个元素的大小以及内容的改动，都会导致整个`table`的重新计算
- 对于那些复杂的动画，对其设置`position: fixed/absolute`，尽可能地使元素脱离文档流，从而减少对其他元素的影响
- 使用 CSS3 硬件加速，可以让`transform`、`opacity`、`filters`这些动画不会引起重排和重绘
- 避免使用 CSS 的 `JavaScript`表达式
- 在使用`JavaScript`动态插入多个节点时, 可以使用`DocumentFragment`，创建后一次插入，就能避免多次的渲染性能

> 当修改“不涉及重排、重绘的属性”（比如 transform 属性）时，会省略流水线中的 Layout、Layer、Paint 过程，仅执行合成线程的绘制工作，这种情况称为合成。这也是 CSS 动画性能优于 JS 动画性能的原因。前者可能仅涉及合成，而后者会涉及重排、重绘。