# Function-闭包

闭包指的是那些引用了另一个函数作用域中变量的函数，通常是在嵌套函数中实现的。来看一个简单的例子：

```javascript
function foo() {
	let local = 0;
	return function bar() {
		local++;
		console.log(local);
	}
}
const fn1 = foo();
const fn2 = foo();
fn1(); // 1
fn1(); // 2
fn2(); // 1
fn2(); // 2
```

每个执行上下文都会有一个包含其中变量的对象，全局上下文中叫变量对象，它会始终存在于代码的执行期间，函数局部上下文中叫活动对象，只在函数执行期间存活。一般在函数执行完毕后，局部活动对象就会被销毁，但是闭包不一样。

在函数内部定义的函数，会把其外层函数的活动对象添加到自己的作用域链中，在上面的例子中，bar() 函数的作用域链中包含 foo() 函数的活动对象，就算 foo() 执行完毕，其活动对象并不会被销毁，因为 bar() 函数的作用域链中仍然有对它的引用。

可以手动释放该内存：`fn1 = null`。

> 注意：因为闭包会保留它们包含函数的作用域，所以比其他函数更占用内存。过度使用闭包可能导致内存过度占用，因此建议仅在十分必要时使用。V8 等优化的 JavaScript 引擎会努力回收被闭包困住的内存，不过还是建议在使用闭包时要谨慎。

### 闭包中的this

在闭包中使用 this 会让代码变复杂。如果内部函数没有使用箭头函数定义，则 this 对象会在运行时绑定到执行函数的上下文。内部函数在这种情况下不会绑定到某个对象，这就意味着 this 会指向 window。

```javascript
window.identity = 'The Window';
let object = {
	identity: 'My Object',
	getIdentityFunc() {
		return function () {
			return this.identity;
		};
	},
};
console.log(object.getIdentityFunc()()); // 'The Window'
```

之所以这样，是因为内部函数永远不可能直接访问外部函数的 this 和 arguments。 

```javascript
function fn1() {
	this.a = 1;
	console.log(this);
	function fn2() {
		console.log(this);
	}
	fn2();
}
let o = {
	a: 2,
};
o.fn1 = fn1;
o.fn1();
// 第一个this指向o，第二个this指向window
```

可以通过 that 保存 this 达到访问外部函数 this 的需求：

```javascript
window.identity = 'The Window';
let object = {
	identity: 'My Object',
	getIdentityFunc() {
        // 保存外部this
		let that = this;
		return function () {
			return that.identity;
		};
	},
};
console.log(object.getIdentityFunc()()); // 'My Object'
```

除了闭包之外，单纯调用 this 也可能产生奇怪的结果：

```javascript
window.identity = 'The Window';
let object = {
	identity: 'My Object',
	getIdentity() {
		return this.identity;
	},
};
console.log(object.getIdentity());
let fn = (object.getIdentity = object.getIdentity)
console.log(fn()); // ’The Window‘
```

第一条调用，this 本身就相当于 object，第二条调用，因为赋值表达式的值是函数本身，this 值不再与任何对象绑定，即现在的 this 指向 window。第二条有点类似闭包的操作，()里的赋值就相当于 object.getIdentity return 一个匿名函数，然后赋值给 fn 保证引用一直存在。

### 内存泄漏

由于闭包一直引用着外部函数的活动对象，导致垃圾回收机制不能正常回收这一块内存，所以会造成内存泄漏，正确的做法是，明确自己想要什么，在必要的时候把引用指向 null，让引用计数正常减少以方便垃圾回收。

### 私有变量

任何定义在函数或块中的变量，都可以认为是私有的，因为在这个函数或块的外部无法访问其中的变量。私有变量包括函数参数、局部变量，以及函数内部定义的其他函数。

基于闭包，可以创建出能够访问私有变量的公有方法。这种方法叫做特权方法（privileged method）。在对象上有两种方式创建特权方法。第一种是在构造函数中实现：

```javascript
function MyObject() {
	let privateVal = 10;
	function privateFunc() {
			return false;
	}
	this.publicMethod = function() {
			console.log(privateVal++);
			console.log(privateFunc());
	};
}
let o = new MyObject();
console.log(o.privateVal); // undefined
o.publicMethod(); // 10 false
```

创建 MyObject() 后，实例不能直接访问私有变量，但是可以通过特权函数访问，这是因为特权函数是一个闭包，它具有访问构造函数中定义的所有变量和函数的能力。通过构造函数来实现其实会有一个问题，那就是每个实例都会重新创建一遍新方法。

第二种是通过使用私有作用域定义私有变量和函数来实现。

```javascript
(function() {
	let privateVal = 10;
	function privateFunc() {
			return false;
	}
	MyObject = function() {};
	MyObject.prototype.publicMethod = function() {
		console.log(privateVal++);
		console.log(privateFunc());
	};
})();
let o = new MyObject();
console.log(o.privateVal); // undefined
o.publicMethod(); // 10 false
```

这里声明 MyObject 时没有使用关键字，使之成为全局变量，方便外部访问。这个模式与前一个模式的主要区别是，私有变量和私有函数是由实例共享的，因为特权方法定义在原型上，所以同样也是由实例共享的。所以如果有其中一个实例通过特权方法改变了私有变量，那么另一个实例也将访问到新的变量。

### 模块模式

模块模式是指在单例对象基础上加以扩展，使其通过作用域链来关联私有变量和特权方法，以实现与上面相同的隔离和封装。单例对象（singleton）就是只有一个实例的对象。按照惯例，JavaScript 是通过对象字面量来创建单例对象的。有如下例子：

```javascript
let singleton = function() {
	let privateVal = 10;
	function privateFunc() {
		return false;
	}
	// 特权方法和公共属性
	return {
		publicVal: true,
		publicMethod() {
			console.log(privateVal++);
			console.log(privateFunc());
		}
	};
}();
console.log(singleton.privateVal); // undefined 
console.log(singleton.publicVal); // true
singleton.publicMethod(); // 10 false
```

本质上，对象字面量定义了单例对象的公共接口。在 Web 开发中，经常需要使用单例对象管理应用程序级的信息。

### 小结

产生闭包的核心有两步，第一步是需要预扫描内部函数，第二步是把内部函数引用的外部变量保存到堆内存中。

闭包的作用域链中包含自己的一个变量对象，然后是包含函数的变量对象，直到全局上下文的变量对象。在编译过程中，JavaScript 引擎一旦碰到闭包，就会在堆空间创建一个 "closure(外部函数)" 的对象，并保存被引用的变量。闭包在被函数返回之后，其作用域会一直保存在内存中，直到闭包被销毁。

**闭包的好处**：

1. 希望一个变量长期存储在内存中。
2. 避免全局变量的污染。
3. 私有成员的存在。

**闭包的缺点**：

1. 常驻内存，增加内存的使用量。
2. 使用不当会很容易造成内存泄漏。

## 函数柯里化

Currying 是把接受多个参数的函数变换成接受一个单一参数的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

```javascript
// 普通的add函数
function add(x, y) {
	return x + y;
}
// Currying后
function curryingAdd(x) {
	return function (y) {
		return x + y;
	};
}
console.log(add(1, 2)); // 3
console.log(curryingAdd(1)(2)); // 3
```
