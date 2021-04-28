# Javascript 继承

继承是面向对象的，使用继承我们可以更好地复用之前的开发代码，缩短开发的周期，提升开发效率。

## 原型链继承

在 Javascript 中，除了原始类型以外，其余都是对象，不管是对象还是函数、数组，都是 Object 的实例。

 ```javascript
function Foo() {...};
let f1 = new Foo();
 ```

<img :src="$withBase('/JavaScript/Inherit01.png')" alt="prototype"/>

### `prototype`

所有的函数都有一个特别的属性 prototype（只有函数才有），它由一个函数指向一个对象。该属性的值是一个对象（prototype对象），这个对象便是原型对象，该原型对象有两个属性，分别是 `constructor` 和 `__proto__`。可以**通过以下方式进行继承 `f1.__proto__ === Foo.prototype`**。

```javascript
function Person() {}
Person.prototype.name = 'Kevin';
var person1 = new Person();
var person2 = new Person();
console.log(person1.name) // Kevin
console.log(person2.name) // Kevin
// ES5的一个方法，可以获取对象的原型。
console.log(Object.getPrototypeOf(person1) === Person.prototype) // true
```

### `__proto__`

`__proto__` 是对象（函数也是对象，所以函数也有该属性）独有的，它由一个对象指向另一个对象，该属性的作用是，当访问一个对象的属性时，如果该对象内部不存在这个属性，那么就会顺着它的原型链往上找，如果一直找到 null 还找不到则会报错。原型链便是这些对象层层向上一直到 null 连接起来的链路。

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
console.log(Person.prototype.constructor == Person) // true
```

原型继承有一个缺点，实例对象会共享构造函数中引用类型的数据，即当实例一修改该数据，实例二也会发生更改。

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

