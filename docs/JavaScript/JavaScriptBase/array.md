# Array 及其 API

Array 是最常用的类型之一，它是一种引用类型。

## 创建数组

有多种方式可以创建，第一种是使用构造函数：

```javascript
const colors = new Array();
```

Array() 可以接收一个参数作为数组长度。

```javascript
const colors = new Array(10); // 每一项都为undefined
```

其中：

- **new Array(arg1, arg2, …)**，参数长度为 0 或长度大于等于 2 时，传入的参数将按照顺序依次成为新数组的第 0 至第 N 项（参数长度为 0 时，返回空数组）；
- **new Array(arg)**，当 arg 不是数值时，处理同上，返回一个只包含 arg 元素一项的数组；当 arg 为数值时，arg 最大不能超过 32 位无符号整型，即需要小于 2 的 32 次方（arg 最大为 Math.pow(2,32)），否则将抛出 RangeError。

第二种是以**数组字面量**的形式：

```javascript
const a1 = [1, 2, 3, 4]; // 包含四个元素的数组
const a2 = []; // 空数组
a2.length = 3 // a2长度变为3
const a3 = [,,,,,] // 使用一串逗号来创建空位，该数组长度为5
```

> 注意：在使用数组字面量形式创建数组的时候，不会调用 Array 构造函数，但是当打印或者调用的时候，会对它进行隐式转换，使它的构造函数为 Array。

### Array.from()

ES6新增，该方法将会把类数组结构转换为数组实例，只要该类数组结构拥有迭代器。Array.from() 将返回新的数组，而不是引用，即不会改变原数组。

```javascript
const a = Array.from([,,,]); // 创建包含三个空位的数组
```

Array.from() 可接收三个参数：

1. 类数组结构，可以是Object，Map，Set，String，迭代对象，数组，arguments 对象等，必选。
2. 映射函数参数，可对以上类数组结构中的数据进行加工，可选。
3. 用于指定2中映射函数 this 的值，箭头函数不可用！

```javascript
const a1 = [1, 2, 3, 4];
const a2 = Array.from(a1, x => x**2);
const a3 = Array.from(a1, function(x) {
    return x**this.exponent // 必须返回值
}, {exponent: 2});
console.log(a2); // [ 1, 4, 9, 16 ]
console.log(a3); // [ 1, 4, 9, 16 ]
```

### Array.of()

ES6新增，该方法可以把一组参数转换为数组：

```javascript
console.log(Array.of(1, 2, 3, 4)); // [1, 2, 3, 4]
const a = Array.of(...[,,,]); // 创建包含三个空位的数组
```

### Array 的判断

当出现多个全局上下文的时候（大型网页包含多个框架），可能会有两个不同版本的 Array 构造函数，在这两个上下文中传递数组会有一些风险。引入 Array.isArray() 判断一个值是否为数组：

```javascript
if (Array.isArray()) {
    // 操作数组
}
```

## 转换方法

所有引用类型都有 valueOf()、toString() 和 toLocaleString() 方法。对于数组来说，valueOf() 返回数组本身。数组的 toString() 方法返回数组中每个值调用 toString() 方法后拼接成的以逗号分隔的总字符串。

```javascript
const a1 = [1, 2, 3, 4];
console.log(a1); // [ 1, 2, 3, 4 ]
console.log(a1.toString()); // 1,2,3,4
console.log(a1.valueOf()); // [ 1, 2, 3, 4 ]
```

toLocaleString() 可能与 toString() 返回相同的结果，也可能不是，可以重写这个方法。

除此之外，还有一个 join() 方法也可以用于转换数组。默认情况下，它返回与 toString() 相同的结果，都是用逗号分割；如果给它一个参数，它将把该参数作为分隔符拼接数组里的每一项。

```javascript
const array = ['We', 'are', 'Chinese'];
console.log(array.join()); // "We,are,Chinese"
console.log(array.join(',')); // "We,are,Chinese"
console.log(array.join('+')); // "We+are+Chinese"
console.log(array.join(1)); // "We1are1Chinese"
```

## 改变数组自身的方法

ECMAScript 给数组提供了一些可以操作本身的方法。分别是：pop()、push()、shift()、unshift()、reverse()、sort()、splice()，以及 ES6 新增的 copyWithin() 和 fill()。改变自身说明不创建新的数组，引用不变，操作同一块堆内存，就算类似 `const item = array.pop()` 这样的操作，array 也会发生改变。以下是一些简单使用：

