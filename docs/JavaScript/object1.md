# Object-理解对象

在 JavaScript 中，Object 类型无处不在。早期开发定义对象，通常是创建一个 Object 的新实例：`let person = new Object()`，现在更流行的方式是使用对象字面量：`let person = { name: "Chen" }`。

> 值得注意的是，Object 的所有属性（键）只能以数字、字符串、符号命名！

ECMA-262 使用一些内部特性来描述属性的特征，属性通常分为两种：数据属性和访问器属性。

## 数据属性

数据属性包含一个保存数据值的位置。值会从这个位置读取，也会写入到这个位置。数据属性有 4 个特性描述它们的行为。

- [[Configurable]]：表示属性是否可以通过 delete 删除并重新定义，是否可以修改它的特性，以及是否可以把它改为访问器属性。

- [[Enumerable]]：表示属性是否可以通过 for-in 循环返回。

- [[Writable]]：表示属性的值是否可以被修改。

- [[Value]]：包含属性实际的值。这就是前面提到的那个读取和写入属性值的位置。这个特性的默认值为 undefined。

使用字面量形式将属性显式添加到对象之后，默认 [[Configurable]]、[[Enumerable]] 和
[[Writable]] 都会被设置为 **true**，而 [[Value]] 特性会被设置为指定的值，比如 name 对应的 "Chen"。

要修改属性的默认特性，必须使用 Object.defineProperty() 方法。这个方法接收 3 个参数：要添加属性的目标对象、属性的名称（键）和一个描述符对象。描述符对象上的属性可以包含：configurable、enumerable、writable 和 value。可以使用 Object.getOwnPropertyDescriptors() 方法查看对象上所有属性的属性描述符：

  ```javascript
  let person = {}; 
  Object.defineProperty(person, "name", { 
    value: "Nicholas" 
  }); 
  console.log(Object.getOwnPropertyDescriptors(person))
  // {
  //   name: {
  //     value: 'Nicholas',
  //     writable: false,
  //     enumerable: false,
  //     configurable: false
  //   }
  // }
  ```

与字面量形式不同，Object.defineProperty() 方法将会把 [[Configurable]]、[[Enumerable]] 和 [[Writable]] 都默认设置为 **false**，当然一开始定义的时候可以修改它们的值。

同时，虽然可以对同一个属性多次调用 Object.defineProperty()，但在把 [[configurable]] 设置为 false 之后将不再可更改。

## 访问器属性

访问器属性不包含数据值。相反，它们包含一个获取（getter）函数和一个设置（setter）函数，不过这两个函数不是必需的。访问器属性有 4 个特性描述它们的行为。

- [[Configurable]]：表示属性是否可以通过 delete 删除并重新定义，是否可以修改它的特性，以及是否可以把它改为数据属性。 
- [[Enumerable]]：表示属性是否可以通过 for-in 循环返回。 
- [[Get]]：获取函数，在读取属性时调用。默认值为 undefined。 
- [[Set]]：设置函数，在写入属性时调用。默认值为 undefined。

访问器属性是不能直接定义的，必须使用 Object.defineProperty()。使用 Object.defineProperty() 方法定义时，[[Configurable]] 和 [[Enumerable]] 默认为 **false**。

ECMAScript 提供了 Object.defineProperties() 方法，相对于 Object.defineProperty() 只能定义一个属性，这个方法可以通过多个描述符一次性定义多个属性。它接收两个参数：需要添加或修改属性的目标对象以及一个描述符对象，其属性与要添加或修改的属性一一对应。同时，可以使用 Object.getOwnPropertyDescriptors() 方法查看对象上所有属性的属性描述符：

```javascript
let book = {}
Object.defineProperties(book, {
  year_: {
    value: 2017,
  },
  edition: {
    value: 1
  },
  year: {
    get: function() {
      return this.year_
    }, 
    set: function(newValue) {
      if(newValue > 2017) {
        this.year_ = newValue;
        this.edition += newValue - 2017
      }
    }
  }
});

console.log(Object.getOwnPropertyDescriptors(book))
// {
//   year_: {
//     value: 2017,
//     writable: false,
//     enumerable: false,
//     configurable: false
//   },
//   edition: { value: 1, writable: false, enumerable: false, configurable: false },
//   year: {
//     get: [Function: get],
//     set: [Function: set],
//     enumerable: false,
//     configurable: false
//   }
// }
```

## 读取属性的特性

上文中使用的 Object.getOwnPropertyDescriptors() 方法可以取得对象上所有属性的属性描述符。如果

- Object.getOwnPropertyDescriptors()：接收一个参数，即目标对象。
- Object.getOwnPropertyDescriptor()：接收两个参数，目标对象以及要查询的属性。

这两个方法，返回值都是一个对象，只不过前者返回的对象中包含多个属性，后者返回的对象只包含指定的属性。同时，对于其中的属性，如果是访问器属性包含 configurable、enumerable、get 和 set 属性，是数据属性则包含 configurable、enumerable、writable 和 value 属性。

> 注意：对象的特性并不仅仅有访问器属性和数据属性这几条，还有一些类似 [[property]] 等的特性。

## 合并对象

该操作就是把源对象所有的本地属性一起复制到目标对象上，有时该操作也称为“混入”（mixin），因为目标对象通过混入源对象的属性得到了增强。

