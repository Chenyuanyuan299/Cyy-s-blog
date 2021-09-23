# React 组件与生命周期

传统的 Web UI 通过 HTML 模板，结合 JS 将数据填充到模板上。React 引进了组件化的思想，它将一个页面分为好几个组件。通过组件，可以很直观的描绘出 UI，同时也方便对页面进行设计。

## 理解 React 组件

React 组件一般不提供方法，有点类似状态机。

React 组件由 props 和 state 构成 View，其中 props 是外部传进来的数据，state 是自己本身的状态。组件就像纯函数一样，输入什么样的状态，输出是一定的。

最重要的一点是，React 使用的是单向数据绑定，外部只能通过 props 传递数据进来，内部则通过事件将状态暴露出去。

## 函数组件与 class 组件

定义组件最简单的方式就是编写 JavaScript 函数：

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

该函数是一个有效的 React 组件，因为它接收唯一带有数据的 “props”（代表属性）对象与并返回一个 React 元素。这类组件被称为“函数组件”。

还可以使用 ES6 的 class 来定义组件：

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

## 渲染组件

React 元素可以是 DOM 标签，也可以是用户自定义的组件。当 React 元素为用户自定义的组件时，它会将 JSX 所接收的属性（attributes）以及子组件（children）转换为单个对象传递给组件，这个对象被称之为 “props”。

```javascript
function Welcome(props) {  
    return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

在该例子中：

1. 我们调用 `ReactDOM.render()` 函数，并传入 `<Welcome name="Sara" />` 作为参数。
2. React 调用 `Welcome` 组件，并将 `{name: 'Sara'}` 作为 props 传入。
3. `Welcome` 组件将 `<h1>Hello, Sara</h1>` 元素作为返回值。
4. React DOM 将 DOM 高效地更新为 `<h1>Hello, Sara</h1>`。

> 注意： 组件名称必须以大写字母开头。

## 组合与拆分组件

组件可以在其输出中引用其他组件，这使得我们可以用同一组件来抽象出任意层次的细节。在 React 应用程序中：按钮，表单，对话框，甚至整个屏幕的内容，通常都会以组件的形式表示。

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />      
      <Welcome name="Cahal" /> 
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

相反的，拆分组件可能是一件繁重的工作，但是，在大型应用中，构建可复用组件库是完全值得的。根据经验来看，如果 UI 中有一部分被多次使用（`Button`，`Panel`，`Avatar`），或者组件本身就足够复杂（`App`，`FeedStory`，`Comment`），那么对它进行拆分是一个很好的选择。

## Props 的只读性

组件无论是使用函数声明还是通过 class 声明，都决不能修改自身的 props。来看下这个 sum 函数：

```javascript
// 纯函数
function sum(a, b) {
  return a + b;
}
// 非纯函数
function sum(a, b) {
  a = a + b;
  return a + b;
}
```

纯函数即不改变入参的函数，传进来什么参数就给什么样的结果，**所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。**

## State

上一篇中我们使用一个定时器，通过不断调用 ReactDOM.render() 来修改想要渲染的元素。此处引入 State 来实现这个功能。State 与 props 类似，但是 state 是私有的，并且完全受控于当前组件。

### 在组件中加入 state

1. 首先将函数组件转换成 class 组件：

```javascript
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
ReactDOM.render(
  <Clock date={new Date()} />,
  document.getElementById('root')
);
```

现在，每次组件更新时 `render` 方法都会被调用，只要在相同的 DOM 节点中渲染 `<Clock />` ，就仅有一个 `Clock` 组件的 class 实例被创建使用。这就使得我们可以使用如 state 或生命周期方法等很多其他特性。

> tips：函数式编程使用这些则需要 Hooks

2. 把 `render()` 方法中的 `this.props.date` 替换成 `this.state.date`，并添加 constructor 为 `this.state` 赋初值 ：

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};  
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock date={new Date()} />,
  document.getElementById('root')
);
```

