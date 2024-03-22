# Object-创建对象

创建对象的方式多种多样，并不局限于对象字面量或者构造函数，以下将会更具体地介绍对象的创建，深入理解创建对象的机制。

在 ES5 中，并没有正式支持面向对象的结构，比如类或者继承。接下来将会介绍如何使用原型式继承模拟同样的行为。

在 ES6 中引入了类等概念，事实上，JavaScript 一开始设计是基于原型的设计，类的概念仅仅只是封装了 ES5 中构造函数与原型继承的语法糖而已。

## 工厂模式

工厂模式是一种众所周知的设计模式，广泛应用于软件工程领域，用于抽象创建特定对象的过程。

```javascript
function createPerson(name, age, job) {
	let o = new Object();
	o.name = name;
	o.age = age;
	o.job = job;
	o.sayName = function () {
		console.log(this.name);
	};
	return o;
}
let person1 = createPerson('Nicholas', 29, 'Software Engineer');
let person2 = createPerson('Greg', 27, 'Doctor');
```

### 问题

这里，函数 createPerson() 接收 3 个参数，根据这几个参数构建了一个包含 Person 信息的对象。虽然可以通过这个函数创建多个实例，但是没有解决对象标识的问题，即创建的对象类型无法确定。

## 构造函数模式

ECMAScript 中的构造函数是可以用于创建特定类型对象的，除了原生的一些构造函数，也可以自定义构造函数，改写上面的例子：

```javascript
// 函数声明式
function Person(name, age, job) {
	this.name = name;
	this.age = age;
	this.job = job;
	this.sayName = function () {
		console.log(this.name);
	};
}
let person1 = new Person('Nicholas', 29, 'Software Engineer');
let person2 = new Person('Greg', 27, 'Doctor');
person1.sayName(); // Nicholas
person2.sayName(); // Greg

// 函数表达式
let Person = function(name, age, job) { 
 this.name = name; 
 this.age = age; 
 this.job = job; 
 this.sayName = function() { 
 	console.log(this.name); 
 }; 
}
...
```

这种创建方式与工厂模式的区别是：

- 不用显示创建对象
- 属性和方法直接复制给了 this
- 不需要 return

> 注意：如果要把函数作为构造函数，虽然小写也可以，但是最好最好把函数名的首字母写成大写，这样有助于 ECMAScript 区分构造函数和普通函数。

其中，new 是 JS 历史中一种迫于形式（maybe）的产物，它也是一种语法糖，使用 new 调用构造函数创建实例具体会执行以下操作：

1. 在内存中创建一个新对象。
2. 这个新对象内部的 [[Prototype]] 特性被赋值为构造函数的 prototype 属性。
3. 构造函数内部的 this 被赋值为这个新对象（即 this 指向新对象）。
4. 执行构造函数内部的代码（给新对象添加属性）。
5. 如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象。

上一个例子中，person1 和 person2 分别保存着 Person 的不同实例。这两个对象都有一个 constructor 属性指向 Person，constructor 本来是用于标识对象类型的。不过，一般认为 instanceof 操作符是确定对象类型更可靠的方式。

```javascript
console.log(person1.constructor == Person); // true 
console.log(person2.constructor == Person); // true
console.log(person1 instanceof Object); // true 
console.log(person1 instanceof Person); // true 
console.log(person2 instanceof Object); // true 
console.log(person2 instanceof Person); // true
```

这里 instanceof Object 为 true 的原因是 所有自定义对象都继承自 Object。

 如果直接调用构造函数创建对象，那么 this 将始终指向全局对象：

```javascript
let Person = function(name, age, job) { 
  this.name = name; 
  this.age = age; 
  this.job = job; 
  this.sayName = function() { 
    console.log(this.name); 
  }; 
}
Person("Wang", 18, "Teacher"); // 添加到 window 对象
global.sayName(); // Wang
// 在浏览器中是 window
// window.sayName();
```

### 问题

构造函数虽然解决了对象实例被标识为特定类型的问题，但是仍存在一些问题。如上面的sayName() 方法，在每次创建新的实例时，都会为它们创建一个单独的 sayName() 方法：

```javascript
// 原来的写法
this.sayName = function() { 
    console.log(this.name); 
}; 
// 相当于以下（只是逻辑等价，还是有一些区别）
this.sayName = new Function("console.log(this.name)");
```

>  注意：以第二种方式创建函数会带来不同的作用域链和标识符解析，但从分析问题的角度，这与第一种方式创建函数的机制时一样的。

