# TypeScript 高级语法

## 装饰器

装饰器是一种特殊类型的声明，装饰器本身是一个函数，它能够被附加到类声明，方法，访问符，属性或者参数上。装饰器使用 @expression 这种形式，expression 求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。

> 装饰器目前还在实验阶段，在未来的版本中可能发生改变。

若要使用装饰器特性，必须修改 `tsconfig.json` 的配置：

```json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

​	一个简单的装饰器：

```typescript
function sealed(target) {
    // do something with "target" ...
}
```

### 装饰器组合

可以写多个装饰器，多个装饰器的执行方式有点像栈，先入栈的后执行：

```typescript
function testDecorator(constructor: any) {
  console.log('Wang'); // 后执行
}
function testDecorator1(constructor: any) {
  console.log('JiaoTeng'); // 先执行
}
// 装饰器先收集，然后被先收集的后执行
// 使用多行方式
@testDecorator 
@testDecorator1 
class Test {}

// 使用单行方式
// @testDecorator @testDecorator1 class Test {}
const test = new Test();
```

### 装饰器工厂

如果我们要定制一个修饰器如何应用到一个声明上，我们得写一个装饰器工厂函数。

```typescript
function testDecorator(flag: boolean) { // 这是一个装饰器工厂
  if(flag) {
    return function (constructor: any) { // 这是一个装饰器
      constructor.prototype.getName = () => {
        console.log('Wang');
      }
    }
  } else {
    return function (constructor: any) {}
  }
}

@testDecorator(true) // 向装饰器工厂传参
class Test {}

const test = new Test();
(test as any).getName();
```

## 类的装饰器

### 一个简单的类装饰器

类的装饰器接受一个参数，该参数是类的构造函数，装饰器通过 @ 符号来使用：

```typescript
function testDecorator(constructor: new (...args: any[]) => any) {}

@testDecorator
class Test {}
const test = new Test();
```

装饰器里面的语句会在类被定义的时候执行，而不是等到类的实例被创建才执行。在装饰器中，可以对类做一些修饰：

```typescript
function testDecorator(constructor: new (...args: any[]) => any) {
  // 在类的构造函数上创建方法 getName()
  constructor.prototype.getName = () => {
    console.log('Wang');
  }
}
@testDecorator
class Test {}

const test = new Test();
// test 访问不到 getName，暂时用类型断言的方式调用方法
(test as any).getName();
```

### 正确的类装饰器定义

应该要使用泛型对装饰器进行定义：`<T extends new (...args: any[]) => any>`，new 表示这是一个构造函数，里面传入几个参数是 any 类型，构成一个 any 型数组，返回一个 any 类型的内容：

```typescript
function testDecorator<T extends new (...args: any[]) => {}>(constructor: T) {
  // 对 constructor 做拓展的正确写法
  return class extends constructor {
    name = 'Wang JiaoTeng';
    getName() {
      return this.name;
    }
  };
}

@testDecorator
class Test {
  constructor(public name: string) {
    console.log(name); // 先打印
  }
}

const test = new Test('Wang');
console.log((test as any).getName()); // 后打印
```

该类生成了一个实例后，类中原有的 constructor 会先被执行，然后才执行类装饰器中的东西，所以这样写会有一个问题，test 仍然访问不到 getName 方法，这时候可以使用装饰器工厂：

```typescript
// 使用装饰器工厂对装饰器进行一层包裹
function testDecorator() {
  return function<T extends new (...args: any[]) => {}>(constructor: T) {
    return class extends constructor {
      name = 'Wang JiaoTeng';
      getName() {
        return this.name;
      }
    };
  }
}
// 相当于先对类进行装饰，类的构造函数仍然先执行
const Test = testDecorator()(class {
  constructor(public name: string) {
    console.log(name);
  }
})

