# Object-继承

继承是面向对象编程中讨论最多的话题。很多面向对象语言都支持两种继承：接口继承和实现继承。前者只继承方法签名，后者继承实际的方法。接口继承在 ECMAScript 中是不可能的，因为函数没有签名。实现继承是 ECMAScript 唯一支持的继承方式，而这主要是通过原型链实现的。

## 原型链继承

ECMA-262 把原型链定义为 ECMAScript 的主要继承方式。其基本思想就是通过原型继承多个引用类型的属性和方法。如果原型是另一个类型的实例，那么这个原型本身有一个内部指针指向另一个原型，相应地另一个原型也有一个指针指向另一个构造函数。这样就在实例和原型之间构造了一条原型链。这就是原型链的基本构想。

以下例子中，Type 通过创建 SuperType 的实例并将其赋值给自己的原型 Type.prototype 实现了对 SuperType 的继承：

```javascript
function SuperType() {
  // 在构造函数中定义
  this.superProperty = true;
}
// 在原型中定义
SuperType.prototype.getSuperValue = function() {
  return this.superProperty;
}

function Type() {
  this.property = false;
}
Type.prototype = new SuperType();
Type.prototype.getValue = function() {
  return this.property;
}
let instance = new Type();
console.log(instance.getSuperValue()); // true
console.log(instance.getValue()); // false

console.log(SuperType.prototype.constructor); // [Function: SuperType]
console.log(Type.prototype.constructor); // [Function: SuperType]
console.log(instance.constructor); // [Function: SuperType]

console.log(SuperType.prototype); // { getSuperValue: [Function (anonymous)] }
console.log(Type.prototype); // SuperType { superProperty: true, getValue: [Function (anonymous)] }
```

实现继承的关键是，Type 将原型替换成了 SuperType 的实例，这样一来，Type 的实例不仅能获取 SuperType 的属性和方法，而且还与 SuperType 的原型挂上了钩：instance 的 [[Prototype]] 指向 Type.prototype，Type.prototype 的 [[Prototype]] 指向 SuperType.prototype。

需要注意的是，现在 getSuperValue() 方法存在于 SuperType.prototype 上，而 superProperty 作为实例属性传递给了 Type.prototype（看最后两条console）。同时，Type.prototype 的 constructor 被重写为SuperType， instance.constructor 也指向 SuperType。

默认情况下，所有引用类型都继承自 Object，这也是通过原型链实现的，同时，任何函数的默认原型都是一个 Object 的实例，这意味着这个实例有一个内部指针指向 Object.prototype。

### 原型链继承的问题

与原型一样，原型链也存在引用值传递的问题。

```javascript
function SuperType() {
  this.colors = ['red', 'yellow', 'blue'];
}
function Type1() {}
function Type2() {}
Type1.prototype = new SuperType();
Type2.prototype = new SuperType();
let instance1 = new Type1();
let instance2 = new Type1();
let instance3 = new Type2();
instance1.colors.push('gray');s
console.log(instance1.colors); // [ 'red', 'yellow', 'blue', 'gray' ]
console.log(instance2.colors); // [ 'red', 'yellow', 'blue', 'gray' ]
console.log(instance3.colors); // [ 'red', 'yellow', 'blue' ]
```

在这个例子中，SuperType 构造函数定义了一个 colors 属性，包含一个引用值（数组）。每个 SuperType 的实例都会有自己的 colors 属性。但是当 Type1 通过原型继承 SuperType 后，Type1.prototype 变成了 SuperType 的一个实例，然后自己又摇身一变成为了别的实例的原型，那么这个 colors 实例属性同时也就变成了原型属性，通过Type1 定义的实例对象共享这个原型属性的引用，因而其中一个实例改变该值，会影响到其他实例。

原型链的第二个问题是，子类型在实例化时不能给父类型的构造函数传参。事实上，我们无法在不影响所有对象实例的情况下把参数传进父类的构造函数。再加上之前提到的原型中包含引用值的问题，就导致原型链基本不会被单独使用。

