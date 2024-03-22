# Promise

ES6 及以后几个大版本加大了堆异步编程机制的支持，正式增加了 Promise 引用类型，以及在后续版本加入了 async 和 await 关键字定义异步函数的机制。

## 异步编程

同步行为和异步行为的对立统一是计算机科学的一个基本概念。特别是在 JavaScript 这种单线程事件循环模型中，同步操作与异步操作更是代码所要依赖的核心机制。异步行为是为了优化因计算量大而时间长的操作。如果在等待其他操作完成的同时，即使运行其他指令，系统也能保持稳定，那么这样做就是务实的。

### 以往的异步编程模式

在早期的 JavaScript 中，只支持定义回调函数来表明异步操作完成。串联多个异步操作是一个常见的问题，通常需要深度嵌套的回调函数（俗称”回调地狱“）来解决。

```javascript
function double(value) {
    setTimeout(() => setTimeout(console.log, 0, value * 2), 1000);
}
double(3);
```

随着代码越来越复杂，回调策略是不具有扩展性的，维护这样的代码简直就是噩梦，于是 Promise 提上日程。

## Promise

ES6 引入了 Promise 类型，可以通过 new 操作符来实例化，创建 Promise 时需要传入执行器（executor）函数作为参数，不传抛出 SyntaxError。一个简单的例子：

```javascript
let p = new Promise(() => {});
setTimeout(console.log, 0, p); // Promise { <pending> }
```

Promise 有三种状态：

- 待定（peding）
- 兑现（fulfilled，有时候称为解决，resolved）
- 拒绝（rejected）

Promise 一开始是 peding 状态，通过某些操作后，peding 可能会落定（settle）为代表成功的 fulfilled 或者代表失败的 rejected，这个过程不可逆转，落定后的状态不可再改变。最重要的是，该状态是私有的，不能通过 JavaScript 检测到，这主要是为了避免根据读取到的状态，以同步的方式处理 Promise 对象。

Promise 的状态是私有的，只能通过内部的执行器函数中完成，执行器函数主要有两项职责：初始化 Promise 的异步行为和控制状态的最终转换。控制状态的转换主要由两个函数参数实现，分别为 resolve() 和 reject()。每个期约只要状态发生切换，就会有一个私有的内部值或者理由，默认值是 undefined。

### Promise.resolve()

是一个幂等方法：

```javascript
let p = Promise.resolve(7);
setTimeout(console.log, 0, p === Promise.resolve(Promise.resolve())); // true
```

### Promise.reject()

不是一个幂等方法，传入一个期约对象将变成它返回拒绝期约的理由：

```javascript
setTimeout(console.log, 0, Promise.reject(Promise.resolve())); /// Promise <rejected>: Promise <resolved> 
```

Promise.reject() 会实例化一个拒绝的期约并抛出一个异步错误，这个错误不能由 try/catch 捕获，而只能通过拒绝处理程序捕获。

```javascript
try { 
 throw new Error('foo'); 
} catch(e) { 
 console.log(e); // Error: foo 
} 
try { 
 Promise.reject(new Error('bar')); 
} catch(e) { 
 console.log(e); 
} 
// Uncaught (in promise) Error: bar
```

这里的同步代码之所以没有捕获期约抛出的错误，是因为它没有通过异步模式捕获错误。

### Promise.prototype.then()

这个方法用于给期约实例添加处理程序，接受两个函数类型的参数：onResolved 和 onRejected。

Promise.prototype.then() 方法返回一个新的期约实例，这个实例基于 onResolved 处理程序的返回值构建，也就是通过 Promise.resolve() 包装来生成新期约：

```javascript
let p1 = Promise.resolve('foo');

// 不传处理程序，原样向后传
let p2 = p1.then();
setTimeout(console.log, 0, p2); // Promise <resolved>: foo

// 正常情况下
let p3 = p1.then(() => 'baz');
setTimeout(console.log, 0, p3); // Promise <resolved>: baz

// 抛出异常会返回拒绝的期约
let p4 = p1.then(() => {throw 'baz'})
// Uncaught (in promise) baz
setTimeout(console.log, 0, p4); // Promise <rejected>: baz
```

onRejected 处理程序也类似，同样通过 Promise.resolve() 包装。要注意 onRejected 处理程序的任务是捕获异步错误，这个过程符合期约的行为，所以返回一个 resolved。

```javascript
let p1 = Promise.reject('foo');

// 不传处理程序，原样向后传
let p2 = p1.then();
setTimeout(console.log, 0, p2); // Promise <rejected>: foo

// 正常情况下，注意then的参数
let p3 = p1.then(null, () => 'baz');
setTimeout(console.log, 0, p3); // Promise <resolved>: baz

// 抛出异常仍然返回拒绝的期约
let p4 = p1.then(null, () => {throw 'baz'})
// Uncaught (in promise) baz
setTimeout(console.log, 0, p4); // Promise <rejected>: baz
```

### Promise.prototype.catch()

一个语法糖，相当于调用 Promise.prototype.then(null, onRejected)

### Promise.prototype.finally()

这个方法会添加 onFinally 处理程序，这个处理程序与状态无关，在大多数情况下表现为父期约的传递，主要用于添加清理代码。当然，如果返回的是待定的期约或者抛出错误，则处理程序会返回相应的期约。

## Promise 连锁与合成

​	把期约串联起来是一种有用的编程模式。要真正执行异步任务，可以让每个执行器都返回一个期约实例。这样就可以让每个后续期约都等待之前的期约，也就是串行化异步任务。

```javascript
function delayedResolve(str) { 
 return new Promise((resolve, reject) => { 
 console.log(str); 
 setTimeout(resolve, 1000); 
 }); 
} 
delayedResolve('p1 executor') 
 .then(() => delayedResolve('p2 executor')) 
 .then(() => delayedResolve('p3 executor')) 
 .then(() => delayedResolve('p4 executor')) 
// p1 executor（1 秒后）
// p2 executor（2 秒后）
// p3 executor（3 秒后）
// p4 executor（4 秒后）
```

每个后续的处理程序都会等待前一个期约解决，然后实例化一个新期约并返回它。这种结构可以简洁地将异步任务串行化，解决之前依赖回调的难题，也就是地狱回调。