也就是说，本来我们的想法是，创建许多个不同的实例，每个实例都有自己的特性，同时它们共享 sayName() 这个方法，但是通过构造函数定义的话，person1 和 person2 虽然都有名为 sayName() 的方法，然而这两个方法并不是同一个 Function 实例。虽然可以把 sayName() 定义在全局：

```javascript
function Person(name, age, job){ 
 this.name = name; 
 this.age = age; 
 this.job = job; 
 this.sayName = sayName; 
} 
function sayName() { 
 console.log(this.name); 
}
```

但是这样全局作用域会被污染，同时也失去了原有的封装性。接着看。

## 原型模式

每个函数都会创建一个 prototype 属性，这个属性是一个对象，包含应该由特定引用类型的实例共享的属性和方法。实际上，这个对象就是通过调用构造函数创建的对象的原型。使用原型对象的好处是，在它上面定义的属性和方法可以被对象实例共享。

```javascript
function Person() {}
Person.prototype.name = 'Nicholas';
Person.prototype.age = 29;
Person.prototype.job = 'Software Engineer';
Person.prototype.sayName = function () {
	console.log(this.name);
};
let person1 = new Person();
person1.sayName(); // "Nicholas"
let person2 = new Person();
person2.sayName(); // "Nicholas"
console.log(person1.sayName === person2.sayName); // true
```

### 理解原型

函数创建的 prototype 属性，它将指向原型对象。在原型对象上，会象自动获得一个名为 constructor 的属性，指回与之关联的构造函数，比如以下例子中：`Person.prototype.constructor` 指向 Person。原型对象还会包含给原型对象添加的其他属性和方法。在原型对象里还有一个 `__proto__` 属性， 这个属性是 Firefox、Safari 和 Chrome 暴露出来的，通过这个属性可以访问对象的原型。

```javascript
// prototype:
// 	age: 29
// 	job: "Software Engineer"
// 	name: "Nicholas"
// 	sayName: ƒ ()
// 	constructor: ƒ Person()
// 	__proto__: Object
// ...
function Person() {} 
Person.prototype.name = "Nicholas"; 
Person.prototype.age = 29; 
Person.prototype.job = "Software Engineer"; 
Person.prototype.sayName = function() { 
  console.log(this.name); 
}; 
console.log(Person.prototype.constructor === Person); // true
```

每次调用构造函数创建一个新实例，这个实例的内部 [[Prototype]] 指针就会被赋值为构造函数的原型对象。关键在于理解：实例与构造函数原型之间有直接的联系，但实例与构造函数之间没有。对于上面的例子，可以用一张图描述：

<img :src="$withBase('/JavaScript/Inherit00.png')" alt="prototype"/>

> 注意：实例内部都只有 [[Prototype]] 指向构造函数的原型对象，之所以能够使用原型上的属性或方法是基于对象属性查找机制。

通过 `__proto__` 可以访问实例的原型，原型的 `__proto__` 会指向它的原型...这样的一条由原型组成的链路称为原型链，正常的原型链都会终止于 Object 的原型对象，Object 原型的原型是 null。这可能不好理解，看看以下例子：

```javascript
function Foo() {}
let f1 = new Foo();
console.log(f1.__proto__ === Foo.prototype) // true
console.log(f1.__proto__.constructor === Foo) // true
// 此处f1.constructor访问的是原型对象上的constructor，这基于对象属性查找机制。
console.log(f1.__proto__.constructor === f1.constructor) // true
console.log(Foo.prototype.__proto__ === Object.prototype) // true
console.log(Foo.prototype.__proto__.constructor === Object) // true
console.log(Object.prototype.__proto__ === null) // true
```

用一张图来解释以上关系：

<img :src="$withBase('/JavaScript/Inherit01.png')" alt="prototype"/>

同一个构造函数创建的两个实例将会共享同一个原型对象：

```javascript
function Foo() {}
let f1 = new Foo();
let f2 = new Foo();
console.log(f1.__proto__ === f2.__proto__); // true
```

### 原型层级

之前讲过，在通过对象访问属性时，会按照这个属性的名称开始搜索。搜索开始于对象实例本身。如果在这个实例上发现了给定的名称，则返回该名称对应的值。如果没有找到这个属性，则搜索会沿着指针进入原型对象，然后在原型对象上找到属性后，再返回对应的值。**这就是原型用于在多个对象实例间共享属性和方法的原理。**

实例可以自动继承来自原型对象的属性和方法，也可以通过自定义同名属性来覆盖原型对象上的属性：