```javascript
// pop()方法，剪切数组最后一项并返回，类似出栈
const array = ["cat", "dog", "cow", "chicken", "mouse"];
console.log(array.pop()); // mouse
console.log(array); // ["cat", "dog", "cow", "chicken"]

// push()方法，相对pop()，入栈操作，返回数组最新长度
const array = ["football", "basketball",  "badminton"];
console.log(array.push("golfball")); // 4
console.log(array); // ["football", "basketball", "badminton", "golfball"]

// shift()方法，剪切数组第一项并返回，类似队列弹出
const array = [1,2,3,4,5];
console.log(array.shift()); // 1
console.log(array); // [2,3,4,5]

// unshift()方法，shift()相反操作，在数组开头加入任意项，返回数组最新长度
const array = ["red", "green", "blue"];
console.log(array.unshift("yellow")); // 4
console.log(array); // ["yellow", "red", "green", "blue"]

// reverse()方法，反转整个数组
const array = [1,2,3,4,5];
const array2 = array.reverse();
console.log(array); // [5,4,3,2,1]
console.log(array2 === array); // true

// sort()方法，对数组进行排序
const array = ["apple","Boy","Cat","dog"];
const array2 = array.sort();
console.log(array); // ["Boy", "Cat", "apple", "dog"]
console.log(array2 === array); // true

// copyWithin()方法
let array = [];
reset = () => array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
reset();
// 一个参数，等同于ints.copyWithin(5, 0);
array.copyWithin(5);
console.log(array); // [ 0, 1, 2, 3, 4, 0, 1, 2, 3, 4 ]
reset(); // 每次运行过后都重置数组，侧面说明改变自身
// 两个参数，复制索引从5开始的内容，插入到索引0开始的位置
array.copyWithin(0, 5);
console.log(array); // [ 5, 6, 7, 8, 9, 5, 6, 7, 8, 9 ]
reset();
// 三个参数，复制索引[0, 3)的内容，插入到索引4开始的位置
array.copyWithin(4, 0, 3);
console.log(array); // [ 0, 1, 2, 3, 0, 1, 2, 7, 8, 9 ]

// fill()方法
const zeroes = [0, 0, 0, 0, 0];
// 一个参数，填充所有项
zeroes.fill(5);
console.log(zeroes); // [ 5, 5, 5, 5, 5 ]
zeroes.fill(0);
// 两个参数，填充索引大于等于3的项
zeroes.fill(6, 3);
console.log(zeroes); // [ 0, 0, 0, 6, 6 ]
zeroes.fill(0);
// 三个参数，填充索引[1, 3)的项
zeroes.fill(7, 1, 3);
console.log(zeroes); // [ 0, 7, 7, 0, 0 ]

// splice()方法，操作数组功能最强大的方法
let colors = ["red", "green", "blue"];
// 删除
let removed = colors.splice(0, 1); // 删除第一项，并返回该值，0为索引开始，1为删除个数
console.log(colors, removed); // [ 'green', 'blue' ] [ 'red' ]
// 增加
removed = colors.splice(1, 0, "yellow", "orange"); // 在索引1的位置插入新的两项
console.log(colors, removed); // [ 'green', 'yellow', 'orange', 'blue' ] []
// 替换
removed = colors.splice(1, 1, "red", "purple"); // 插入新的两项，并删除一项，实现替换
console.log(colors, removed); // [ 'green', 'red', 'purple', 'orange', 'blue' ] [ 'yellow' ]
```

其中，copyWithin() 和 fill() 方法，传入的第二项和第三项参数即索引，过高过低和反向都会被忽略，部分可用将对具体部分操作；

sort() 方法会将每一项转换为字符串，然后通过比较每一位字符来决定顺序，就算是纯数字的数组也会被分别转换为字符串再比较，这将会导致一些滑稽的后果：

```javascript
let values = [0, 1, 5, 10, 15];
console.log(values.sort()); // [ 0, 1, 10, 15, 5 ]
```

可以给 sort 方法传入一个处理函数：

```javascript
let values = [0, 1, 5, 10, 15];
values.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
console.log(values); // [ 0, 1, 5, 10, 15 ]
```

或者更简单点，因为 sort() 是通过值是否大于或者小于或者等于 0 来进行排序，所以直接返回 a - b：

```javascript
let values = [0, 1, 5, 10, 15];
values.sort((a, b) => a - b);
console.log(values); // [ 0, 1, 5, 10, 15 ]
values.sort((a, b) => b - a);
console.log(values); // [ 15, 10, 5, 1, 0 ]
```

## 不改变自身的方法

使用这些方法，将会创建一个新的数组，而不影响到原来的数组。

### 数组拼接

