# React 组件通讯

1. 子组件通过 props 来接收父组件传过来的数据；

2. 子组件通过父组件传过来的作用域为父组件自身的函数，可以修改父组件的值，相当于子组件给父组件传值；

3. 父组件可以使用 refs 来调用子组件实例的方法（只限 class 组件，函数式组件没有实例）：

   ```javascript
   class Child extends React.Component {
     myFunc() {
       return "hello"
     }
   }
   
   class Parent extends React.Component {
     componentDidMount() {
       console.log(this.foo.myFunc())
       console.log(ReactDOM.findDOMNode(this.foo))
     }
     render() {
       return (
         <Child
           ref={foo => {
             this.foo = foo
           }}
         />
       )
     }
   }
   ```

   过程是：

   1. 子组件有一个方法 myFunc
   2. 父组件传递一个 ref 属性，采用 callback-refs 的形式，参数是组件实例/原生 DOM 元素（此处 foo 是 Child 组件实例），在 componentDidMount 之前，会执行这个回调函数，将子组件实例赋值给 this.foo
   3. 最后在父组件中就可以直接使用 this.foo 调用子组件的方法

4. 利用原生 DOM 的事件冒泡机制；

5. 如果是兄弟组件，可以通过设置他们的共有父组件来连接通信；

6. 如果是一些全局性质的属性，可以通过 Context 来传递；

   ```javascript
   const ThemeContext = React.createContext('light');
   
   class App extends React.Component {
     render() {
       return (
         <ThemeContext.Provider value="dark">
           <Toolbar />
         </ThemeContext.Provider>
       );
     }
   }
   
   function Toolbar() {
     return (
       <div>
         <ThemedButton />
       </div>
     );
   }
   
   class ThemedButton extends React.Component {
     static contextType = ThemeContext;
     render() {
       return <Button theme={this.context} />;
     }
   }
   ```

7. 使用 Portals（传送门）
   组件一般会按照既定顺序渲染，有些时候，子组件

8. 使用 Redux
