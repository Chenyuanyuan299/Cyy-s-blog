# 非受控组件

受控组件一般指，由 React 的 state 来控制组件的渲染，由 this.setState 改变 state 来触发组件的更新，也就是说，组件通过 state 来控制。

那么非受控组件就很明显就是不受 React 的 state 控制的组件，如下：

```javascript
class Test extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      name: 'KKKK'
    }
    this.nameInputRef = React.createRef();
    this.alertName = this.alertName.bind(this);
  }
  render() {
    return ( 
      <div>
        <input 
          defaultValue={this.state.name} 
          ref={this.nameInputRef}
        />
        <span>{this.state.name}</span>
        <button onClick={this.alertName}>alert name</button>
      </div>
    )
  }
  alertName() {
    const element = this.nameInputRef.current
    console.log(element)
    alert(element.value)
  }
}
```

当使用非受控组件时，通过 ref 来控制 DOM 节点，记得配合 defaultValue、defaultChecked 使用（value 应该配合 onChange）。 

上面的 span 使用的是 state 的值，并不会随着输入的改变而改变，而 alert 通过 DOM 节点获取最新的值，是会同步改变的，这就是非受控组件的基本使用。

一般情况下，什么时候必须操作 DOM，如文件上传、富文本编译器等，这时候就需要使用非受控组件。