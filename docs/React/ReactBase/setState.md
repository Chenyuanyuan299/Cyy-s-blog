# setState

## 不可变值

在使用 state 的使用，如果要改变 state，千万不能直接 this.state.xxx = xxx，一定要遵循不可变值这一概念，使用 this.setState 来修改；

对于数组类 state，可以使用扩展运算符，不改变数组自身的那些数组方法来修改 state，像 push、pop 这些改变数组自身的，直接 pass；

对于对象类 state，使用 Object.assign 来修改；

## 同步还是异步？

```javascript
this.setState({
    count: this.state.count + 1
}, () => {
    console.log(count) // setState第二个参数为一个回调函数，可以获取最新的count，是同步的；相当于Vue的$nextTick
})
console.log(count) // 这里不能获取最新的count，是异步的

setTimeout(() => {
    this.setState({
    	count: this.state.count + 1
	})
	console.log(count) // 在setTimeout中，是同步的
}, 0)

// 自己定义的 DOM 事件，也是同步的
bodyClick = () => {
    this.setState({
    	count: this.state.count + 1
	})
	console.log(count)
}
componentDidMount() {
    document.body.addEventListener('click', bodyClick)
}
// 记得销毁自定义事件和setTimeout
componentWillUnMount() {
    document.body.removeEventListener('click', this.bodyClick)
    clearTimeout()
}
```

## setState 可能会合并

```javascript
this.setState({
    count: this.state.count + 1
})
this.setState({
    count: this.state.count + 1
})
this.setState({
    count: this.state.count + 1
})
// 类似于 Object.assign({count: 1}, {count: 1})
```

这里由于是异步的，所以每个 setState 都是在原来的 state 的基础上加1，合并之后，三个1变为一个1，所以最终结果是1。

如果使用函数，就不会被合并：

```javascript
this.setState((prevState) => {
    return { 
    	count: prevState.count + 1
    }
})
this.setState((prevState) => {
    return { 
    	count: prevState.count + 1
    }
})
this.setState((prevState) => {
    return { 
    	count: prevState.count + 1
    }
})
```

因为基于 JS 的调用栈，函数会层层执行回调，所以最终结果是3。