```javascript
function Person() {}
Person.prototype.name = 'Nicholas';
Person.prototype.age = 29;
Person.prototype.job = 'Software Engineer';
Person.prototype.sayName = function () {
	console.log(this.name);
};
let person1 = new Person();
let person2 = new Person();
person1.name = 'Greg';
console.log(person1.name, person1.age); // "Greg"，来自实例，29，来自原型
console.log(person2.name); // "Nicholas"，来自原型
```

这样做会屏蔽对原型的访问，就算在实例上把该属性置为 null，也不能恢复访问，除非主动删除该属性：

```javascript
function Person() {}
Person.prototype.name = 'Nicholas';
let person1 = new Person();
let person2 = new Person();
person1.name = 'Greg';
person2.name = 'Wang';
console.log(person1.name); // Greg
console.log(person2.name); // Wang
person1.name = null;
delete person2.name;
console.log(person1.name); // null
console.log(person2.name); // Nicholas
```

### 一些API

#### 作用于原型上

可以使用 isPrototypeOf() 方法确定两个对象之间的关系：

```javascript
function Foo() {}
let f1 = new Foo();
let f2 = new Foo();
console.log(Foo.prototype.isPrototypeOf(f1)); // true 
console.log(Foo.prototype.isPrototypeOf(f2)); // true
```

还可以使用 Object.getPrototypeOf() 方法返回 [[Prototype]] 指向的值，有点类似 `__proto__`：

```javascript
function Foo() {}
let f1 = new Foo();
let f2 = new Foo();
console.log(Object.getPrototypeOf(f1) === Foo.prototype); // true
console.log(Object.getPrototypeOf(Foo.prototype) === Object.prototype); // true
```

与 Object.getPrototypeOf() 方法对应的是 Object.setPrototypeOf()，这个方法可以改变 [[Prototype]] 的指向，它接受两个参数，分别是要改变的对象以及目标对象。

> 注意：该方法可能会严重影响代码的性能，这个影响不仅仅只是执行了该语句这么简单，可能会设计所有访问了被改过 [[Prototype]] 的对象的代码，所以尽量不要使用。

可以使用 Object.create() 来创建一个对象，同时指定其原型：

```javascript
let biped = {
	numLegs: 2,
};
let person = Object.create(biped);
person.name = 'Matt';
console.log(person.name); // Matt
console.log(person.numLegs); // 2
// 此时person的原型对象是biped
console.log(person.__proto__ === biped); // true
console.log(Object.getPrototypeOf(person) === biped); // true
```

hasOwnProperty() 方法用于确定某个属性是在实例上还是在原型对象上。这个方法是继承自 Object 的，会在属性存在于调用它的对象实例上时返回 true，in 操作符会在对象可以访问指定属性时返回 true，这与 hasOwnProperty() 稍有不同：

```javascript
function Person() {}
Person.prototype.name = 'Nicholas';
let person1 = new Person();
let person2 = new Person();
person1.name = 'Greg';
console.log(person1.name); // "Greg"，来自实例
console.log(person1.hasOwnProperty('name')); // true
console.log("name" in person1); // true
console.log(person2.name); // "Nicholas"，来自原型
console.log(person2.hasOwnProperty('name')); // false
console.log("name" in person2); // true
```

通过这两个方法，我们就可以判断某个属性是否存在于原型上：

```javascript
function hasPrototypeProperty(object, name) {
    return !object.hasOwnProperty(name) && (name in object);
}
function Person() {}
Person.prototype.name = 'Nicholas';
let person1 = new Person();
let person2 = new Person();
person1.name = 'Greg';
console.log(hasPrototypeProperty(person1, "name")); // false
console.log(hasPrototypeProperty(person2, "name")); // true
```

同样的，可以使用 Object.getOwnPropertyDescriptors() 方法查看实例对象或者原型对象的所有属性的属性描述符，要注意任何对象调用该方法**只会返回本身含有的属性**：

```javascript
function Person() {}
Person.prototype.name = 'Nicholas';
Person.prototype.age = 27;
let person1 = new Person();
let person2 = new Person();
person1.name = 'Greg';

console.log(Object.getOwnPropertyDescriptors(Person.prototype));
// {
//   constructor: {
//     value: [Function: Person],
//     writable: true,
//     enumerable: false,
//     configurable: true
//   },
//   name: {
//     value: 'Nicholas',
//     writable: true,
//     enumerable: true,
//     configurable: true
//   },
//   age: { value: 27, writable: true, enumerable: true, configurable: true }
// }
console.log(Object.getOwnPropertyDescriptors(person1));
// {
//   name: {
//     value: 'Greg',
//     writable: true,
//     enumerable: true,
//     configurable: true
//   }
// }
console.log(Object.getOwnPropertyDescriptors(person2)); // {}
```