```javascript
function SuperType(name) {
  this.name = name;
}
// 这里的this是SuperType
function Type() {
	console.log(this); // SuperType {}
}
Type.prototype = new SuperType();
// 实际上参数是传给SuperType
let instance1 = new Type('Wang');
let instance2 = new Type('Chen');
console.log(instance1.name); // undefined
console.log(instance2.name); // undefined
```

## 构造函数继承

为了解决引用值的问题，一种叫做“盗用构造函数”的技术在社区中流行起来，它有时候也称作“对象伪装”或者“经典继承”。其思路是：在子类构造函数中调用父类构造函数。因为毕竟函数就是在特定上下文中执行代码的简单对象，所以可以使用 apply() 和 call() 方法以新创建的对象为上下文执行构造函数。来看下面的例子：

```javascript
function SuperType() {
  this.colors = ['red', 'yellow', 'blue'];
}
function Type() {
  SuperType.call(this);
}
let instance1 = new Type();
let instance2 = new Type();
instance1.colors.push('gray');
console.log(instance1.colors); // [ 'red', 'yellow', 'blue', 'gray' ]
console.log(instance2.colors); // [ 'red', 'yellow', 'blue' ]
```

通过使用 call()（或 apply()）方法，SuperType 构造函数在为 Type 的实例创建的新对象的上下文中执行了。**这相当于新的 Type 对象上运行了 SuperType() 函数中的所有初始化代码。**结果就是每个实例都会有自己的 colors 属性。

相比于原型链继承，盗用构造函数的一个优点是可以子类型在实例化时可以向父类构造函数传参。

```javascript
function SuperType(name) {
	this.name = name;
}
function Type(name) {
	// 继承 SuperType 并传参
	SuperType.call(this, name); 
	// 实例属性
	this.age = 18;
  console.log(this); // Type { name: 'Wang', age: 18 }
}
let instance1 = new Type("Wang");
let instance2 = new Type("Chen");
console.log(instance1.name); // Wang
console.log(instance1.age); // 18
console.log(instance2.name); // Wang
console.log(instance2.age); // 18
```

### 构造函数继承的问题

盗用构造函数的主要缺点，也是使用构造函数模式自定义类型的问题：必须在构造函数中定义方法，因此函数不能重用。此外，子类也不能访问父类原型上定义的方法，因此所有类型只能使用构造函数模式。由于存在这些问题，盗用构造函数基本上也不能单独使用。

## 组合继承

**组合继承**（有时候也叫伪经典继承）综合了原型链和盗用构造函数，将两者的优点集中了起来。基本的思路是使用原型链继承原型上的属性和方法，而通过盗用构造函数继承实例属性。这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性。

```javascript
function SuperType(name) {
	this.name = name;
	this.colors = ['red', 'blue', 'green'];
	console.log(this);
}
SuperType.prototype.sayName = function () {
	console.log(this.name);
};
function Type(name, age) {
	// 继承属性
	SuperType.call(this, name); // Type { name: 'Wang', colors: [ 'red', 'blue', 'green' ] }，这里是SuperType的console
	this.age = age;
	console.log(this); // Type { name: 'Wang', colors: [ 'red', 'blue', 'green' ], age: 18 }
}
// 继承方法
Type.prototype = new SuperType(); // SuperType { name: undefined, colors: [ 'red', 'blue', 'green' ] }，这里是SuperType的console
Type.prototype.sayAge = function () {
	console.log(this.age);
};
let instance1 = new Type('Wang', 18);
instance1.colors.push('black');
console.log(instance1.colors); // [ 'red', 'blue', 'green', 'black' ]
instance1.sayName(); // Wang
instance1.sayAge(); // 18
let instance2 = new Type('Chen', 18);
console.log(instance2.colors); // [ 'red', 'blue', 'green' ]
instance2.sayName(); // Chen
instance2.sayAge(); // 18
```