Class 组件应该始终使用 `props` 参数来调用父类的构造函数。

3. 移除 `<Clock />` 元素中的 `date` 属性：

```javascript
ReactDOM.render(
  <Clock />,  
  document.getElementById('root')
);
```

### 正确使用 State

1. 不要直接修改 state：`this.state.comment = 'Hello';`，此时不会触发重新渲染，使用 `this.setState()` 代替它；
2. 出于性能考虑，React 可能会把多个 `setState()` 调用合并成一个调用。因此 `this.props` 和 `this.state` 可能会异步更新，所以不要依赖他们的值来更新下一个状态，应该时刻记住使用现有状态来改变下一个状态。

### 数据是向下传递的

任何组件都无法知道其它组件是有状态还是无状态的，也不关心别的组件是函数还是 class 组件。这就是 state 为局部或封装的的原因，因为除了组件本身，没有别的组件可以调用它。

组件可以选择把它的 state 作为 props 向下传递到它的子组件中：

```html
 <FormattedDate date={this.state.date} />
```

在别的组件中被调用`FormattedDate` 组件可以在其 props 中接收参数 `date`。

## 生命周期方法

在具有许多组件的应用程序中，当组件被销毁时释放所占用的资源是非常重要的。用一张图来描述现在的[生命周期](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)：

<img :src="$withBase('/React/lifeCycle.png')" alt="生命周期方法"/>

