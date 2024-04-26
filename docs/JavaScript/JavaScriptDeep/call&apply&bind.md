# call、apply 和 bind

函数有两种执行方式，一种是函数调用，一种是函数应用。

```javascript
// ES6 之后，const 和 let 不能再由全局对象引用到，所以使用 var 定义
var name = "JavaScript"
const obj = {
    name: "CSS"
}
function fn() {
    console.log(this.name)
}

// 函数调用
fn() // undefined

// 函数应用
fn.call(obj) // CSS
```

## 关于 call 和 apply

`call()`与`apply()`就是提供函数应用的方法，它们让函数执行时的 this 指向更为灵活。

call 与 apply 的区别只有参数传递方式不同：

- call 方法中接受的是一个参数列表，第一个参数指向 this，其余的参数在函数执行时都会作为函数形参传入函数。
    `fn.call(this, arg1, arg2, ...)`
- apply 第一个参数作为 this 指向，其它参数都被包裹在一个数组中，在函数执行时同样会作为形参传入。
    `fn.apply(this, [arg1, arg2, ...])`

## 关于 bind

call 与 apply 在改变 this 的同时，就立刻执行，而 bind 绑定 this 后并不会立马执行，而是返回一个新的绑定函数。

```javascript
const obj = {
    a: 1
};

function fn(b, c) {
    console.log(this.a + b + c);
};

let fn1 = fn.bind(obj, 2, 3);

fn1(); // 6
```

一旦执行 bind 之后，this 指向与形参将无法再被改变：

```javascript
const obj2 = {
    a: 2
}
//尝试再次传入形参
fn1(4, 4); // 6

//尝试改变this
fn1.call(obj2); // 6
```