Type 构造函数调用了 SuperType 构造函数，传入了 name 属性，同时定义了自己的 age 属性，这让 Type 的实例可以自定义自己的属性；同时，Type 的实例可以共享 SuperType 的 sayName() 方法，又能共享 Type 新增的 sayAge() 方法；再者，两个 Type 的实例获得了各自的 colors 属性，修改时也不会影响到别的实例。

> 此处 node 环境没有打出正确的结果，留个坑，不知道是谁的问题

### 优缺点

组合继承弥补了原型链和盗用构造函数的不足，是 JavaScript 中**使用最多**的继承模式。而且组合继承也保留了 instanceof 操作符和 isPrototypeOf()方法识别合成对象的能力。

## 原型式继承

在 ES5 中，这个继承方式已经被规范化了，它成为了 Object.create() 方法。来看看它的前身：

```javascript
function object(o) {
	function F() {}
	F.prototype = o;
	return new F();
}
let person = {
	name: 'Nicholas',
	friends: ['Shelby', 'Court', 'Van'],
};
let anotherPerson = object(person);
anotherPerson.name = 'Greg';
anotherPerson.friends.push('Rob');
let yetAnotherPerson = object(person);
yetAnotherPerson.name = 'Linda';
yetAnotherPerson.friends.push('Barbie');
console.log(person.friends); // [ 'Shelby', 'Court', 'Van', 'Rob', 'Barbie' ]
```

这个 object() 函数会创建一个临时构造函数，将传入的对象赋值给这个构造函数的原型，然后返回这个临时类型的一个实例。本质上，object() 是对传入的对象执行了一次浅复制。

这个继承方式很像原型继承，只不过用 object() 进行了封装，anotherPerson 和 yetAnotherPerson 将会获取到模板对象 person 中共同的值，同时，person.friends 不仅是person 的属性，也会跟 anotherPerson 和 yetAnotherPerson 共享。

Object.create() 接收两个参数：作为新对象原型的对象，以及给新对象定义额外属性的对象（第二个可选），在只接收一个参数的情况下与这里的 object() 效果相同。第二个参数是一个对象，它可以对被定义的属性进行拓展，添加一些属性描述符，这与 Object.defineProperties() 的第二个参数一样。

### 优缺点

原型式继承非常适合不需要单独创建构造函数，但仍然需要在对象间共享信息的场合。但要记住，属性中包含的引用值始终会在相关对象间共享，跟使用原型模式是一样的。

## 寄生式继承

与原型式继承比较接近的一种继承方式是寄生式继承（parasitic inheritance），也是 Crockford 首倡的一种模式。寄生式继承背后的思路类似于寄生构造函数和工厂模式：创建一个实现继承的函数，以某种方式增强对象，然后返回这个对象。

通俗的讲，寄生式继承就是在**返回新对象的函数**的基础上，对新对象进行增强，这样，它不仅可以获得模板对象的属性，还可以通过增强获取到新的属性或者方法：

```javascript
// 这里的object()不是必须的，只不过它刚好返回新对象
function object(o) {
	function F() {}
	F.prototype = o;
	return new F();
}
function createAnother(original) {
	let clone = object(original); // 通过调用函数创建一个新对象
	// 以某种方式增强这个对象
    clone.sayHi = function () {
		console.log('hi');
	};
	return clone; // 返回这个对象
}
let person = {
	name: 'Nicholas',
	friends: ['Shelby', 'Court', 'Van'],
};
let anotherPerson = createAnother(person);
anotherPerson.sayHi(); // hi
```

这个例子基于 person 对象返回了一个新对象。新返回的 anotherPerson 对象具有 person 的所有属性和方法，还有一个新方法叫 sayHi()。

### 优缺点

寄生式继承同样适合主要关注对象，而不在乎类型和构造函数的场景。通过寄生式继承给对象添加函数会导致函数难以重用，与构造函数模式类似。

## 寄生式组合继承

组合继承其实也存在效率问题。最主要的效率问题就是父类构造函数始终会被调用两次：一次在是创建子类原型时调用，另一次是在子类构造函数中调用。本质上，子类原型最终是要包含超类对象的所有实例属性，子类构造函数只要在执行时重写自己的原型就行了。看以下组合继承的例子：

