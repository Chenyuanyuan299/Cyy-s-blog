# （一）：内存空间与深浅拷贝

## 知识准备

首先我们需要了解三种数据结构：堆(heap)，栈(stack)与队列(queue)。

在 JavaScript 中，一般情况下，基础数据类型存储在栈内存中，引用数据类型存储在堆内存中。栈内存从地址高位开始分配，堆内存从地址低位开始分配。

- 栈：存取数据的特点是**先进后出，后进先出**。JavaScript 的执行上下文主要就是借用了栈数据结构的思想。
- 堆：一种使用数组实现的二叉树结构。
- 队列： 一种先进先出（FIFO）的数据结构。JavaScript 的事件循环机制就是栈的思想。

## 变量对象

JavaScript 的执行上下文生成之后，会创建一个叫做变量对象的特殊对象，基础数据类型往往保存在变量对象中。而引用类型保存在堆中，我们不能直接访问堆内存中的数据。

实际上我们操作对象的时候，操作的是对象的引用。引用可以理解为是保存在变量对象中的一个地址，该地址指向堆内存中的实际值。当我们想要访问堆内存中的引用数据类型时，实际上我们会先从变量对象中获取该对象的引用，然后再从堆内存中取得引用对应的数据。

在变量对象中的基本类型数据发生复制时，系统会为新的变量分配新的地址，当改变其中一个数据时，另一个数据并不会改变。

``` javascript
var a = 10;
var b = a;
b = 20;
a // a的值仍为10
```

而当在变量对象中执行一次复制对象的操作，复制的是一个引用，尽管他们相互独立，但他们指向同一个地址，在变量对象中访问到的对象将会是同一个。

``` javascript
var a = { x: 10, y: 20 };
var b = a;
b.x = 20;
a.x //值为20
```

## 深浅拷贝

ECMAScript中的数据类型可分为两种：

- 基本类型：Number,BigInt,String,Boolean,null,undefined,Symbol
- 引用类型：Object,Array,Date,Function,RegExp等

首先要明确一点，**深浅拷贝针对的是引用类型的数据**。

### 赋值与浅拷贝与深拷贝

- 赋值：当我们把一个**引用类型**的数据赋值给一个新的变量的时候，赋的其实是该对象的引用（地址），不论该对象的属性值是基本类型还是引用类型被修改，原来的数据也会跟着改，因为他们的引用指向堆内存中同一个地方。

- 浅拷贝：浅拷贝会创建一个新的对象（即重新在堆中创建内存），这个对象有着原始对象属性值的精确拷贝，拷贝前后对象的基本类型属性值互不影响，但是拷贝前后对象的引用类型属性值**共享**同一块内存，修改数据会影响其他对象。
- 深拷贝：深拷贝会创建一个新的对象（即重新在堆中创建内存），并从堆内存中开辟一个新的区域存放属性值是引用类型的数据，即拷贝前后对象的引用类型属性值**不共享**同一块内存，修改数据不会影响其他对象。

<img :src="$withBase('/JavaScript/Copy01.png')" alt="ShallowOrDeep"/>

``` javascript
// 赋值
let obj1 = { 
	name: 'Js',
    arr: [1, [2, 3], 4]
};
let obj2 = obj1;
obj2.name = 'HTML';
obj2.arr[1] = [5, 6, 7];
console.log('obj1',obj1); // obj1 {name: "HTML", arr: [1, [5, 6, 7], 4]}
console.log('obj2',obj2); // obj2 {name: "HTML", arr: [1, [5, 6, 7], 4]}
```

``` javascript
// 浅拷贝
let obj1 = { 
	name: 'Js',
    arr: [1, [2, 3], 4]
};
let obj2 = shallowClone(obj1);
obj2.name = 'HTML';
obj2.arr[1] = [5, 6, 7];
function shallowClone(source) { 
	let target = {};
    for(let i in source) { 
     	if (source.hasOwnProperty(i)) { 
        	target[i] = source[i];	
        }
    }
    return target;
}
console.log('obj1',obj1); // obj1 {name: "Js", arr: [1, [5, 6, 7], 4]}
console.log('obj2',obj2); // obj2 {name: "HTML", arr: [1, [5, 6, 7], 4]}
```

``` javascript
// 深拷贝
let obj1 = { 
	name: 'Js',
    arr: [1, [2, 3], 4]
};
let obj2 = deepClone(obj1);
obj2.name = 'HTML';
obj2.arr[1] = [5, 6, 7];
function deepClone(source) { 
    if (source === null) return source;// 为空返回
	if (typeof source !== "object") return source;// 为基本类型返回
    if (source instanceof Data) return new Data(source);// 为日期类型返回创建的新实例
    if (source instanceof RegExp) return new RegExp(source);// 为正则表达式类型返回创建的新实例
    // 创建一个新实例（.constructor()返回创建source的类型，比如source为Object类型时相当于let target = new Object()）
    let target = new source.constructor();
    for(let key in source) { 
    	if (source.hasOwnProperty(key)) { 
            // 实现递归拷贝
        	target[key] = deepClone(source[key]);
        }
    }
    return target;
}
console.log('obj1',obj1); // obj1 {name: "Js", arr: [1, [2, 3], 4]}
console.log('obj2',obj2); // obj2 {name: "HTML", arr: [1, [5, 6, 7], 4]}
```

---

## 实现浅拷贝

### 1.Object.assign()

Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。

当要拷贝的数据只有一层时，也可以称该过程为深拷贝。

