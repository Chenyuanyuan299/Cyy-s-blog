# Function

函数是 ECMAScript 中最有意思的部分之一，这主要是因为函数实际上是对象。每个函数都是 Function 类型的实例，而 Function 也有属性和方法，跟其他引用类型一样。因为函数是对象，所以函数名就是指向函数对象的指针，而且不一定与函数本身紧密绑定。

## 函数声明

函数通常以函数声明的方式定义：

```javascript
function sum(num1, num2) {
    return num1 + num2;
}
```

也可以使用表达式声明，实际上通过该声明方式声明的函数也称为**匿名函数**（注意函数只是赋值给变量名为 sum 的变量，变量名和函数名不一样）：

```javascript
let sum = function(num1, num2) {
    return num1 + num2;
}
```

还可以使用箭头函数：

```javascript
let sum = (num1, num2) => {
    return num1 + num2;
}
```

> 注意：虽然箭头函数跟匿名函数一样没有名字，但它们还是有区别的

最后一种就是直接使用 Function 构造函数来构造函数，这种方式并不推荐，但是方便理解概念，即把函数想象为对象，把函数名想象为指针是很重要的：

```javascript
let sum = new Function("num1", "num2", "return num1 + num2");
```

事实上，JavaScript 引擎在加载数据时对函数声明和函数表达式是区别对待的。JavaScript 引擎在任何代码执行之前，会先读取函数声明，并在执行上下文中生成函数定义。而函数表达式必须等到代码执行到它那一行，才会在执行上下文中生成函数定义。

```javascript
// 没问题
console.log(sum(10, 10)); // 20
function sum(num1, num2) {
	return num1 + num2;
}
```

以上代码在运行过程中，函数声明会先被读取并添加到执行上下文，这个过程叫做**函数声明提升（function declaration hoisting）**。

如果使用函数表达式，那么该过程就会报错：

```javascript
// 会出错
console.log(sum(10, 10)); // ReferenceError: Cannot access 'sum' before initialization
let sum = function (num1, num2) {
	return num1 + num2;
};
```

就算使用 var 关键字也不行，虽然会有变量提升，但是执行上下文中依然没有该函数的定义。

## 函数内部

在 ES5 中，函数内部存在两个特殊的对象：arguments 和 this。ES6 又新增了 new.target 属性。

### 1. arguments

该对象是一个类数组对象，包含调用函数时传入的所有参数。这个对象只有以关键字 function 定义的函数才有。除了主要用于包含函数参数，它还有一个 callee 属性，这个属性是指向 arguments 对象所在函数的指针。通过一个例子理解它的作用：

```javascript
function factorial(num) {
	if(num <=1 ) {
		return 1;
	} else {
		return num * factorial(num - 1);
	}
}
```

该函数计算一个数的阶乘，只要函数名称不变，就能正常执行，但是如果改变函数名称，将导致一些问题，可以通过 callee 来解决：

```javascript
function factorial(num) {
	if(num <= 1) {
		return 1;
	} else {
		return num * arguments.callee(num - 1);
	}
}
let newFactorial = factorial;
factorial = function() {
	return 0;
}
console.log(factorial(5)); // 0
console.log(newFactorial(5)); // 120
```

### 2. this

在标准函数中，this 引用的是把函数当成方法调用的上下文对象，这时候通常称其为 this 值。在网页全局上下文中调用函数时，this 指向 window。在严格模式下，this 将指向 undefined。

在箭头函数中，this 引用的是定义箭头函数的上下文：

```javascript
window.color = 'red';
let o = {
	color: 'blue',
};
// 此处的sayColor()和o.sayColor()是同一个函数，只不过执行的上下文不同
let sayColor = () => console.log(this.color);
sayColor(); // red
o.sayColor = sayColor;
o.sayColor(); // red
```

在事件回调或者定时回调中，比如定时器，由于 `setTimeout()` 调用的代码运行在与所在函数完全分离的执行环境上，所以可能会导致 this 指向问题，此时的 this 永远指向 window，可以通过箭头函数解决，箭头函数中的 this 会保留定义该函数时的上下文。

```javascript
function King() {
	this.royaltyName = 'Henry';
	// this 引用 King 的实例
	setTimeout(() => console.log(this.royaltyName), 1000);
}
function Queen() {
	this.royaltyName = 'Elizabeth';
	// this 引用 window 对象
	setTimeout(function () {
		console.log(this.royaltyName);
	}, 1000);
}
new King(); // Henry
new Queen(); // undefined
```

### 3. caller

该属性引用的是调用当前函数的函数，如果是在全局作用域中调用的则为 null。

```javascript
function outer() {
	inner();
}
function inner() {
	console.log(arguments.callee.caller); 
}
outer(); // [Function: outer]
```

### 4. new.target

ES6 新增了检测函数是否使用 new 关键字调用的 new.target 属性。这个属性可以检测函数是作为普通函数被调用还是作为构造函数被调用，前者返回 undefined，后者将引用被调用的构造函数。

```javascript
function King() {
	console.log(new.target);
}
new King(); // [Function: King]
King(); // undefined
```

## 函数的属性和方法

函数本身只一个对象，每个函数都有两个属性：length 和 prototype。

length 属性保存函数定义的命名参数的个数。

prototype 是保存引用类型所有实例方法的地方，这意味着 toString()、valueOf() 等方法实际上都保存在 prototype 上，进而由所有实例共享，这个属性在自定义类型时特别重要。在 ES5 中，这个属性不可被枚举（包括 for-in）。