#### 原型与迭代

for-in 循环中，只要是对象可访问且可以被枚举的属性都会被返回，包括实例属性和原型属性。遮蔽原型中不可枚（[[Enumerable]] 特性被设置为 false）属性的实例属性也会在 for-in 循环中返回，因为默认情况下开发者定义的属性都是可枚举的。

```javascript
function Person() {}
Object.defineProperties(Person.prototype, {
  name: {
    value: 'Nicholas',
    configurable: true,
    writable: true,
    // 此处设置不可枚举
    enumerable: false
  }
})
let person1 = new Person();
let person2 = new Person();
// person1遮蔽原型"name"属性
person1.name = 'Greg';
for(let item in person1) {
  // 正常打印
  console.log(item);
}
for(let item in person2) {
  // 由于不可枚举，不能打印
  console.log(item);
}
```

Object.keys() 方法接受一个对象作为参数，该方法将返回包含这个对象上所有**可枚举**的属性名称的数组：

```javascript
function Person() {}
Person.prototype.name = 'Nicholas';
Person.prototype.age = 29;
Person.prototype.job = 'Software Engineer';
Person.prototype.sayName = function () {
	console.log(this.name);
};
let keys = Object.keys(Person.prototype);
console.log(keys); // [ 'name', 'age', 'job', 'sayName' ]
let p1 = new Person();
p1.name = 'Wang';
let p1keys = Object.keys(p1);
console.log(p1keys); // [ 'name' ]
```

Object.getOwnPropertyNames() 方法同样接受一个对象作为参数，该方法将返回包含这个对象上所有属性名称的数组，无论是否可枚举：

```javascript
function Person() {}
Person.prototype.name = 'Nicholas';
Person.prototype.age = 29;
Person.prototype.job = 'Software Engineer';
Person.prototype.sayName = function () {
	console.log(this.name);
};
let AllKeys = Object.getOwnPropertyNames(Person.prototype);
console.log(AllKeys); // [ 'constructor', 'name', 'age', 'job', 'sayName' ]
```

Object.getOwnPropertySymbols() 与 Object.getOwnPropertyNames() 类似，但是它只针对于符号：

```javascript
let o = {
  [Symbol('k1')]: 'k1',
  [Symbol('k2')]: 'k2'
}
console.log(Object.getOwnPropertySymbols(o)); // [ Symbol(k1), Symbol(k2) ]
```

ES7 引入了 Object.values() 和 Object.entries() 方法，再加上之前的 Object.keys() 方法，实现了迭代 Object 的功能。这三个方法类似 Array 的 keys()、values() 和 entries() 方法。Object.keys()、Object.values() 和 Object.entries() 方法都接收一个对象，分别返回键数组、值数组以及键/值数组：

```javascript
// 三个方法都只会返回可枚举属性
function Person () {}
Object.defineProperties(Person.prototype, {
  name: {
    value: 'Nicholas',
    configurable: true,
    writable: true,
    enumerable: true
  },
  // 此属性默认不可枚举
  age: {
    value: 18
  },
  [Symbol('k1')]: {
    value: 'k1',
    configurable: true,
    writable: true,
    enumerable: true
  }
})
// 所有非字符串属性会被转换为字符串输出
// 所有的符号属性将会被忽略
console.log(Object.keys(Person.prototype)); // [ 'name' ]
console.log(Object.values(Person.prototype)); // [ 'Nicholas' ]
console.log(Object.entries(Person.prototype)); // [ [ 'name', 'Nicholas' ] ]
```

另外，Object.values() 和 Object.entries() 执行的是浅复制，即如果属性值为引用类型，被复制的只能是引用：

```javascript
const o = { 
 qux: {} 
}; 
console.log(Object.values(o)[0] === o.qux); 
// true 
console.log(Object.entries(o)[0][1] === o.qux); 
// true
```

#### 属性枚举顺序

for-in 循环、Object.keys()、Object.values()、Object.entries()、Object.getOwnPropertyNames()、Object.getOwnPropertySymbols() 以及 Object.assign()在属性枚举顺序方面有很大区别。for-in 循环和 Object.keys()、Object.values()、Object.entries() 的枚举顺序无法确定，取决于 JavaScript 引擎，可能因浏览器而异。

Object.getOwnPropertyNames()、Object.getOwnPropertySymbols() 和 Object.assign() 的枚举顺序是确定的。它们先以升序枚举数值键，然后以插入顺序枚举字符串和符号键，在对象字面量中定义的键（字符串或者符号键）以它们逗号分隔的顺序插入。

