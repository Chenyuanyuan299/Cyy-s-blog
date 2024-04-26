# 模拟一面

## 1.CSS 里有多少种布局属性？每种都介绍一下

- 正常布局流（Normal flow）：指不对页面进行任何布局控制，浏览器默认的 HTML 布局方式。display 属性(`block`、`inline`、`inline-block` 等)和其他各种布局会覆盖默认的布局行为。

- 弹性布局（Flexbox）：在想要进行flex布局的父元素上应用`display: flex` 用于设计横向或者纵向布局。

- Grid 布局：指定 `display: grid`，用于同时在两个维度上把元素按行和列排列。

- 浮动（float）：应用 float 的元素将会脱离原来的文档流。

- 表格布局（table）：使用`display: table-row`、`display-column`、`display: table-cell`、`display: table-caption`等属性，用于显示表格数据，不推荐使用，很不灵活。

- 多列布局：使用`column-count`、`column-width`等属性设置多个列，一般可以用别的布局写，用的不多。

- 定位（position）属性：通过定位能够使元素从原本在文档流中的位置移动到另一个位置，它目前有五种属性：

  - static：元素使用正常的布局行为，即元素在正常文档流中当前的位置。
  - 相对定位 relative：元素会相对于它本身原来的位置移动。
  
  - 绝对定位 absolute：元素会脱离文档流，指定元素相对于最近的非 static 定位的祖先元素偏移。
  - 绝对定位 fixed：元素会脱离文档流，指定元素相对于屏幕视口的位置来移动。fixed 会创建新的层叠上下文。
  - 粘性定位 sticky：元素根据正常文档流进行定位，然后相对top, right, bottom, 和 left的值进行偏移。偏移值不会影响任何其他元素的位置。sticky 总是创建一个新的层叠上下文，并且会“固定”在离它最近的拥有滚动机制的祖先上。

## 2.display：inline、block、inline-block

- inline：元素不会独占一行，多个相邻行内元素会排列在同一行，排不下才换新的一行，不可设置 width 和 height（可以设置 line-height），设置 margin 和 padding 水平方向上的属性如 padding-left 等会起效果，竖直方向的属性如 padding-top 不产生效果。
- block：元素会独占一行，即使设置了width、height，多个元素会各自新起一行，可以设置 margin 和 padding。
- inline-block：将对象呈现为 inline 对象，但是对象的内容作为 block 对象呈现。可以设置 width 和 height。

## 3.flex 布局了解吧？`flex: 1`是几个属性的缩写？（择取回答）

- `flex-direction`属性决定主轴的方向：row 横向从左到右，column 纵向从上到下，分别加上reverse则为反方向；`justify-content`设置**主轴方向上**的元素排列方式，`flex-start`、`flex-end`设置项目左或者右对齐，`center`是居中，`space-between`两端对齐间隔相等，`space-around`每个项目两侧间隔相等；`align-items`设置主轴的交叉轴上元素的排列方式，同样有`flex-start`、`flex-end`、`center`属性，`stretch`交叉轴方向项目高度为 flexbox 高度，`baseline`基准线下沿；还有`flex-wrap`项目在一行填满时跨行方式，和`flex-direction`可以合并为`flex-flow`；`align-content`设置多轴线对齐方式。
- 项目属性：`order`定义项目排列顺序，数值越小越靠前，`flex-grow`定义项目放大比例，存在剩余空间才放大，`flex-shrink`定义项目缩小比例，空间不足时缩小，`flex-basis`定义分配多余空间之前项目占据的主轴空间，默认值为auto，即项目原本大小，`align-self`允许单个项目设置与其他项目不同的属性，还有一个`flex`。
- flex 属性是`flex-grow`、`flex-shrink`和`flex-basis`的简写，默认值是`0 1 auto`，`flex: 1`是`1 1 auto`，还有一个`flex: 0`是`0 0 auto`。

## 4.JS有什么基本数据类型？怎么区分 Object 和 Array？

- 7种，Number、BigInt、String、Boolean、Symbol、undefined、null。

- 区分Object 和 Array

  1. `Array.isArray()`：为对象时是 false，为数组时是 true。

     ``` javascript
     var a = [];
     Array.isArray(a);  // true
     
     var a ={};
     Array.isArray(a);  // false
     ```

  2. `constructor`：会返回构造该实例的数据原型。

     ``` javascript
     var a = [];
     a.constructor === Array     // true
     
     var a = {};
     a.constructor === Object   // true
     ```

  3. `instanceof`：检测构造函数的原型是否出现在实例的原型链上（不推荐）

     ``` javascript
     var a =[];
     a instanceof Array    // true
     a instanceof Object		// true
     
     var a ={};
     a instanceof Object   // true
     ```

  4. `Object.prototype.toString.call`：类似 null 的判断方式

     ``` javascript
     Object.prototype.toString.call([]) === "[object Array]" // true
     true
     Object.prototype.toString.call({})==="[object Object]" // true
     ```

  5. `isPrototypeOf()`

     ``` javascript
     Array.prototype.isPrototypeOf([]) // true
     Array.prototype.isPrototypeOf({}) // false
     ```

