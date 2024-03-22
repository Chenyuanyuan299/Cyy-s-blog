# 初探 TypeScript

TypeScript 是 JavaScript 的超集，引入了类型机制，对面向对象和静态类型有更好的支持。TypeScript 不会被直接执行，而是先编译成 JavaScript再运行。

静态类型的意思是当给一个变量赋值一种类型的数据后，不能再给它赋值另一种类型。

```typescript
// 动态类型
let a = 123;
a = '123'// 可以
//静态类型
let a:number = 123;
a = '123'// 报错
```

## 相对于 JavaScript 的好处

1. 有更好的错误提示，可以发现潜在问题

2. 更友好的语法提示

3. 类型定义可以使代码语义更清晰，可读性更强

## 安装 TypeScript 及相关

在命令行中使用该命令安装：`npm install typescript -g`

这时候就可以将 TS 的代码编译成 JS `tsc xxx.ts`，然后再用 `node xxx.js` 运行。

也可以安装 `ts-node`：`npm install ts-node -g`，这时候就可以直接用 `ts-node xxx.ts` 运行 .ts 文件了。

## 进一步理解静态类型

1. 对一个变量设置类型之后，该变量可以使用这个类型的所有方法。

   ```typescript
   const n:number = 123;
   n.toString(); // 等方法
   ```

2. 对变量设置一个自定义类型时，该变量可以使用这个自定义类型的所有属性和方法。

   ```typescript
   interface Point { 
   	x: number;
       y: number;
   }
   const point: Point = {
       x:3,
       y:4;
   };
   point.x // 等等
   ```

## 基础类型和引用类型

```typescript
// 基础类型
const n:number = 123;	// number类型
const n:string = '123';	// string类型
// 类似还有null、undefined、symbol、boolean、void（空）、bigint（ES2020之后支持）

// 引用类型
const teacher: { 
	name: string;
	age: number;
} = { 
	name: 'Wang',
    age: 18;
} // object类型
const numbers: number[] = [1,2,3] // array类型（number型数组）
class Person {}
const Wang: Person = new Person(); // Person型对象
const getTotal: () => number = () => {
    return 123;
} // function类型，返回值是number类型
cosnt date: Date = new Date(); // Date类型
```

## 类型注解和类型推断

```typescript
// type annotation 类型注解
let count1: number; // 显示声明类型为类型注解
count1 = 123;

// type inference 类型推断
let count2 = 123; // TS会自动尝试推断出count2的类型

// 例子
const a = 1;
const b = 2;
const c = a + b; // 此时无需对c进行类型注解,因为TS会自动推断
function getTotal(a, b) { 
	return a + b; // 此时的a和b的类型为any 
}
const c = getTotal(1, 2) // TS推断不出c的类型，需要类型注解

// 注意！
let count;
count = 123; // 此时count类型为any，所以分行写必须写上类型注解

// other case
interface Person { 
	name: string
}
const rawDate = '{"name": "Wang"}';
const newDate: Person = JSON.parse(rawDate); // 此时需要给newDate加上类型注解，否则newDate为any类型
```

写 TS 就是要让每个变量或者属性的类型是固定的。

## 函数类型相关

```typescript
function add(a: number, b: number): number { 
	return a + b; // 尽量对返回值设置类型注解，方便查错
}
const sum = add(1, 2); // sum的类型跟add返回值相关

function sayHello(): void { // 返回值为空 
	console.log('Hello!');
}

function errorEmitter(): never {} // 这个函数永远不会执行完毕

// 函数参数解构赋值
function add ({ first, second }: { first: number, second: number }): number { // 解构语法类型注解必须写在花括号里，不管有几个参数
	return first + second;
}
const sum = add({first: 1, second: 2});
console.log(sum);
```

函数的两种写法

```typescript
const func1 = (str: string) => {
	return parseInt(str, 10);
}
const func2: (str: string) => number = (str) => {
	return parseInt(str, 10);
}
```

## 数组和元组

数组类型注解的写法：

```typescript
const numbers: (number | string)[] = [1,2,3] // 数值或字符串类型类型array

const objectArr: {name: string, age: number}[] = [{
    name: 'Wang',
    age: 18
}, {
    name: 'Chen',
    age: 18
}] // 对象类型数组，且每一项必须只包含name属性
```

类型别名 type alias，相当于对对象的属性做了一层封装：

```typescript
// type alias 类型别名 改写上例
type User = {name: string, age: number};
const objectArr: User[] = ...
```

如果声明了一个类，并把该类型赋值给一个数组，那么只要数组中每一项的属性符合该类的定义，TS不会要求该数组中每一项都是这个类创造出来的实例。

```typescript
class Teacher { 
	name: string;
 	age: number
}
const objArray: Teacher[] = [{
    name: 'Wang',
    age: 18
}] // Teacher类声明的对象类型数组，数组里的对象并不是Teacher的实例
```

元组 tuple，用于对数组中每一项进行进一步类型规范，一般用于处理csv之类的文件。

```typescript
// 这是一个元组
const teacherInfo: [string, string, number] = ['Wang', 'Laoshi', 18];
```

## interface 接口

接口其实是开发过程中 TS 做语法提示的工具，真正编译成 JS 代码之后不会再有接口和类型。

接口有点类似于上文讲到的类型别名 type，接口一般用于定义对象、函数或者类，不能用于定义基础类型，而类型别名可以定义基础类型，比如 `type Person = string`，类型别名一般用于定义基础类型，联合类型，元组等，一个重要区别是类型别名不能被 extends 和 implements（自己也不行）。