``` javascript
let obj1 = { name: 'Js', arr: [1, [2, 3], 4]};
let obj2 = Object.assign({}, obj1);
obj2.name = 'HTML';
obj2.arr[0] = 2; // 注意此处
obj2.arr[1] = [5, 6, 7];
console.log(obj1); // obj1 {name: "Js", arr: [2, [5, 6, 7], 4]}
console.log(obj2); // obj2 {name: "HTML", arr: [2, [5, 6, 7], 4]}
```

### 2.扩展运算符... 

``` javascript
let obj1 = { name: 'Js', arr: [1, [2, 3], 4]};
let obj2 = {...obj1};
obj2.name = 'HTML';
obj2.arr[0] = 2;
obj2.arr[1] = [5, 6, 7];
console.log(obj1); // obj1 {name: "Js", arr: [2, [5, 6, 7], 4]}
console.log(obj2); // obj2 {name: "HTML", arr: [2, [5, 6, 7], 4]}
```

### 3.Array.prototype.concat() or Array.prototype.slice()

两个函数的过程类似。

``` javascript
let obj1 = [1, [2, 3], {name: 'Js'}];
let obj2 = obj1.slice(); // let obj2 = obj1.concat();
obj2[0] = 2;
obj2[1] = [5, 6, 7];
obj2[2].name = 'HTML';
console.log(obj1); // obj1 {[1, [2, 3]], name: "HTML"}
console.log(obj2); // obj2 {[2, [5, 6, 7]], name: "HTML"}
```

Ps:根据以上结果，对于操作的数据是对象还是数组的不同，第一层看似有所不同，很可能是数组转化成对象时发生了某些变化。

## 实现深拷贝

### 1.JSON.parse(JSON.stringify())

此方法**只能用于数组或者对象的深拷贝，不能处理函数和正则**，本质上是利用 JSON.stringify 将对象转换成 JSON 字符串，再用 JSON.parse 把字符串解析成新对象，并且开辟新的内存空间。对于函数操作后会得到 null，对于正则操作后会得到空对象。

``` javascript
let obj1 = [1, [2, 3], {name: 'Js'}];
let obj2 = JSON.parse(JSON.stringify(obj1));
obj2[0] = 2;
obj2[1] = [5, 6, 7];
obj2[2].name = 'HTML';
console.log(obj1); // obj1 {[1, [2, 3]], name: "JS"}
console.log(obj2); // obj2 {[2, [5, 6, 7]], name: "HTML"}
```

### 2.手写递归方法

在上面的赋值与浅拷贝与深拷贝//深拷贝中，我们已经尝试写过 deepClone 方法，但是有几个问题没有解决，比如循环引用。循环引用就是对象的属性直接或者间接调用对象自身的情况，如`source.source = source;`如果我们仍然使用原来的 deepClone 将会导致递归进入死循环、栈内存溢出。

``` javascript
// 测试用例
let obj1 = { 
	name: 'Js',
    arr: [1, [2, 3], 4]
};
obj1.obj1 = obj1;
let obj2 = deepClone(obj1);
console.log(obj2); // Uncaught RangeError: Maximum call stack size exceeded 栈内存溢出
```

为了解决循环引用问题，我们需要给当前对象和拷贝对象的映射关系开辟一个空间，拷贝之前先去这个空间中查看该对象是否被拷贝过，如果有就直接返回，如果没有就继续拷贝。

使用 WeakMap 代替 Map 的好处是减少内存的消耗，并且不干扰垃圾回收机制，但是要注意，由于 WeakMap 是弱引用，所以它的 key 值是不可枚举的。详情参考 MDN [Why WeekMap](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)。

``` javascript
function deepCloneUp(source, map = new WeakMap()) { 
    if (source === null) return source;// 为空返回
	if (typeof source !== "object") return source;// 为基本类型返回
    if (source instanceof Data) return new Data(source);// 为日期类型返回创建的新实例
    if (source instanceof RegExp) return new RegExp(source);// 为正则表达式类型返回创建的新实例
    // 判断是否拷贝过该对象,有的话直接返回
    if (map.get(source)) return map.get(source);
    let target = new source.constructor();
    // 设置当前对象与拷贝对象的映射关系
    map.set(source, target);
    for(let key in source) { 
    	if (source.hasOwnProperty(key)) { 
            // 实现递归拷贝
        	target[key] = deepCloneUp(source[key], map);
        }
    }
    return target;
}

let obj1 = { 
	name: 'Js',
    arr: [1, [2, 3], 4]
};
obj1.obj1 = obj1;
let obj2 = deepCloneUp(obj1);
console.log(obj2);
```

### 3.关于其他类型的深拷贝

函数类型，由于没有什么实际的应用场景，并没有过多考虑，当然还是有解决的方案的。比如箭头函数使用`eval(func.tostring())`。对于普通函数来说，没有什么常规的写法可以解决，毕竟只要改变this的指向，没有什么实际意义，当然，可以使用正则表达式的方法来写，可以分别使用正则取出函数体和函数参数，然后使用`new Function ([arg1[, arg2[, ...argN]],] functionBody)`构造一个新的函数，这里不做深入的研究。



参考文章 [JavaScript核心进阶](https://www.jianshu.com/p/cd3fee40ef59)、[JavaScropt深浅拷贝](https://segmentfault.com/a/1190000017489663)、[如何写出惊艳面试官的深浅拷贝](https://segmentfault.com/a/1190000020255831)。