## 5.call、apply 和 bind 的 区别

执行一个函数有两种方式，一种是常见的函数调用，第二种是函数应用。当我们调用一个函数 fn() ，本质上相当于 window.fn()，它是被动的，而 fn.call() 虽然也等同于 window.fn.call()，但 call 为 fn 提供了改变 this 的机会，即 call() 与 apply() 就是提供函数应用的方法。

call 与 apply 的区别只有一个，那就是传入的第二个参数不同。call 方法接受一个参数列表，第一个参数改变 this 的指向，其余参数在函数执行时作为函数形参传入函数。而 apply 除了第一个参数改变 this 的指向，其余参数被包裹在一个数组中，在函数执行时同样作为形参传入。

单独说 bind 是因为它与前两者有所不同，call 与 apply 在改变 this 的同时就会立即执行，而 bind 绑定 this 后不会马上执行，而是返回一个新的函数。该函数不是普通的函数，而是一个绑定函数（bound function）。可以使用`console.dir()`打印返回的新函数，可以看到它的`TargetFunction`参数指向了 bind 前的函数，`BoundThis`就是绑定的 this 指向，`BoundArgs`便是传入的其它参数了。**当我们执行新的函数**，类似于执行`TargetFunction.apply(BoundThis,BoundArgs)`，而且它的 this 指向不会再被改变，不管调用的是 call 或是 bind 都不能改变。如果还能改变，那 bind 函数还有什么意义呢？

## 6.this 的作用、指向？

1. 普通函数调用时，在严格模式下，this 值是 undefined，非严格模式下 this 指向的是全局对象 window；
2. 构造函数调用时，this 指向构造函数创建的实例；
3. 对象方法调用时，this 指向该方法所属的对象；
4. 通过事件绑定的方法，this 指向绑定事件的对象；

总之，调用方式决定了 this 的指向。

## 7.var、let 和 const 的区别？

ES5 中只有全局作用域和函数作用域，没有块级作用域，ES6 引入了 let 和 const 还有块级作用域的概念。

- var 定义的变量，没有块的概念，可以跨块访问，不能跨函数访问。var 声明的变量存在**变量提升**，提升是指 JS 在编译过程中，JS 引擎把变量的声明部分和函数的声明部分提升到代码开头的“行为”。此时不管 var 在**该作用域下**的声明是在哪个位置，在其中到处都可以访问到：

  ``` javascript
  console.log(a); // undefine
  var a = 1024;
  console.log(a); // 1024
  ```

- let 定义的变量，只能在块级作用域里访问，不能跨块访问，也不能跨函数。let 命令声明的变量会现在作用域中被创建出来（变量提升），但是还未进行词法绑定，所以不能被访问，从变量提升到初始化的这一段时间称为**暂时性死区**。

  ``` javascript
  console.log(a); // ReferenceError: Cannot access 'a' before initialization
  let a = 1024;
  ```

- const 用来定义常量，且使用时必须初始化，只能在块级作用域里访问，且不能被修改（当该数据是基本数据类型时不能被修改，当该数据是引用类型时，可以修改属性值，不能修改地址），同时，const 声明也存在暂时性死区。

  ``` javascript
  const a = 1;
  a = 2;
  console.log(a); // TypeError: Assignment to constant variable.
  const b = { x:1 };
  b.x = 2;
  console.log(b.x); // 2
  ```

## 8.TCP 和 UDP 有什么区别？

- TCP 面向连接；UDP 是无连接的，发送数据之前不需要先建立连接。
- TCP 提供可靠的服务，通过 TCP 连接传送的数据，无差错，不丢失，不重复，且按序到达；UDP 不保证可靠交付，不一定按序到达。
- 因为 TCP 传输数据时先进行可靠连接，所以它适合传输大量的数据；而 UDP 不用建立连接，适合相对于 TCP 较少的数据即时传输。
- TCP 首部为20字节；UDP首部为8字节。

## 9.CSS 实现文字环绕

利用 float 属性，如`float: left`设置图片为向左浮动，文字就会环绕图片；若`float: none`，则图片与其标题独占一行。