const test = new Test('Wang');
console.log(test.getName());
```

> 注意	仔细观察写法！

## 方法的装饰器

方法的装饰器在定义类之后，直接对方法进行修饰，方法的装饰器获取三个参数，有点类似于 Object.defineProperty：

- target：普通方法中，对应类的 prototype；静态方法中，对应类的构造函数；
- key：被装饰器装饰的方法的名字；
- descriptor：属性描述符。

> 注意	此处的参数名可以随便起，主要是方便理解，下同。

```typescript
function getNameDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
  // console.log(target, key);
  // descriptor.writable = false;
  descriptor.value = function() { // 修改原方法的值
    return 'Wang JiaoTeng';
  }
} 

class Test {
  constructor(public name: string) {}
  @getNameDecorator
  getName() {
    return this.name;
  }
}

const test = new Test('Wang');
console.log(test.getName());
```

## 访问器的装饰器

访问器的装饰器表达式会在运行时当作函数被调用，同样传入三个参数：

- target：普通方法中，对应类的 prototype；静态方法中，对应类的构造函数；
- key：被装饰器装饰的访问器的名字；
- descriptor：属性描述符。

```typescript
function visitDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false;
} 

class Test {
  constructor(private _name: string) {}
  get name() {
    return this._name;
  }
  @visitDecorator
  set name(name: string) {
    this._name = name;
  }
}

const test = new Test('Wang');
test.name = 'Wang JiaoTeng'
console.log(test.name); // 报错
```

> 注意  TypeScript不允许同时装饰一个成员的 `get` 和 `set` 访问器。取而代之的是，一个成员的所有装饰的必须应用在文档顺序的第一个访问器上。这是因为，在装饰器应用于一个属性描述符时，它联合了 `get` 和 `set` 访问器，而不是分开声明的。

## 属性的装饰器

属性的装饰器接受两个参数：target: any、key: string:

- target：普通方法中，对应类的 prototype；静态方法中，对应类的构造函数；
- key：被装饰器装饰的属性的名字；

> 注意	属性描述符不会做为参数传入属性装饰器，这与 TypeScript 是如何初始化属性装饰器的有关。 因为目前没有办法在定义一个原型对象的成员时描述一个实例属性，并且没办法监视或修改一个属性的初始化方法。返回值也会被忽略。因此，属性描述符只能用来监视类中是否声明了某个名字的属性。

可以通过这种方式来使用属性描述符：

```typescript
function nameDecorator(target: any, key: string): any {
  // console.log(target, key);
  const descriptor: PropertyDescriptor = {
    writable: false
  }
  return descriptor;
} 

class Test {
  @nameDecorator
  name = "Wang"
}

const test = new Test();
test.name = 'JiaoTeng';
console.log(test.name);
```

当我们使用这种方式对 name 进行修改，装饰器修改的不是实例上的 name，而是 Test.prototype 上的name：

```typescript
function nameDecorator(target: any, key: string) {
  target[key] = 'JiaoTeng';
} 

class Test {
  @nameDecorator
  name = "Wang"
}

const test = new Test();
console.log(test.name); // Wang
console.log((test as any).__proto__.name); // JiaoTeng
```

## 参数装饰器

参数装饰器接收三个参数：

- target：普通方法中，对应类的 prototype；静态方法中，对应类的构造函数；
- method：参数所在方法的名字；
- paramIndex：参数在函数列表中的索引。

> 注意	参数装饰器只能用来监视一个方法的参数是否被传入。

```typescript
function paramDecorator(target: any, method: string, paramIndex: number) {
  console.log (target, method, paramIndex);
} 

class Test {
  getInfo(@paramDecorator name: string, age: number) {
    console.log(name, age);
  }
}
const test = new Test();
test.getInfo('Wang', 18);
```

## 元数据

元数据的主要用途：未知

安装：`npm i reflect-metadata --save`。

定义了一个元数据挂在类上，需要使用对应的 api 获取该值（元数据是定义在类的原型对象上的）：

```typescript
import 'reflect-metadata';