```typescript
// 接口相关知识
interface Person { 
	// readonly name: string; // 只读，setPersonName失效
	name: string;
	age?: number; // 加上问号表示定义对象时可有可无
	[propName: string]: any; // 允许对象创建随机属性
    // say(): string; // 接口中也可以设置方法
}
interface Teacher extends Person { // 接口可以继承
	teach(): string; // Teacher可以定义新的方法
}
class User implements Person { // 类可以应用接口，类中属性必须满足接口定义
	name = 'Wang'
}
const getPersonName = (person: Person): void => {
	console.log(person.name);
}
// setPersonName传入一个Teacher类型变量，需要同时满足Person和Teacher接口的定义，因为Teacher继承于Person
const setPersonName = (person: Teacher, name: string): void => {
	person.name = name;
	// console.log(person.name);
} 
const person = { 
	name: 'Wang',
    age: 18, // 可省略
	sale: 'female'
};

getPersonName(person) // 弱校验，符合接口的要求，接口中如果不定义sale，sale属性同样被允许
getPersonName({
	name: 'Wang',
	sale: 'female' // 符合接口规范第三条
}) // 字面量直接赋值，属于强校验，必须完全符合接口的定义

setPersonName({
	name: 'Wang', // 原来的姓名
	teach() { 
		return 'teach'
	}
}, 'Laoshi') // 要修改的姓名
```

接口也可以定义函数（类型别名也可以）

```typescript
interface SayHi { 
	(word: string): string
}
const say: SayHi = (word: string) => {
	return word;
}
console.log(say('hello'))
```

## 类

### 类的定义与继承

```typescript
class Person { 
	name = 'Wang';
	getName() {
		return this.name;	
	}
}
class Teacher extends Person { 
	getTeacherName() {
		return 'Laoshi';
	}
	getName() { 
        // return 'Laoshi'; // 子类可以重写从父类继承的方法
		return super.getName() + 'Laoshi' // 子类在重写之后可以使用super调用父类的方法
	}
}
const teacher = new Teacher();
console.log(teacher.getName());
console.log(teacher.getTeacherName());
```

可以对类的属性设置 readonly，此时该属性只能读不能改

```typescript
class Person { 
	public readonly name: string;
	constructor(name: string) {
		this.name = name;
	}
}
const person = new Person('Wang');
console.log(person.name);
person.name = '123'; // 会报错
```

### 访问类型 private, protected, public

1. public 允许在类的内外被调用
2. private 允许在类内被调用
3. protected 允许在类内及继承于该类的子类中调用

```typescript
class Person { 
	protected name: string;
	sayHi() { // 默认为public
        this.name; // name可以被访问
        this.sayBye();
		console.log('Hi');
	}
    private sayBye() {
        console.log('Bye');
    }
}
class Teacher extends Person { 
	sayHi() {
		console.log('Hi, ' + this.name);
        this.sayBye(); // 访问不到
	}
}
const person = new Person();
person.name = 'Wang'; // name访问不到
person.sayHi();
console.log(person.name);
const teacher = new Teacher();
teacher.sayHi() // Hi, undefined，因为name访问不到
```

### constructor

可以用于给类的属性进行初始化

```typescript
class Person { 
	// 传统写法
	// public name: string;
	// constructor(name: string) { 
	// 	this.name = name;
	// }
    
	// 简化写法
	constructor(public name: string) {} // new 之后自动执行，比传统写法简洁 
}
const person = new Person('Wang');
console.log(person.name);
// 类的继承
class Teacher extends Person {
	constructor(public age: number) {
		super('Wang'); // 子类在定义自己的构造器时需要先调用父类的构造器并传参
	}
}
const teacher = new Teacher(18);
console.log(teacher.name); // Wang
console.log(teacher.age); // 18
```

### getter 和 setter

如果类不想把属性直接对外暴露而是先经过加工或者加密后再暴露，这时候就需要用到 getter 和 setter。

```typescript
class Person { 
	constructor(private _name: string) {}
	get name() {// 一般会进行加密封装等操作
		return this._name + ' Laoshi';
	}
	set name(name: string) {
        const realName = name.split('')[0];
		this._name = name;
	}
}
const person = new Person('Wang');
// console.log(person._name); // 不被允许
console.log(person.name); // 间接获取类中私有，name是一个方法
person.name = 'Chen' // 间接修改类中私有属性
```

### 单例模式（Singleton）

需要先了解静态属性：static 静态属性直接挂在类上，而不是类的实例上，所以可以直接跳过实例访问。

```typescript
class Demo {
	private static instance: Demo; // 用于存储getInstance中new的Demo
	private constructor(public name: string) {} // 外部无法 new
	static getInstance() { // 该方法直接挂在类上面而不是实例上面
		if(!this.instance) { 
			this.instance = new Demo('Wang')
		}
		return this.instance;
	}
}
const demo1 = Demo.getInstance();
const demo2 = Demo.getInstance();
console.log(demo1 === demo2);// true
```

### 抽象类

抽象类只能被继承，主要用于抽离类中公共抽象的东西，抽象类不可以被实例化。抽象类有点类似接口，抽离出公共部分的东西。

```typescript
abstract class Geom {
    width: number;
    getType() {
        return 'Gemo';
    }
	abstract getArea(): number; 
}
class Circle extends Geom { 
	getArea() { // 继承抽象类后必须对抽象方法进行重写
		return 123;
	}
}
class Square extends Geom {
    getArea() {
        return 456;
    }
}
```