```javascript
// concat()方法
const colors = ["red", "green", "blue"];
const colors2 = colors.concat("yellow", ["black", "brown"]);
console.log(colors); // [ 'red', 'green', 'blue' ]
console.log(colors2); // [ 'red', 'green', 'blue', 'yellow', 'black', 'brown' ]

// slice()方法，创建一个包含原有数组一个或多个元素的新数组
const colors = ["red", "green", "blue", "black", "brown"];
const colors2 = colors.slice(1); // 从索引1开始
const colors3 = colors.slice(1, 4); // [1, 4)
console.log(colors); // [ 'red', 'green', 'blue', 'black', 'brown' ]
console.log(colors2); // [ 'green', 'blue', 'black', 'brown' ]
console.log(colors3); // [ 'green', 'blue', 'black' ]
```

### 数组搜索

ECMAScript 提供两类搜索数组的方法：按严格相等搜索和按断言函数搜索。

严格相等搜索的方法有：indexOf()、lastIndexOf() 和 includes()，其中 includes() 为ES7新增。这些方法都接收两个参数：要查找的元素和一个可选的起始搜索位置，第二个参数可选。indexOf() 和 lastIndexOf() 返回元素在数组中的位置，如果没找到则返回-1，includes() 返回一个布尔值。比较过程都会使用（ === ）运算符。indexOf() 和 includes() 从前往后找，lastIndexOf() 从后往前找。

```javascript
const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];

console.log(numbers.indexOf(4)); // 3
console.log(numbers.lastIndexOf(4)); // 5
console.log(numbers.includes(4)); // true

console.log(numbers.indexOf(4, 4)); // 5
console.log(numbers.lastIndexOf(4, 4)); // 3
console.log(numbers.includes(4, 7)); // false

console.log(numbers.indexOf(6)); // -1
console.log(numbers.lastIndexOf(6)); // -1
```

ECMAScript 允许按照断言函数搜索数组，每个索引都会调用这个函数。断言函数接收3个参数：元素、索引和数组本身。find() 和 findIndex() 方法接收断言函数，find() 返回第一个匹配的元素，findIndex() 返回第一个匹配元素的索引。这两个方法还能接收第二个可选的参数，用于指定断言函数内部 this 的值。

```javascript
const numbers = [1, 3, 5, 7, 9];

console.log(numbers.find((element, index, array) => element > 5)); // 7
console.log(numbers.findIndex((element, index, array) => element > 5)); // 3

// 只有非箭头函数才有this！
console.log(numbers.find(function compare(element, index, array) {
    return element > this.num
}, { num : 7 })); // 9
console.log(numbers.findIndex(function compare(element, index, array) {
    return element > this.num
}, { num : 7 })); // 4
```

### 数组遍历

- **迭代器方法**

在 ES6 中，Array 的原型上暴露了3个用于检索数组内容的方法：keys()、values() 和 entries()。keys()返回数组索引的迭代器，values()返回数组元素的迭代器，而 entries()返回索引/值对的迭代器：

```javascript
const a = ["foo", "bar", "baz", "qux"]; 
// 因为这些方法都返回迭代器，所以可以将它们的内容，通过Array.from()直接转换为数组实例。
const aKeys = Array.from(a.keys());
const aValues = Array.from(a.values());
const aEntries = Array.from(a.entries());
console.log(aKeys); // [0, 1, 2, 3] 
console.log(aValues); // ["foo", "bar", "baz", "qux"] 
console.log(aEntries); // [[0, "foo"], [1, "bar"], [2, "baz"], [3, "qux"]]
```

使用 ES6 的解构可以非常容易地在循环中拆分键/值对：

```javascript
const a = ["foo", "bar"]; 
for (const [idx, element] of a.entries()) { 
    console.log(idx); 
    console.log(element); 
} 
// 0
// foo
// 1
// bar
```

- **迭代方法**

ECMAScript 为数组定义了 5 个迭代方法。每个方法接收两个参数：以每一项为参数运行的函数，以及可选的作为函数运行上下文的作用域对象（影响函数中 this 的值）。传给每个方法的函数接收 3 个参数：数组元素、元素索引和数组本身。因具体方法而异，这个函数的执行结果可能会也可能不会影响方法的返回值。数组的 5 个迭代方法如下：

- every()：对数组每一项都运行传入的函数，如果对每一项函数都返回 true，则这个方法返回 true。
- filter()：对数组每一项都运行传入的函数，函数返回 true 的项会组成数组之后返回。
- forEach()：对数组每一项都运行传入的函数，没有返回值。
- map()：对数组每一项都运行传入的函数，返回由每次函数调用的结果构成的数组。
- some()：对数组每一项都运行传入的函数，如果有一项函数返回 true，则这个方法返回 true。

其中 every() 与 some() 是功能形态类似（作用不同）的函数：

```javascript
const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]; 
const everyResult = numbers.every((item, index, array) => item > 2); 
console.log(everyResult); // false，并不是每一项都符合
const someResult = numbers.some((item, index, array) => item > 2); 
console.log(someResult); // true，只要有一项符合
```