### apply 和 call

函数还有两个方法：apply() 和 call()，这两个方法都会以指定的 this 值来调用函数，也就是说，它们会设置调用函数时函数体内 this 对象的值。

apply() 接收两个参数：this 值和一个参数数组。第二个参数可以是 Array 的实例，也可以是 arguments 对象。

```javascript
function sum(num1, num2) {
	return num1 + num2;
}
function callSum1(num1, num2) {
	return sum.apply(this, arguments); // 传入 arguments 对象
}
function callSum2(num1, num2) {
	return sum.apply(this, [num1, num2]); // 传入数组
}
console.log(callSum1(10, 10)); // 20
console.log(callSum2(10, 10)); // 20
```

call() 方法与 apply() 的作用一样，第一个参数同样是 this 值，但是剩下的参数是逐个传递的：

```javascript
function sum(num1, num2) {
	return num1 + num2;
}
function callSum(num1, num2) {
	return sum.call(this, num1, num2);
}
console.log(callSum(10, 10)); // 20
```

这两个方法强大的地方是控制函数调用上下文即函数体内 this 值的能力，在非严格模式下，如果传入的 this 不是对象，那么会尝试转换它，null 和 undefined 会被转换成全局对象，原始类型将调用对应类型的构造函数转换成对应实例。

### bind

ES5 中引入了一个新的方法：bind()。bind() 方法会创建一个新的函数实例，其 this 值会被绑定到传给 bind() 的对象。

```javascript
window.color = 'red';
var o = {
	color: 'blue',
};
function sayColor() {
	console.log(this.color);
}
let objectSayColor = sayColor.bind(o);
objectSayColor(); // blue
```

### apply、call 与 bind 的区别

apply 与 call 在改变 this 的值的时候，会直接执行，相当于直接返回了该函数，但是 bind 绑定 this 后，并不会直接执行，而是返回一个新的函数，叫做 bound function。

```javascript
let o = {
	a: 1,
};
function fn(b, c) {
	console.log(this.a + b + c);
}
let fn1 = fn.bind(o, 2, 3);
console.dir(fn1)
// arguments: (...)
// caller: (...)
// length: 0
// name: "bound fn"
// __proto__: ƒ ()
// [[TargetFunction]]: ƒ fn(b, c)
// [[BoundThis]]: Object
// [[BoundArgs]]: Array(2)
```

其中，TargetFunction 指向 bind 前的函数，BoundThis 即绑定的 this 指向，BoundArgs 便是传入的参数了。同时，bind 之后 this 将不能再被改变，而 call 是可以改变的。

```javascript
// call
function fn1() {
	console.log('1 ' + this);
}
function fn2() {
	console.log('2 ' + this);
}
fn1.call(fn2);
// 1 function fn2() {
// 	console.log('2' + this);
// }
fn1.call.call(fn2); // 2 [object Window]


// bind 
function fn1() {
	console.log('1 ' + this);
}
function fn2() {
	console.log('2 ' + this);
}
fn1.bind(fn2)();
// 1 function fn2() {
// 	console.log('2' + this);
// }
fn1.bind(fn2).call(fn1);
// 1 function fn2() {
// 	console.log('2' + this);
// }
```

## 递归

递归函数通常的形式是一个函数通过名称调用自己，之前说过可以使用 arguments.callee 来绑定函数本身。假如有一个计算斐波那契数列的函数：

```javascript
function fib(n) {
	if (n < 2) {
		return n;
	}
	return fib(n - 1) + fib(n - 2);
}
```

这是一个简单版本的计算斐波那契数列递归函数，当数值较小时，它可以正常执行，但是一旦数字过大，将导致循环卡死，来看看它的执行过程：

1. 执行到 fib 函数体，第一个栈帧被推到栈上。
2. 执行 fib 函数体到 return，计算返回值必须计算下一个 fib。
3. 执行到下一个 fib 函数体，第二个栈帧被推到栈上。
4. 执行该 fib 函数体到 return，...

只有最外一层函数计算完毕，才能一层一层弹出栈帧，最终返回结果，这也是为啥递归太多次会导致卡死的原因。

可以通过尾调用优化来解决这个问题，尾调用优化的条件就是确定外部栈帧真的没有存在的必要了。涉及的条件如下：

- 代码在严格模式下执行；
- 外部函数的返回值是对尾调用函数的调用；
- 尾调用函数返回后不需要执行额外的逻辑；
- 尾调用函数不是引用外部函数作用域中自由变量的闭包。

很明显，上面的代码并不符合尾调用优化的规则，稍微修改一下之前的代码：

```javascript
// 基础框架，只是传了初值
function fib(n) {
	return fibImpl(0, 1, n);
}
// 执行递归，符合尾调用优化
function fibImpl(a, b, n) {
	if (n === 0) {
		return a;
	}
	return fibImpl(b, a + b, n - 1);
}
```

这样写之后，就会触发尾调用优化，现在的执行过程是：

1. 执行到 fib 函数体，第一个栈帧被推到栈上。
2. 执行 fib 函数体到 return，计算返回值必须计算 fibImpl。
3. 引擎发现把第一个栈帧弹出也没问题，因为 fibImpl 的返回值也是 fib 的返回值。
4. 执行该 fibImpl 函数体到 return，...
5. 计算最后一次调用，直接返回该数值。

在这种情况下，无论调用多少次嵌套函数，都只有一个栈帧，现在可以直接计算 fib(1000)，并且正常返回了。