```javascript
function SuperType(name) {
	this.name = name;
	this.colors = ['red', 'blue', 'green'];
}
SuperType.prototype.sayName = function () {
	console.log(this.name);
};
function Type(name, age) {
	SuperType.call(this, name); // 第二次调用 SuperType()
	this.age = age;
}
Type.prototype = new SuperType(); // 第一次调用 SuperType()
Type.prototype.constructor = Type;
Type.prototype.sayAge = function () {
	console.log(this.age);
};
let instance1 = new Type("Wang", 18);
```

在上面代码执行后，Type.prototype 上会有两个属性：name 和 colors。它们都是 SuperType 的实例属性，但现在成为了 Type 的原型属性。在调用 Type 构造函数时，也会调用 SuperType 构造函数，这一次会在新对象上创建实例属性 name 和 colors，这两个实例属性会遮蔽原型上同名的属性。这样就会造成性能的浪费，明明从来没有用过 Type.prototype 的一些属性，却还是定义了：

```javascript
console.log(Object.getOwnPropertyDescriptors(Type.prototype));
// colors: {value: Array(3), writable: true, enumerable: true, configurable: true}
// constructor: {writable: true, enumerable: true, configurable: true, value: ƒ}
// name: {value: undefined, writable: true, enumerable: true, configurable: true}
// sayAge: {writable: true, enumerable: true, configurable: true, value: ƒ}

console.log(Object.getOwnPropertyDescriptors(instance1));
// age: {value: 18, writable: true, enumerable: true, configurable: true}
// colors: {value: Array(3), writable: true, enumerable: true, configurable: true}
// name: {value: "Wang", writable: true, enumerable: true, configurable: true}

```

寄生式组合继承通过盗用构造函数继承属性，但使用混合式原型链继承方法。基本思路是不再通过调用父类构造函数给子类原型赋值，而是**取得父类原型的一个副本**。说到底就是使用寄生式继承来继承父类原型，然后将返回的新对象赋值给子类原型。来看看下面的例子：

```javascript
function inheritPrototype(Type, superType) {
	let prototype = Object.create(superType.prototype); // 创建对象
	prototype.constructor = Type; // 增强对象
	Type.prototype = prototype; // 赋值对象
}
function SuperType(name) {
	this.name = name;
	this.colors = ['red', 'blue', 'green'];
}
SuperType.prototype.sayName = function () {
	console.log(this.name);
};
function Type(name, age) {
	SuperType.call(this, name);
	this.age = age;
}
inheritPrototype(Type, SuperType);
Type.prototype.sayAge = function () {
	console.log(this.age);
};
let instance1 = new Type("Wang", 18);
```

这里 inheritPrototype() 函数实现了寄生式组合继承的核心逻辑。这个函数接收两个参数：子类构造函数和父类构造函数。在这个函数内部，第一步是创建父类原型的一个副本。然后，给返回的 prototype 对象设置 constructor 属性，解决由于重写原型导致默认 constructor 丢失的问题。最后将新创建的对象赋值给子类型的原型。

替换掉了原本的 `Type.prototype = new SuperType();`，现在 SuperType 只会被调用一次，避免了 Type.prototype 上不必要也用不到的属性，因此可以说这个例子的效率更高。

```javascript
console.log(Object.getOwnPropertyDescriptors(Type.prototype));
// constructor: {writable: true, enumerable: true, configurable: true, value: ƒ}
// sayAge: {writable: true, enumerable: true, configurable: true, value: ƒ}

console.log(Object.getOwnPropertyDescriptors(instance1));
// age: {value: 18, writable: true, enumerable: true, configurable: true}
// colors: {value: Array(3), writable: true, enumerable: true, configurable: true}
// name: {value: "Wang", writable: true, enumerable: true, configurable: true}
```

使用寄生式组合继承，原型链仍然保持不变，因此 instanceof 操作符和isPrototypeOf()方法正常有效。寄生式组合继承可以算是引用类型继承的最佳模式。