@Reflect.metadata('data', 'test')
class User {
  name = 'Wang';
}
console.log(Reflect.getMetadata('data', User));
```

定义在属性上：

```typescript
import 'reflect-metadata';

class User {
  @Reflect.metadata('data', 'test')
  name = 'Wang';
}
console.log(Reflect.getMetadata('data', User.prototype, 'name'));
```

定义在方法上：

```typescript
import 'reflect-metadata';

class User {
  @Reflect.metadata('data', 'test')
  getName() {};
}
console.log(Reflect.getMetadata('data', User.prototype, 'getName'));
```

### API

```typescript
// define metadata on an object or property
Reflect.defineMetadata(metadataKey, metadataValue, target);
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);

// check for presence of a metadata key on the prototype chain of an object or property
let result = Reflect.hasMetadata(metadataKey, target);
let result = Reflect.hasMetadata(metadataKey, target, propertyKey);

// check for presence of an own metadata key of an object or property
let result = Reflect.hasOwnMetadata(metadataKey, target);
let result = Reflect.hasOwnMetadata(metadataKey, target, propertyKey);

// get metadata value of a metadata key on the prototype chain of an object or property
let result = Reflect.getMetadata(metadataKey, target);
let result = Reflect.getMetadata(metadataKey, target, propertyKey);

// get metadata value of an own metadata key of an object or property
let result = Reflect.getOwnMetadata(metadataKey, target);
let result = Reflect.getOwnMetadata(metadataKey, target, propertyKey);

// get all metadata keys on the prototype chain of an object or property
let result = Reflect.getMetadataKeys(target);
let result = Reflect.getMetadataKeys(target, propertyKey);

// get all own metadata keys of an object or property
let result = Reflect.getOwnMetadataKeys(target);
let result = Reflect.getOwnMetadataKeys(target, propertyKey);

// delete metadata from an object or property
let result = Reflect.deleteMetadata(metadataKey, target);
let result = Reflect.deleteMetadata(metadataKey, target, propertyKey);

// apply metadata via a decorator to a constructor
@Reflect.metadata(metadataKey, metadataValue)
class C {
  // apply metadata via a decorator to a method (property)
  @Reflect.metadata(metadataKey, metadataValue)
  method() {
  }
}
```

## 装饰器实际使用的场景

结合装饰器工厂，对类中方法的共同代码进行封装：

```typescript
const userInfo: any = undefined;

function catchError(msg: string) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value;
    descriptor.value = function() {
      try {
        fn();
      } catch(e) {
        console.log(msg);
      }
    };
  }
}

class Test {
  @catchError('userInfo.name 不存在')
  getName() {
    return userInfo.name;
  }  
  @catchError('userInfo.age 不存在')
  getAge() {
    return userInfo.age;
  }
}

const test = new Test();
test.getName();
```

## 装饰器的执行顺序

类的装饰器是最后执行的：

```typescript
import 'reflect-metadata';

function showData(target: typeof User) {
  for(let key in target.prototype) {
    const data = Reflect.getMetadata('data', target.prototype, key)
    console.log(data); // 可以读取到数据说明方法的装饰器已经执行了
  }
}

@showData
class User {
  @Reflect.metadata('data', 'name')
  getName() {};

  @Reflect.metadata('data', 'age')
  getAge() {};
}
```

手写一个 @Reflect.metadata：

```typescript
import 'reflect-metadata';

function showData(target: typeof User) {
  for(let key in target.prototype) {
    const data = Reflect.getMetadata('data', target.prototype, key)
    console.log(data);
  }
}

function setData(dataKey: string, msg: string) {
  return function (target: User, key: string) {
    Reflect.defineMetadata(dataKey, msg, target, key);
  };
}

@showData
class User {
  @Reflect.metadata('data', 'name')
  getName() {};

  @setData('data','age') // 与上面的 @Reflect.metadata('data', 'name') 功能一致
  getAge() {};
}
```