在上述的时钟例子中，我们可以使用一些生命周期方法，在组件被挂载或者卸载时使用：

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() { 
  	this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
    
  componentWillUnmount() { 
  	clearInterval(this.timerID);
  }
  
  tick() {
    this.setState({
      date: new Date()
    });
  }  
    
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

`componentDidMount()` 方法会在组件已经被渲染到 DOM 中后运行，所以最好在这里设置计时器。

如果不再需要计时器（比如计时结束），可以在 `componentWillUnmount()` 生命周期方法中清除。

我们不能直接修改 state ，而是要使用 `this.setState()` 来时刻更新组件 state，就犹如之前所说，state 表示每一帧的状态，随意修改 state 可能会导致一些错误。

现在，我们成功使用 state 和生命周期函数实现了原来的时钟功能：

1. 当 `<Clock />` 被传给 `ReactDOM.render()`的时候，React 会调用 `Clock` 组件的构造函数。因为 `Clock` 需要显示当前的时间，所以它会用一个包含当前时间的对象来初始化 `this.state`。我们会在之后更新 state。
2. 之后 React 会调用组件的 `render()` 方法。这就是 React 确定该在页面上展示什么的方式。然后 React 更新 DOM 来匹配 `Clock` 渲染的输出。
3. 当 `Clock` 的输出被插入到 DOM 中后，React 就会调用 `ComponentDidMount()` 生命周期方法。在这个方法中，`Clock` 组件向浏览器请求设置一个计时器来每秒调用一次组件的 `tick()` 方法。
4. 浏览器每秒都会调用一次 `tick()` 方法。 在这方法之中，`Clock` 组件会通过调用 `setState()` 来计划进行一次 UI 更新。得益于 `setState()` 的调用，React 能够知道 state 已经改变了，然后会重新调用 `render()` 方法来确定页面上该显示什么。这一次，`render()` 方法中的 `this.state.date` 就不一样了，如此以来就会渲染输出更新过的时间。React 也会相应的更新 DOM。
5. 一旦 `Clock` 组件从 DOM 中被移除，React 就会调用 `componentWillUnmount()` 生命周期方法，这样计时器就停止了。

## 从设计稿开始

[参考文档](https://zh-hans.reactjs.org/docs/thinking-in-react.html)

创建一个大型组件首先需要考虑到以下三点：

- 静态 UI 应该长啥样：通过 HTML + CSS 等来设计
- 每个小组件的状态组成：来自外部还是内部维护
- 每个小组件的交互方式：用户在内部进行的操作怎么暴露出去

假如这是一张设计稿：图片

我们需要对其进行拆分，拆成一个个小的组件，然后再分别编写这些组件，最后实现交互。

具体来说：

**第一步**：将设计好的 UI 划分为组件层级

可以将组件当作一种函数或者是对象来考虑，根据**单一功能原则**来判定组件的范围。也就是说，一个组件原则上只能负责一个功能。如果它需要负责更多的功能，这时候就应该考虑将它拆分成更小的组件，设计稿中被其他组件包含的子组件，在层级上应该作为其子节点。将 UI 分离为组件，其中每个组件需与数据模型的某部分匹配。

**第二步**：创建一个静态页面

我们已经确定了组件层级，通过这个层级来编写应用，最好把 UI 和交互这两个过程分开。这是因为，编写一个应用的静态版本时，往往要编写大量代码，而不需要考虑太多交互细节；添加交互功能时则要考虑大量细节，而不需要编写太多代码。

在构建应用的静态版本时，我们需要创建一些会重用其他组件的组件，然后通过 props 传入所需的数据。props 是父组件向子组件传递数据的方式。在这一步中，不应该使用 state 构建静态页面。state 代表了随时间会产生变化的数据，应当仅在实现交互时使用。

最顶层的组件通过 props 获取你的数据模型，如果数据模型发生改变，将再次调用 ReactDOM.render()，UI 就会相应地被更新。数据模型变化 -> 调用 render() 方法 -> UI 相应变化，这个过程并不复杂，因此很容易看清楚 UI 是如何被更新的，以及是在哪里被更新的。React 的单向数据流（也叫单向绑定）思想使得组件模块化，易于快速开发。

**第三步**：确定 UI state 的最小完整表示

React 使用 state 让 UI 具备交互功能，同时具有触发基础数据模型改变的能力。为了正确地构建应用，你首先需要找出应用所需的 state 的最小表示，并根据需要计算出其他所有数据。其中遵循的原则是 **DRY: Don’t Repeat Yourself**。只保留应用所需的可变 state 的最小集合，其他数据均由它们计算产生。比如，你要编写一个任务清单应用，你只需要保存一个包含所有事项的数组，而无需额外保存一个单独的 state 变量（比如存储任务个数）。当你需要展示任务个数时，只需要利用该数组的 length 属性即可。

如何确定一个数据是否属于 state：

1. 该数据是否是由父组件通过 props 传递而来的？如果是，那它应该不是 state。
2. 该数据是否随时间的推移而保持不变？如果是，那它应该也不是 state。
3. 你能否根据其他 state 或 props 计算出该数据的值？如果是，那它也不是 state。

**第四步**：确定 state 放置的位置

我们需要确定哪个组件能够改变这些 state，或者说拥有这些 state。

可以尝试通过以下步骤来判断，对于应用中的每一个 state：

- 找到根据这个 state 进行渲染的所有组件。
- 找到他们的共同所有者组件（在组件层级上高于所有需要该 state 的组件，父组件或更高层级）。
- 该共同所有者组件或者比它层级更高的组件应该拥有该 state。
- 如果你找不到一个合适的位置来存放该 state，就可以直接创建一个新的组件来存放该 state，并将这一新组件置于高于共同所有者组件层级的位置。

**第五步**：添加反向数据流

通过前四步，我们可以实现数据的单向传输。假设我们写了一个组件，里面有一个另外一个搜索框组件，此时搜索框是根据外部的数据来渲染，所以 state 放在父组件上，搜索框组件通过 props 来接收。当我们需要向输入框中输入东西，是不能输入的，因为我们只是在搜索组件里输入，并没有改变 state。这时候就要反向传递数据，父组件通过监听搜索框的数据变化，来及时更新自己的 state，从而触发重新渲染，才能将数据正常显示在搜索框中。也即用户视觉上看到可以正常输入东西。而数据反向传递，需要通过 onChange 来实现。







