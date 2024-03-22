# React 事件

## bind this

在一个class组件中：

```javascript
class Test extends React.Component { 
  constructor() {
    this.handleClick1 = this.handleClick1.bind(this)
    this.handleClick3 = this.handleClick3.bind(this)
    this.handleClick3 = this.handleClick3.bind(this)
  }
  render() {
    return ( 
      <div onClick={this.handleClick1}>click</div>
	  // 写法2
	  // <div onClick={this.handleClick1.bind(this)}>click</div>

	  <div onClick={this.handleClick2}>click</div>
      <div onClick={this.handleClick3}>click</div>
    )
  }
  handleClick1() {
    this.setState({
        xxx
    })
  }
  // 静态方法
  handleClick2 = () => {
    this.setState({
        xxx
    })
  }
  handleClick3(event) {
	event.preventDefault() // 阻止默认行为
    event.stopPropagation() // 阻止冒泡
  }
  handleClick4(xx, xx, event) {
	xxx
  }
}
```

- 在 constructor 里，使用了 bind(this)，这相当于把该点击事件注册到组件中，否则点击事件会访问不到组件中的其它数据；
- 相对于写法2的bind(this)，在 constructor 中直接写会更好，这样每次触发点击事件时不会重复绑定，可以节省一些性能；
- handleClick2 是一个静态方法，它的 this 永远指向当前实例，所以可以不用 bind(this)；
- handleClick3 默认获取 event 参数，这个是 React 封装的事件，不是原生的；
- 要传入别的参数使用 handleClick4 的写法，最后一项一定是 event；   

## React 事件和 DOM 事件的区别

先看一段代码：

```javascript
// 一个React组件
const Test = () => {
  const click = (event) => {
    console.log(event) // 指向React封装的组合事件SyntheticBaseEvent
    console.log(event.target) // 指向当前元素
    console.log(event.currentTarget) // 指向当前元素
    console.log(event.__proto__.constructor) // 指向SyntheticBaseEvent构造函数
    console.log(event.nativeEvent) // 指向原生事件
    console.log(event.nativeEvent.target) // 指向当前元素
    console.log(event.nativeEvent.currentTarget)
  }
  return ( 
    <button onClick={click}>click me</button>
  )
}
```

如上代码，有几点结论：

1. React 的 event 是 SyntheticBaseEvent，它模拟了原生 DOM 事件的能力；
2. event.nativeEvent 可以访问原生 event