### 原型延伸

#### 字面量定义原型

在前面的例子中，每次都是通过 Person.prototype 的形式来定义属性或者方法。为了减少代码冗余，同时更好的封装原型功能，可以通过字面量形式来重写原型：

```javascript
function Person() {}
Person.prototype = {
	name: 'Nicholas',
	age: 29,
	job: 'Software Engineer',
	sayName() {
		console.log(this.name);
	},
};
```

但是重写了原型后，Person.prototype 的 constructor 属性将不再指向 Person，constructor将会指向新对象（Object 构造函数）。虽然 instanceof 操作符还能可靠地返回值，但我们不能再依靠 constructor 属性来识别类型了：

```javascript
function Person() {}
Person.prototype = {
	name: 'Wang'
};
let friend = new Person(); 
console.log(friend instanceof Object); // true 
console.log(friend instanceof Person); // true 
console.log(friend.constructor == Person); // false 
console.log(friend.constructor == Object); // true
```

如果 constructor 的值很重要，可以在字面量中设置它的值，只不过原生的 constructor 属性是不可枚举状态，而字面量中的值是可枚举状态：

```javascript
function Person() {}
Person.prototype = {
	constructor: Person,
	name: 'Wang'
};
console.log(Object.getOwnPropertyDescriptor(Person.prototype, 'constructor'));
// {
//   value: [Function: Person],
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
```

要想解决这件事，可以单独定义一个挂载在 Person.prototype 上的 constructor：

```javascript
// 虽然不失为一种解决办法，不过总感觉有些奇怪
function Person() {}
Person.prototype = {
	name: 'Wang'
};
// 默认把enumerable置为false
Object.defineProperty(Person.prototype, 'constructor', {
	value: Person
});
console.log(Object.getOwnPropertyDescriptor(Person.prototype, 'constructor'));
```

#### 原型的动态性

因为实例是通过指针来访问原型对象，所以在实例定义之后修改原型的属性或方法，实例仍然可以访问到：

```javascript
function Person() {}
// 实例定义在前
let friend = new Person();
// 原型修改在后
Person.prototype.sayHi = function () {
	console.log('hi');
};
friend.sayHi(); // hi
```

实例访问原型是通过 [[Prototype]] 指针，这个指针会一直指向原型对象，但是如果使用字母量形式重写原型，这样相当于创建了一个新的对象，这样会切断最初原型与构造函数的联系，而实例访问的仍然是最初的原型：

```javascript
function Person() {}
let friend1 = new Person();
console.log(friend1.constructor); // Person() {}
console.log(friend1.__proto__);
// {constructor: ƒ}
//   constructor: ƒ Person()
//   __proto__: Object
Person.prototype = {
	name: 'Wang'
};
let friend2 = new Person();
console.log(friend2.constructor); // Object() { [native code] }
console.log(friend2.__proto__);
// {name: "Wang"}
//   name: "Wang"
//   __proto__: Object
console.log(friend1.name); // undefined
```

#### 原生对象原型

原型模式之所以重要，不仅体现在自定义类型上，而且还因为它也是实现所有原生引用类型的模式。所有原生引用类型的构造函数（包括 Object、Array、String 等）都在原型上定义了实例方法。比如，数组实例的 sort()方法就是 Array.prototype 上定义的。

我们可以通过 `Array.prototype.sort = function(arg) {}` 这样的形式来重写这些方法，但很不推荐使用，因为这样会污染全局中的原型，所有调用这个方法的变量都会受到影响，推荐的做法是，自定义一个对象来继承原生类型，然后在这个对象上做修改。

#### 原型的问题

1. 原型弱化了向构造函数传入初值的能力，所有实例一开始都会取得原型上相同的属性值。
2. 原型最主要的问题来自共享性，如果共享的是方法那还好，符合预期要求；共享的是原始类型的属性也还行，可以通过定义同名属性做遮蔽处理；但是如果是引用类型，那就有点不妙了，因为所有实例共享的是这个引用，对引用数据的处理会影响到所有实例。

来看以下例子：

```javascript
function Person() {}
Person.prototype = {
	name: 'Wang',
	friends: ['Shelby', 'Court']
};
let person1 = new Person();
let person2 = new Person();
// person1修改friends数组
person1.friends.push('Van');
console.log(person1.friends); // "Shelby,Court,Van"
// person2的friends数组受到影响
console.log(person2.friends); // "Shelby,Court,Van"
console.log(person1.friends === person2.friends); // true
```

一般来说，不同的实例应该有属于自己的属性副本，实际开发中通常不会单独使用原型模式。
