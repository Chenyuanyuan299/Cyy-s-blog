# Object-类

上几节讲了如何只使用 ES5 来模拟类的行为。不难看出，各种策略都有自己的问题，也有相应的妥协，实现继承的代码也显得很冗长和混乱。

为解决这些问题，ES6 新引入的 class 关键字具有正式定义类的能力。类是 ES6 中新的基础性语法糖结构，虽然表面上看起来可以支持正式的面向对象编程，实际上它的背后仍然是原型和构造函数的概念。

## 类的定义

主要有两种方式：类声明和类表达式：

```javascript
// 声明式
class Person {}
// 表达式声明
const Animal = class {}

// 类的声明不存在变量提升
console.log(ClassExpression); // ReferenceError: Cannot access 'ClassExpression' before initialization
class ClassExpression {}
console.log(ClassExpression); // class ClassExpression {}
```

还有一个跟函数声明不同的地方是，函数受函数作用域限制，类受块作用域限制。

类表达式的名称是可选的。在把类表达式赋值给变量后，可以通过 name 属性取得类表达式的名称字符串。但不能在类表达式作用域外部访问这个标识符。

```javascript
let Person = class PersonName {
	identify() {
		console.log(Person.name, PersonName.name);
	}
};
let p = new Person();
p.identify(); // PersonName PersonName
console.log(Person.name); // PersonName
console.log(PersonName); // ReferenceError: PersonName is not defined
```

## 类构造函数

### 1.实例化

constructor 关键字用于在类定义块内部创建类的构造函数。方法名 constructor 会告诉解释器在使用 new 操作符创建类的新实例时，应该调用这个函数。构造函数的定义不是必须的，类实例化时传入的参数将由构造函数接收。

默认情况下，类构造函数会在执行之后返回 this 对象。如果返回的不是 this 对象，而是其他对象，那么这个对象不会通过 instanceof 操作符检测出跟类有关联，因为这个对象的原型指针并没有被修改。

```javascript
class Person {
	constructor(override) {
		this.foo = 'foo';
		if (override) {
			return {
				bar: 'bar',
			};
		}
	}
}
let p1 = new Person(),
	p2 = new Person(true);
console.log(p1); // Person{ foo: 'foo' }
console.log(p1 instanceof Person); // true
console.log(p2); // { bar: 'bar' }
console.log(p2 instanceof Person); // false
```

类构造函数与普通构造函数的主要区别是，调用类构造函数**必须**使用 new 操作符。普通构造函数不使用 new 操作符调用将会以全局的 this 作为内部对象。

类构造函数在实力化之后会成为普通的实例方法，可以通过 new 调用这个实例上的方法创建一个新的实例：

```javascript
class Person {}
let p1 = new Person();
let p2 = new p1.constructor;
console.log(p2 instanceof Person); // true
```

### 2.类是特殊的函数

ECMAScript 中没有正式的类概念，类背后是原型，说到底是一种特殊的函数，具有类似普通构造函数的行为，可以理解成是一种封装。类同样有 prototype 属性，类的原型对象同样也有 constructor 属性指向自身。

```javascript
class Person {}
console.log(Person === Person.prototype.constructor); // true
```

需要注意的是，类本身在使用 new 调用时会被当成构造函数，而类中定义的 constructor 并不会被当成构造函数。这意味着：

```javascript
class Person {}
let p1 = new Person();
console.log(p1 instanceof Person); // true
console.log(p1 instanceof Person.constructor); // false
let p2 = new Person.constructor;
console.log(p2 instanceof Person); // true
console.log(p2 instanceof Person.constructor); // false
```

## 实例、原型和类成员

类的语法可以非常方便的定义应该存在于实例上的成员、原型上的成员以及类本身的成员。

### 实例属性

```javascript
class Person {
	// 每个实例都会获得自有属性，且不互相影响
	constructor (name, age) {
		this.name = name;
		this.age = age;
		this.colors = ['red', 'blue', 'yellow'];
	}
}
let p1 = new Person('Wang', 18);
let p2 = new Person('Chen', 19);
p1.colors.push("green");
console.log(p1);
// Person {
//   name: 'Wang',
//   age: 18,
//   colors: [ 'red', 'blue', 'yellow', 'green' ]
// }
console.log(p2);
// Person { 
//	name: 'Chen', 
//  age: 19, 
//  colors: [ 'red', 'blue', 'yellow' ] 
// }
```

### 原型方法与访问器