filter() 具有筛选功能，它能挑出符合要求的项，并把这些项组成一个新的数组返回：

```javascript
const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]; 
const someResult = numbers.filter((item, index, array) => item > 2); 
console.log(someResult); // [ 3, 4, 5, 4, 3 ]
```

map() 方法类似批量操作，对数组每一项进行操作并存入一个新的数组返回：

```javascript
const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]; 
const someResult = numbers.map((item, index, array) => item * 2); 
console.log(someResult); // [ 2, 4, 6, 8, 10, 8, 6, 4, 2 ]
```

forEach() 方法相当于使用 for 循环遍历数组，然后对每一项执行一些操作，没有返回值：

```javascript
const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]; 
numbers.forEach((item, index, array) => { 
    // 执行某些操作 
});
```

- **归并方法**

除此之外，基于迭代，ECMAScript 为数组提供了两个归并方法：reduce() 和 reduceRight()。这两个方法都会迭代数组的所有项，并在此基础上构建一个最终返回值。reduce() 方法从数组第一项开始遍历到最后一项。而 reduceRight() 从最后一项开始遍历至第一项。

这两个方法都接收两个参数：对每一项都会运行的归并函数，以及可选的以之为归并起点的初始值。传给 reduce() 和 reduceRight() 的函数接收 4 个参数：上一个归并值、当前项、当前项的索引和数组本身。这个函数返回的任何值都会作为下一次调用同一个函数的第一个参数。如果没有给这两个方法传入可选的第二个参数（作为归并起点值），则第一次迭代将从数组的第二项开始，因此传给归并函数的第一个参数是数组的第一项，第二个参数是数组的第二项。

```javascript
// reduce()方法
const array = [1, 2, 3, 4];
const sum = array.reduce(function(previousValue, value, index, array) {
    console.log(previousValue, value, index, array) 
    // 0 1 0 [ 1, 2, 3, 4 ]
    // 1 2 1 [ 1, 2, 3, 4 ]
    // 3 3 2 [ 1, 2, 3, 4 ]
    // 6 4 3 [ 1, 2, 3, 4 ]
    return previousValue + value;
}, 0); // 0是reduce()的第二个参数，若不定义则默认为数组第1项，归并结果不变
console.log(sum); // 10
// 箭头函数的写法
console.log(array.reduce((p, v) => p * v)); // 24

// reduceRight()方法,和reduce()的区别就是从后往前累计
const array = [1, 2, 3, 4];
array.reduceRight((p, v) => p * v); // 24
```

## 数组扁平化

数组扁平化即，将一个多维数组转换为只有一层的数组。

### 普通递归

如果当前项是数组，则进行递归，使用 concat() 方法连接会操作一次扁平化；如果是非数组数据则直接push()：

```javascript
const a = [1, [2, [3, [4, 5]]]];
function flatten(arr) {
    let result = [];
    for(let i=0; i<a.length; i++) {
        if(Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]));
        } else {
            result.push(arr[i]);
        }
    }
    return result;
}
console.log(flatten(a)); // [ 1, 2, 3, 4, 5 ]
```

### 利用 reduce()

处理思想与普通递归类似，不过利用了 reduce() 的迭代处理：

```javascript
const a = [1, [2, [3, [4, 5]]]];
function flatten(arr) {  
    return arr.reduce((p, v)=> {
        return p.concat(Array.isArray(v) ? flatten(v) : v);
    }, []);
}
console.log(flatten(a)); // [ 1, 2, 3, 4, 5 ]
```

### 扩展运算符实现

（ ... ）操作可以对数组做一层扁平化处理，利用这个思想：

```javascript
const a = [1, [2, [3, [4, 5]]]];
function flatten(arr) {
    // 只要数组中有嵌套数组，就执行循环
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
console.log(flatten(a));  // [1, 2, 3, 4, 5]
```

### toString()（或者 join()）和 split()

```javascript
// toString()方法
const a = [1, [2, [3, [4, 5]]]];
function flatten(arr) {
    return arr.toString().split(',').map(item => {
        return Number(item);
    })
}
console.log(flatten(a));  // [1, 2, 3, 4, 5]

// join()方法
const a = [1, [2, [3, [4, 5]]]];
function flatten(arr) {
    return arr.toString().split(',').map(item => {
        return Number(item);
    })
}
console.log(flatten(a));  // [1, 2, 3, 4, 5]
```

### ES6 的 flat()

`var newArray = arr.flat([depth])`

接收的参数为解嵌套的深度，默认1层，会跳过空项，传个 Infinity 直接解透：

```javascript
const a = [1, , [2, [3, [4, 5]]]]; // 注意这里传了空值
function flatten(arr) {
    return arr.flat(Infinity);
}
console.log(flatten(a));  // [1, 2, 3, 4, 5]
```
