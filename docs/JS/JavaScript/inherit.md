# Javascript 继承

# 历史

1994年，网景公司（Netscape）发布了Navigator浏览器0.9版。这是历史上第一个比较成熟的网络浏览器，轰动一时。但是，这个版本的浏览器只能用来浏览，不具备与访问者互动的能力。比如，如果网页上有一栏"用户名"要求填写，浏览器就无法判断访问者是否真的填写了，只有让服务器端判断。如果没有填写，服务器端就返回错误，要求用户重新填写，这太浪费时间和服务器资源了。

因此，网景公司急需一种网页脚本语言，使得浏览器可以与网页互动。工程师 Brendan Eich 负责开发这种新语言。他觉得，没必要设计得很复杂，这种语言只要能够完成一些简单操作就够了，比如判断用户有没有填写表单。

Brendan Eich 受到 C++ 和 Java 流行的影响，于是 JavaScript 里面所有的数据类型都是对象（object），这一点与 Java 非常相似。但是，他随即就遇到了一个难题，到底要不要设计"继承"机制呢？如果真的是一种简易的脚本语言，其实不需要有"继承"机制。但是，JavaScript 里面都是对象，必须有一种机制，将所有对象联系起来。所以，Brendan Eich 最后还是设计了"继承"。

因此，他就把new命令引入了 JavaScript，用来从原型对象生成一个实例对象。但是，JavaScript 没有"类"，怎么来表示原型对象呢？

这时，他想到 C++ 和 Java 使用 new 命令时，都会调用"类"的构造函数（constructor）。他就做了一个简化的设计，在 JavaScript 语言中，new 命令后面跟的不是类，而是构造函数。

用构造函数生成实例对象，有一个缺点，那就是无法共享属性和方法。考虑到这一点，Brendan Eich 决定为构造函数设置一个 prototype 属性。这个属性包含一个对象（以下简称"prototype 对象"），**所有实例对象需要共享的属性和方法，都放在这个对象里面；那些不需要共享的属性和方法，就放在构造函数里面。**实例对象一旦创建，将自动引用 prototype 对象的属性和方法。也就是说，实例对象的属性和方法，分成两种，一种是本地的，另一种是引用的。

继承是面向对象的，使用继承我们可以更好地复用之前的开发代码，缩短开发的周期，提升开发效率。下面是几种继承的实现。

## 原型链继承

在 JavaScript 中，除了原始类型以外，其余都是对象，不管是对象还是函数、数组，都是 Object 的实例。要了解原型链继承，首先得知道几个属性。

### `prototype`

所有的函数都有一个特别的属性 prototype（只有函数才有）。该属性的值是一个对象（prototype对象），这个对象便是原型对象，该原型对象有两个属性，分别是 `constructor` 和 `__proto__`。可以**通过以下方式进行继承 `f1.__proto__ === Foo.prototype`**。

```javascript
function Person() {}
Person.prototype.name = 'Kevin';
var person1 = new Person();
var person2 = new Person();
// 实例会共享原型对象的属性
console.log(person1.name) // Kevin
console.log(person2.name) // Kevin
// ES5的一个方法，可以获取对象的原型。
console.log(Object.getPrototypeOf(person1) === Person.prototype) // true
console.log(person2.hasOwnProperty('name')) // false，这个属性是继承的，自身并没有
```

### `__proto__`

`__proto__` 是对象（函数也是对象，所以函数也有该属性）独有的，该属性的作用是，当访问一个对象的属性时，如果该对象内部不存在这个属性，那么就会顺着它的原型链往上找，如果一直找到 null 还找不到则会报错。原型链便是这些对象层层向上一直到 null 连接起来的链路。

```javascript
function Person() {}
var person = new Person();
console.log(person.__proto__ === Person.prototype); // true
```

### `constructor`

`constructor` 属性也是对象独有的，它从一个对象指向一个函数，该函数是该对象的构造函数，Function 的构造函数是它自己。

```javascript
function Person() {}
var person = new Person();
console.log(Person.constructor) // Function
console.log(Person.prototype.constructor) // Person
```

```javascript
// 当我们执行以下代码，发生了什么
function Foo() {...};
let f1 = new Foo();
```

可以用一张图来解释上面的过程：

<img :src="$withBase('/JavaScript/Inherit01.png')" alt="prototype"/>

原型继承有一个缺点，实例对象会共享原型对象中的属性和方法，其中一个实例修改原型对象中的某个属性，会影响到其他实例。而构造函数中的属性和方法是每个实例私有的，并不互相影响。

```javascript
function Person() {
    this.name = 'Wang';
    this.play = [1, 2, 3]
}
Person.prototype.age = 18;
// Person.prototype.playx = [4, 5, 6];
var person1 = new Person();
var person2 = new Person();
console.log(person1.name, person1.play, person1.age) // Wang [ 1, 2, 3 ] 18
console.log(person2.name, person2.play, person2.age) // Wang [ 1, 2, 3 ] 18
person1.name = 'Chen'; // 相当于person1创建了新属性
// person1.__proto__.name = 'Chen'; // 共享
person1.play.push(4); // 此时的play是私有的，因为来自构造函数
// person1.playx.push(7); // 此时的playx才是共享的，因为来自原型对象
person1.__proto__.age = 20;
console.log(person1.name, person1.play, person1.age) // Chen [ 1, 2, 3, 4 ] 20
console.log(person2.name, person2.play, person2.age) // Wang [ 1, 2, 3 ] 20
// person1.age === person1.__proto__.age === Person.prototype.age
```

## 构造函数继承

为了解决引用类型数据被共享的问题，借助 call 实现该方法

```javascript
function Parent() {
    this.name = 'parent';
}
Parent.prototype.getName = function() {
    return this.name;
}
function Child() { 
	Parent.call(this);
    this.age = 20;
}
let child = new Child();
console.log(child);
console.log(child.getName());
```