```javascript
class Person {
	constructor() {
		this.locate = () => console.log('this is instance', this);
	}
	// 在类块中定义的所有内容都会被定义在类的原型上
	locate() {
		console.log('this is prototype', this);
	}
    // 可以设置访问器
	set name(newName) {
		this._name = newName;
	}
	get name() {
		return this._name;
	}
}
let p = new Person();
p.name = 'Wang';
console.log(p.name)； // Wang
p.locate(); // this is instance Person {_name: "Wang", locate: ƒ}
p.__proto__.locate(); // this is prototype {constructor: ƒ, locate: ƒ}
```

### 静态类方法

```javascript
class Person {
	constructor() {
		this.locate = () => console.log('this is instance', this);
	}
	static locate() {
		console.log('this is class', this);
	}
}
let p = new Person();
p.locate(); // this is instance Person {locate: ƒ}
Person.locate(); // this is class class Person {...}
```

静态类方法比较特殊，它并不存在于实例上，而是直接挂在类上，他的 this 指向这个类本身。

### 类成员

可以看到，之前除了在 constructor 中定义过属性，并没有在类定义内部定义过非函数成员，实际上可以手动定义：

```javascript
class Person {
	sayName() {
		console.log(`${Person.greeting} ${this.name}`);
	}
}
// 在类上定义数据成员
Person.greeting = 'My name is';
// 在原型上定义数据成员
Person.prototype.name = 'Jake';
let p = new Person();
p.sayName(); // My name is Jake
```

之所以不定义，是因为在共享目标上添加可修改数据成员是一种反模式。一般来说对象实例应该独自拥有通过 this 引用的数据。

### 迭代器与生成器

类支持生成器方法，所以可以通过添加一个默认的迭代器，把类实例变成可迭代对象：

```javascript
class Person {
	constructor() {
		this.nicknames = ['Jack', 'Jake', 'J-Dog'];
	}
	*[Symbol.iterator]() {
		yield* this.nicknames.entries();
	}
}
let p = new Person();
for (let [idx, nickname] of p) {
	console.log(nickname);
}
// Jack
// Jake
// J-Dog
```

也可以只返回迭代器实例：

```javascript
class Person {
	constructor() {
		this.nicknames = ['Jack', 'Jake', 'J-Dog'];
	}
	[Symbol.iterator]() {
		return this.nicknames.entries();
	}
}
let p = new Person();
for (let [idx, nickname] of p) {
	console.log(idx, nickname);
}
// 0 Jack
// 1 Jake
// 2 J-Dog
```

> Ps：关于迭代器与生成器，这里不多赘述，稍后会出专题。

## 继承

ES6 新增特性中最出色的一个就是支持了类的继承机制，其背后基于原型链。

### 1.继承基础

在 ES6 中，可以使用 extends 关键字，来继承任何拥有 [[Construct]] 和原型的对象。这意味着既可以继承一个类，也可以继承普通的构造函数：

```javascript
class Vehicle {}
// 继承类
class Bus extends Vehicle {}
let b = new Bus();
console.log(b instanceof Bus); // true
console.log(b instanceof Vehicle); // true
function Person() {}
// 继承普通构造函数
class Engineer extends Person {}
let e = new Engineer();
console.log(e instanceof Engineer); // true
console.log(e instanceof Person); // true
```

### 2. 构造函数、HomeObject 和 super()

派生类都会通过原型链访问到类和原型上定义的方法，派生类的方法可以通过 super 关键字引用它们的原型。这个关键字只能在派生类中使用，而且仅限于类构造函数、实例方法和静态方法内部。在类构造函数中使用 super 可以调用父类构造函数。

```javascript
class Vehicle {
	constructor() {
		this.hasEngine = true;
	}
}
class Bus extends Vehicle {
	constructor() {
		// 不要在调用 super()之前引用 this，否则会抛出 ReferenceError
		super();
		console.log(this instanceof Vehicle); // true
		console.log(this); // Bus { hasEngine: true }
	}
}
new Bus();
```

在静态方法中可以通过 super 调用继承的类上定义的静态方法：

```javascript
class Vehicle {
	static identify() {
		console.log('vehicle');
	}
}
class Bus extends Vehicle {
	static identify() {
		super.identify();
	}
}
Bus.identify(); // vehicle
```

ES6 给类构造函数和静态方法添加了内部特性 [[HomeObject]]，这个特性是一个指针，指向定义该方法的对象。该指针自动赋值，只能在 JavaScript 引擎内部访问。super 始终会定义为 [[HomeObject]] 的原型。

使用 super 时要注意以下几点：

