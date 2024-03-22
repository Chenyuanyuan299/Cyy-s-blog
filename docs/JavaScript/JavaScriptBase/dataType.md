# 数据类型

ECMAScript中的数据类型可分为两种：

- 基本类型：Number,BigInt,String,Boolean,null,undefined,Symbol
- 引用类型：Object: [Array,Date,Function,RegExp,Math] 等

基本类型存储在栈内存中，被引用或拷贝时，会创建一个完全相等的变量；

引用类型存储在堆内存中，存储的是地址，多个引用指向同一个地址：

```javascript
// 基本类型
var a = 10;
var b = a;
b = 20;
a // a的值仍为10

// 引用类型
var a = { x: 10, y: 20 };
var b = a;
b.x = 20;
a.x // 值为20
```

猜猜下面代码会输出什么？

```javascript
let a = {
    name: 'Ju',
    age: 20
}
function change(o) { 
	o.age = 24,
    o = {
        name: 'Ka',
        age: 30
    }
    return o;
}
let b = change(a);
console.log(a);
console.log(b);
```

## 数据类型的检测

### typeof

```javascript
typeof 0 // "number"
typeof 10n // "bigint"
typeof "foo" // "string"
typeof true // "boolean"
typeof undefined // "undefined"
typeof Symbol("id") // "symbol"
typeof Math // "object"
typeof null // "object"
typeof alert // "function"
```

`typeof null` 的结果为 `“object”` ，这是 Javascript 历史问题。第一代 JavaScript 引擎中的 JavaScript 值表示为32位的字符。最低的3位作为标识，表示值是对象、整数、浮点数或者布尔值等等。对象的标识是 000。而为了表现 null 值，引擎使用了机器语言 NULL 指针，该字符的所有位都是 0。而 typeof 就是检测值的标志位，这就是为什么它会被认为是一个对象的原因。Ps: NaN 是 Number 类型，undefine 只和 null `==`。

### instanceof

利用 `instanceof` 运算符用来检测构造函数的 `prototype ` 是否存在于某个实例对象的原型链上。

```javascript
let Car = function() {}
let benz = new Car();
benz instanceof Car; // true

let str = 'Hello';
str instanceof String; // false，因为没有继承原型；

let str = new String('World');
str instanceof String; // true;
```

### Object.prototype.toString.call

typeof 虽然可以判断基础数据类型（null 除外），但是只能判断引用类型中的 function（其它全为 Object）。

instanceof 可以判断复杂引用数据类型，但是`[] instanceof Object // true 因为Array 的原型为 Object`，而且不能正确判断基础数据类型。

所以推荐使用第三种方法Object.prototype.toString.call

```javascript
Object.prototype.toString.call(1);			// "[object Number]"
Object.prototype.toString.call(1n);			// "[object BigInt]"
Object.prototype.toString.call('1');		// "[object String]"
Object.prototype.toString.call(true);		// "[object Boolean]"
Object.prototype.toString.call(null);		// "[object Null]"
Object.prototype.toString.call(undefined);	// "[object Undefined]"
Object.prototype.toString.call(Symbol("key")); // "[object Symbol]"
Object.prototype.toString.call({});			// "[object Object]"
Object.prototype.toString.call([]);			// "[object Array]"
Object.prototype.toString.call(new Date());	// "[object Date]"
Object.prototype.toString.call(function(){}); // "[object Function]"
Object.prototype.toString.call(document);	// "[object HTMLDocument]"
Object.prototype.toString.call(window);		// "[object Window]"
```

## 数据类型的转换

在 JavaScript 中，只有三种类型转换

- 转换为布尔值

- 转换为数字

- 转换为字符串

### 转换为布尔值 Boolean

在条件判断时，除了 `undefined`， `null`， `false`， `NaN`， `''`， `+0`， `-0`，其他所有值都转为 `true`，包括所有对象。

### 转换为数字或者字符串

一般非基础类型进行转换时会先调用 valueOf，如果 valueOf 无法返回基本类型值，就会调用 toString

对象在转换类型的时候，会调用内置的 `[[toPrimitive]]` 函数，对于该函数来说，算法逻辑一般如下：

- 先检测该对象中是否存在 `valueOf` 方法，如果有并返回了原始类型，那么就使用该值进行强制类型转换；
- 如果 `valueOf` 没有返回原始类型，那么就使用 `toString` 方法的返回值；
- 如果 `vauleOf` 和 `toString` 两个方法都不返回基本类型值，便会触发一个 `TypeError` 的错误。

也可以重写 `Symbol.toPrimitive` ，该方法在转原始类型时被调用优先级最高。

```javascript
let a = {
  valueOf() {
    return 0
  },
  toString() {
    return '1'
  },
  [Symbol.toPrimitive]() {
    return 2
  }
}
1 + a // 3
```

### 四则运算符

`+` 比较特殊，在运算过程中有以下特点：

- 运算中其中一方为字符串，那么就会把另一方也转换为字符串。

- 如果一方不是字符串或者数字，那么会将它转换为数字或者字符串。

```javascript
1 + 1 + '1' // '21'
true + true // 2
4 + [1,2,3] // "41,2,3"
```

除 `+` 以外的运算符，只要其中一方是数字，另一方就会被转换为数字

```javascript
4 * '3' // 12
4 * [] // 0
4 * [1, 2] // NaN
```

### 比较运算符

- 如果是对象，就通过 `toPrimitive` 转换对象。
  一般只会调用到 valueOf()，两个对象的比较只会返回 false，可以使用深拷贝来对比。

- 如果是字符串，就通过 `unicode` 字符索引来比较。

### == vs ===

== 比较过程：

1. 如果类型相同，无需进行类型转换；
2. 类型不同会进行类型转换；
3. 然后会判断是否是 `null` 或者 `undefined`，`null` 只会 == `undefined`；
4. 如果其中一方是 `symbol`，那么返回 false；
5. 如果两者都为 string 或者 `number` 类型，那么就会将字符串转换为 `number`；
6. 如果其中一方是 `boolean`，那么转换为 `number`；
7. 如果其中一方是 `object`，另一方为 `string`、`number`、或者 `symbol`，就会把 `object` 转换为原始类型再进行判断。

=== 不会进行转换，对比的是两者的类型和值是否相等