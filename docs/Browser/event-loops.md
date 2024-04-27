# 事件循环

## 同步与异步

JavaScript 是一门单线程的语言，意味着同一时间只能做一件事。实现单线程非阻塞的方法就是事件循环。

在 JavaScript 中，所有任务都可以分为：

- 同步任务：立即执行的任务，一般会直接进入主线程中执行；
- 异步任务：比如 Ajax 请求、setTimeout 定时函数等；

异步任务不会直接进入主线程，而是进入任务队列，只有异步任务执行完毕后，才通知主线程执行其回调。

## 宏任务与微任务

异步任务还可以细分为宏任务和微任务。

宏任务的时间细粒度比较大，执行的时间间隔不能精确控制，对于一些实时性要求高的场景就不太合适。常见的宏任务有：

- script（可以理解为外层同步代码）；
- setTimeout/setInterval；
- UI rendering/UI 事件；
- postMessage、MessageChannel；
- setImmediate、I/O（Node.js）；

微任务是一个需要异步执行的函数，其回调执行时机是当前宏任务结束之后，下一轮事件循环之前。常见的微任务有：

- Promise.then；
- await 后面的代码执行；
- MutaionObserver（在指定的 DOM 发生变化时被调用）；
- Object.observe（已废弃；Proxy 对象替代）；
- process.nextTick（Node.js）；

```javascript
async function async1() {
	console.log('async1 start');
	await async2();
	console.log('asnyc1 end');
}
async function async2() {
	console.log('async2');
}
console.log('script start');
setTimeout(() => {
	console.log('setTimeOut');
}, 0);
async1();
new Promise(function (reslove) {
	console.log('promise1');
	reslove();
}).then(function () {
	console.log('promise2');
})
console.log('script end');
// script start
// async1 start
// async2
// promise1
// script end
// asnyc1 end
// promise2
// setTimeOut
```

## Node.js 的 Event Loops

Node.js 也是单线程的 Event Loops，但是它的运行机制不同于浏览器环境。Node.js 的运行机制如下：

- V8 引擎解析 JavaScript 脚本；
- 解析后的代码，调用 Node API；
- libuv 库负责 Node API 的执行。它将不同的任务分配给不同的线程，形成一个 Event Loop（事件循环），以异步的方式将任务的执行结果返回给 V8 引擎；
- V8 引擎再将结果返回给用户。

除了 setTimeout 和 setInterval 这两个方法，Node.js 还提供了另外两个与"任务队列"有关的方法：process.nextTick 和 setImmediate。process.nextTick 方法可以在当前执行栈的尾部----下一次 Event Loop（主线程读取"任务队列"）之前----触发回调函数。也就是说，它指定的任务总是发生在所有异步任务之前。setImmediate 方法则是在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次 Event Loop 时执行，这与 setTimeout(fn, 0) 很像。

且多个 process.nextTick 语句总是在当前"执行栈"一次执行完，多个 setImmediate 可能则需要多次 loop 才能执行完。