- super 只能在**派生类**构造函数和静态方法中使用，也就是以上两个例子。

  ```javascript
  class Vehicle {
  	constructor() {
  		super();
  		// SyntaxError: 'super' keyword unexpected here
  	}
  }
  ```

- 不能单独使用 super：

  ```javascript
  class Vehicle {
  	constructor() {
  		console.log(super());
  		// SyntaxError: 'super' keyword unexpected here
  	}
  }
  ```

- 调用 super() 会调用父类的构造函数，并将返回的实例赋值给 this，相当于对 this 进行重新定义：

  ```javascript
  class Vehicle {}
  class Bus extends Vehicle {
  	constructor() {
  		super();
  		console.log(this instanceof Vehicle);
  	}
  }
  new Bus(); // true
  ```

- super() 的行为如同构造函数，如果需要给父类构造函数传参，则通过 super() 传入：

  ```javascript
  class Vehicle {
  	constructor(licensePlate) {
  		this.licensePlate = licensePlate;
  	}
  }
  class Bus extends Vehicle {
  	constructor(licensePlate) {
  		super(licensePlate);
  	}
  }
  console.log(new Bus('FA2018')); // Bus { licensePlate: 'FA2018' }
  ```

- 如果没有定义类构造函数，在实例化派生类时会调用 super()，而且会传入所有传给派生类的参数：

  ```javascript
  class Vehicle {
  	constructor(licensePlate) {
  		this.licensePlate = licensePlate;
  	}
  }
  class Bus extends Vehicle {}
  console.log(new Bus('FA2018')); // Bus { licensePlate: 'FA2018' }
  ```

- 在类构造函数中，不能在调用 super() 之前引用 this：

  ```javascript
  class Vehicle {}
  class Bus extends Vehicle {
  	constructor() {
  		console.log(this);
  	}
  }
  new Bus();
  // ReferenceError: Must call super constructor in derived class 
  // before accessing 'this' or returning from derived constructor
  ```

- 如果在派生类中显示定义了构造函数，要么必须在其中调用 super()，要么必须在其中返回一个对象：

  ```javascript
  class Vehicle {}
  class Car extends Vehicle {}
  class Bus extends Vehicle {
  	constructor() {
  		super();
  	}
  }
  class Van extends Vehicle {
  	constructor() {
  		return {};
  	}
  }
  console.log(new Car()); // Car {}
  console.log(new Bus()); // Bus {}
  console.log(new Van()); // {}
  ```

### 3.抽象基类

有时候可能需要定义这样一个类，它可供其他类继承，但本身不会被实例化。虽然 ECMAScript 没有专门支持这种类的语法 ，但通过 new.target 也很容易实现。new.target 保存通过 new 关键字调用的类或函数。通过在实例化时检测 new.target 是不是抽象基类，可以阻止对抽象基类的实例化：

```javascript
// 抽象基类
class Vehicle {
	constructor() {
		console.log(new.target);
		if (new.target === Vehicle) {
			throw new Error('Vehicle cannot be directly instantiated');
		}
	}
}
// 派生类
class Bus extends Vehicle {}
new Bus(); // class Bus extends Vehicle {}
new Vehicle(); // class Vehicle {}
// Error: Vehicle cannot be directly instantiated
```

> 注意：这里是人为设置的错误，关于抽象类，在 TypeScript 中有了更成熟的写法。

通过在抽象基类的构造函数中进行检查，还可以要求派生类必须定义某个方法。因为原型方法在调用类构造函数之前就已经存在了，所以可以通过 this 关键字来检查相应的方法：

```javascript
// 抽象基类
class Vehicle {
	constructor() {
		if (new.target === Vehicle) {
			throw new Error('Vehicle cannot be directly instantiated');
		}
		if (!this.foo) {
			throw new Error('Inheriting class must define foo()');
		}
		console.log('success!');
	}
}
// 派生类
class Bus extends Vehicle {
	foo() {}
}
// 派生类
class Van extends Vehicle {}
new Bus(); // success!
new Van(); // Error: Inheriting class must define foo()
```

### 4.继承内置类型

ES6 类为继承内置引用类型提供了顺畅的机制，开发者可以方便地扩展内置类型：

```javascript
// 这个算法在某场笔试中考过
class SuperArray extends Array {
	shuffle() {
		// 洗牌算法
		for (let i = this.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this[i], this[j]] = [this[j], this[i]];
		}
	}
}
let a = new SuperArray(1, 2, 3, 4, 5);
console.log(a instanceof Array); // true
console.log(a instanceof SuperArray); // true
console.log(a); // SuperArray(5) [1, 2, 3, 4, 5]
a.shuffle();
console.log(a); // SuperArray(5) [1, 2, 3, 5, 4]
```