ES6 为合并对象提供了Object.assign() 方法，这个方法接收一个目标对象和一个或多个源对象作为参数，然后将其中可枚举和自有属性复制到目标对象上。对每个符合条件的属性，这个方法会使用源对象上的 [[Get]] 取得属性的值，然后使用目标对象上的 [[Set]] 设置属性的值。

```javascript
let dest, src;
dest = {
	set a(val) {
		console.log(`Invoked dest setter with param ${val}`); // Invoked dest setter with param foo
	},
};
src = {
	get a() {
		console.log('Invoked src getter'); // Invoked src getter
		return 'foo';
	},
};
Object.assign(dest, src);
// 调用 src 的获取方法
// 调用 dest 的设置方法并传入参数"foo"
// 因为这里的设置函数不执行赋值操作
// 所以实际上并没有把值转移过来
console.log(dest); // { a: [Setter] } 
```

执行 `Object.assign(dest, src);` 后，程序使用 src 上的 get 取得值 'foo'，dest 上的 set 获得该值并输出。由于没有在 dest 中进行赋值操作，所以值并没有被转移。修改一下代码，当在 dest 中进行赋值之后：

```javascript
let dest, src;
dest = {
  value: 'default',
	set a(val) {
    this.value = val;
		console.log(`Invoked dest setter with param ${this.value}`);
	},
};
src = {
	get a() {
		console.log('Invoked src getter');
		return 'foo';
	},
};
Object.assign(dest, src);
console.log(dest); // { value: 'foo', a: [Setter] }，值被成功传递
```

Object.assign() 实际上对每个源对象执行的是浅复制，也就是复制引用，所以如果多个源对象都有相同的属性，则最后一个值会覆盖前面的值。

```javascript
let dest = { id: 'dest' }; 
let result = Object.assign(dest, { id: 'src1', a: 'foo' }, { id: 'src2', b: 'bar' }); 
// Object.assign 会覆盖重复的属性
console.log(result); // { id: 'src2', a: 'foo', b: 'bar' }
```

在下面这个例子中，因为执行的是浅复制，所以 a 的属性值的引用会被复制到目标对象上，当它发生修改时，引用仍然不变，所有指向该引用的地方都会发生修改：

```javascript
let dest = {}; 
let src = { a: {} }; 
Object.assign(dest, src); 
src.a.b = 2
// 浅复制意味着只会复制对象的引用
console.log(dest); // { a: { b: 2 } }
console.log(dest.a === src.a); // true
```

## 对象解构

ES6 新增了对象解构语法，可以在一条语句中使用嵌套数据实现一个或多个赋值操作。

```javascript
// 不使用解构
let person = {
    name: 'Wang',
    age: 18
}
let personName = person.name,
    personAge = person.age;
console.log(personName); // Wang
console.log(personAge); // 18

// 使用解构
let person = {
  name: 'Wang',
  age: 18
}
let { name, age } = person;
console.log(name); // Wang
console.log(age); // 18
```

解构赋值不一定要与对象的属性匹配，可以在解构的时候定义默认值，如果未定义则被引用的属性返回 undefined：

```javascript
let person = {
  name: 'Wang',
  age: 18
}
let { name, job = 'Engineer', firstName } = person
console.log(name, job, firstName) // Wang Engineer undefined
```

如果是给事先声明的变量赋值，因为 JS 引擎将一对开放的花括号视为一个代码块，而语法不允许代码块语句出现在赋值语句左侧，所以赋值表达式必须包含在一对括号中，：

```javascript
let name, age;
let person = {
  name: 'Wang',
  age: 18
}; // 这里的分号不能丢
({ name, age } = person);
console.log(name, age); // Wang 18
```

解构在内部使用函数 ToObject()（不能在运行时环境中直接访问）把源数据结构转换为对象。此外，null 和 undefined 不能被解构。

```javascript
// 此处的字符串会隐式转换为对象，相当于new String('foobar')，于是就含有length属性
let { length } = 'foobar'; 
console.log(length); // 6
// 此处的数字会隐式转换为对象，相当于new Number(4)，每个实例都会有constructor属性
let { constructor: c } = 4; 
console.log(c === Number); // true 
```

> 注意：除了可以进行一层的解构还可以进行多层的嵌套解构，赋值过程是浅复制，还要注意在外层属性没有定义的情况下不能使用嵌套解构，此处不详细展开。

## 函数解构

在函数参数列表中也可以进行解构赋值。对参数的解构赋值不会影响 arguments 对象，但可以在函数签名中声明在函数体内使用局部变量：

```javascript
let person = {
	name: 'Wang',
	age: 18,
};
function printPerson(foo, { name, age }, bar) {
	console.log(arguments);
	console.log(name, age);
}
function printPerson2(foo, { name: personName, age: personAge }, bar) {
	console.log(arguments);
	console.log(personName, personAge);
}
printPerson('1st', person, '2nd');
// [Arguments] { '0': '1st', '1': { name: 'Wang', age: 18 }, '2': '2nd' }
// Wang 18
printPerson2('1st', person, '2nd');
// [Arguments] { '0': '1st', '1': { name: 'Wang', age: 18 }, '2': '2nd' }
// Wang 18
```

> Ps：数组等其他一些东西也可以使用解构操作，此处不展开