有些内置类型的方法会返回新的实例，默认情况下，该实例的类型会与内置类型一直：

```javascript
class SuperArray extends Array {}
let a1 = new SuperArray(1, 2, 3, 4, 5);
let a2 = a1.filter((x) => !!(x % 2));
console.log(a1); // [1, 2, 3, 4, 5]
console.log(a2); // [1, 3, 5]
console.log(a1 instanceof SuperArray); // true
console.log(a2 instanceof SuperArray); // true
```

实际上该实例应该是原生的内置类型，如果想覆盖这个默认行为，则可以覆盖 Symbol.species 访问器，这个访问器决定在创建返回的实例时使用的类：

```javascript
class SuperArray extends Array {
	static get [Symbol.species]() {
		return Array;
	}
}
let a1 = new SuperArray(1, 2, 3, 4, 5);
let a2 = a1.filter((x) => !!(x % 2));
console.log(a1 instanceof SuperArray); // true
console.log(a2 instanceof SuperArray); // false
console.log(a2 instanceof Array); // true
```

### 5.类混入

把不同类的行为集中到一个类是一种常见的 JavaScript 模式。虽然 ES6 没有显式支持多类继承，但通过现有特性可以轻松地模拟这种行为。

> 注意：Object.assign() 方法是为了混入对象行为而设计的。只有在需要混入类的行为时才有必要自己实现混入表达式。

在下面的代码片段中，extends 关键字后面是一个 JavaScript 表达式。任何可以解析为一个类或一个构造函数的表达式都是有效的。这个表达式会在求值类定义时被求值：

```javascript
class Vehicle {}
function getParentClass() {
	console.log('evaluated expression');
	return Vehicle;
}
// 可求值的表达式
class Bus extends getParentClass() {}
// evaluated expression
```

混入模式可以通过在一个表达式中连缀多个混入元素来实现，这个表达式最终会解析为一个可以被继承的类。如果 Person 类需要组合 A、B、C，则需要某种机制实现 B 继承 A，C 继承 B，而 Person 再继承 C，从而把 A、B、C 组合到这个超类中。实现这种模式有不同的策略。

一个策略是定义一组“可嵌套”的函数，每个函数分别接收一个超类作为参数，而将混入类定义为这个参数的子类，并返回这个类。这些组合函数可以连缀调用，最终组合成超类表达式：

```javascript
class Vehicle {}
let FooMixin = (Superclass) =>
	class extends Superclass {
		foo() {
			console.log('foo');
		}
	};
let BarMixin = (Superclass) =>
	class extends Superclass {
		bar() {
			console.log('bar');
		}
	};
let BazMixin = (Superclass) =>
	class extends Superclass {
		baz() {
			console.log('baz');
		}
	};
class Bus extends FooMixin(BarMixin(BazMixin(Vehicle))) {}
let b = new Bus();
b.foo(); // foo
b.bar(); // bar
b.baz(); // baz
```

通过写一个辅助函数，可以把嵌套调用展开：

```javascript
class Vehicle {}
let FooMixin = (Superclass) =>
	class extends Superclass {
		foo() {
			console.log('foo');
		}
	};
let BarMixin = (Superclass) =>
	class extends Superclass {
		bar() {
			console.log('bar');
		}
	};
let BazMixin = (Superclass) =>
	class extends Superclass {
		baz() {
			console.log('baz');
		}
	};
function mix(BaseClass, ...Mixins) {
	return Mixins.reduce((accumulator, current) => current(accumulator), BaseClass);
}
class Bus extends mix(Vehicle, FooMixin, BarMixin, BazMixin) {}
let b = new Bus();
b.foo(); // foo
b.bar(); // bar
b.baz(); // baz
```

> 注意：很多 JavaScript 框架（特别是 React）已经抛弃混入模式，转向了组合模式（把方法提取到独立的类和辅助对象中，然后把它们组合起来，但不使用继承）。这反映了那个众所周知的软件设计原则：“组合胜过继承（composition over inheritance）。”这个设计原则被很多人遵循，在代码设计中能提供极大的灵活性。所以本处不做过多介绍。

## 总结

花了大量的篇幅，总算是把 Object 这一系列写完。这一系列大多数场景都是来自红宝书，其中做了一些精减以及对难以理解的话语进行了拓展并给出对应的例子，丢弃了一些不太常用的例子。
