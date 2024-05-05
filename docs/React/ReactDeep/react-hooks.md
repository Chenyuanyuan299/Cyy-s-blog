# React Hooks

## useState

### useState(initialState)

**参数**

`initialState`：你希望 state 初始化的值。它可以是任何类型的值，但对于函数有特殊的行为。在初始渲染后，此参数将被忽略。如果传递函数作为 `initialState`，则它将被视为 **初始化函数**。它应该是纯函数，不应该接受任何参数，并且应该返回一个任何类型的值。当初始化组件时，React 将调用你的初始化函数，并将其返回值存储为初始状态。

**返回**

1. 当前的 state。在首次渲染时，它将与你传递的 `initialState` 相匹配。
2. set 函数，它可以让你将 state 更新为不同的值并触发重新渲染。

### set 函数，例如 setSomething(nextState)

**参数**

`nextState`：你想要 state 更新为的值。它可以是任何类型的值，但对于函数有特殊的行为。如果你将函数作为 `nextState` 传递，它将被视为 **更新函数**。它必须是纯函数，只接受待定的 state 作为其唯一参数，并应返回下一个状态。React 将把你的更新函数放入队列中并重新渲染组件。在下一次渲染期间，React 将通过把队列中所有更新函数应用于先前的状态来计算下一个状态。

**返回**

set 函数没有返回值。

**注意事项**

- `useState` 是一个 Hook，因此你只能在 **组件的顶层** 或自己的 Hook 中调用它。你不能在循环或条件语句中调用它。如果你需要这样做，请提取一个新组件并将状态移入其中。
- 在严格模式中，React 将 **两次调用初始化函数**，以 [帮你找到意外的不纯性](https://zh-hans.react.dev/reference/react/useState#my-initializer-or-updater-function-runs-twice)。这只是开发时的行为，不影响生产。如果你的初始化函数是纯函数（本该是这样），就不应影响该行为。其中一个调用的结果将被忽略。
- `set` 函数 **仅更新 *下一次* 渲染的状态变量**。如果在调用 `set` 函数后读取状态变量，则 [仍会得到在调用之前显示在屏幕上的旧值](https://zh-hans.react.dev/reference/react/useState#ive-updated-the-state-but-logging-gives-me-the-old-value)。
- 如果你提供的新值与当前 `state` 相同（由 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较确定），React 将 **跳过重新渲染该组件及其子组件**。这是一种优化。虽然在某些情况下 React 仍然需要在跳过子组件之前调用你的组件，但这不应影响你的代码。
- React 会 [批量处理状态更新](https://zh-hans.react.dev/learn/queueing-a-series-of-state-updates)。它会在所有 **事件处理函数运行** 并调用其 `set` 函数后更新屏幕。这可以防止在单个事件期间多次重新渲染。在某些罕见情况下，你需要强制 React 更早地更新屏幕，例如访问 DOM，你可以使用 [`flushSync`](https://zh-hans.react.dev/reference/react-dom/flushSync)。
- 在渲染期间，只允许在当前渲染组件内部调用 `set` 函数。React 将丢弃其输出并立即尝试使用新状态重新渲染。这种方式很少需要，但你可以使用它来存储 **先前渲染中的信息**。[请参见下面的示例](https://zh-hans.react.dev/reference/react/useState#storing-information-from-previous-renders)。
- 在严格模式中，React 将 **两次调用你的更新函数**，以帮助你找到 [意外的不纯性](https://zh-hans.react.dev/reference/react/useState#my-initializer-or-updater-function-runs-twice)。这只是开发时的行为，不影响生产。如果你的更新函数是纯函数（本该是这样），就不应影响该行为。其中一次调用的结果将被忽略。

### 用法

#### 根据先前的 state 更新 state

假设 age 为 42，想要点击一次更新三个状态，请给 set 函数传入更新函数，而不是下一个状态：

```javascript
function handleClick() {
	// setAge(age + 1); // setAge(42 + 1)
	// setAge(age + 1); // setAge(42 + 1)
	// setAge(age + 1); // setAge(42 + 1)
	setAge(a => a + 1); // setAge(42 => 43)
	setAge(a => a + 1); // setAge(43 => 44)
	setAge(a => a + 1); // setAge(44 => 45)
}
```

#### 更新状态中的对象和数组

在 React 中，state 被认为是只读的，因此应该替换它而不是改变现有对象。比如直接重置对象的某个属性值。

对于 React state 中的对象，当对象的层次比较少时，可以使用扩展运算符来创建新对象；当对象的层次比较多时，可以使用 **Immer**，Immer 的底层使用了 Proxy。

对于 React state 中的数组，需要避免使用左列的方法，而首选右列的方法：

|          | 避免使用 (会改变原始数组)     | 推荐使用 (会返回一个新数组）  |
| -------- | ----------------------------- | ----------------------------- |
| 添加元素 | `push`，`unshift`             | `concat`，`[...arr]` 展开语法 |
| 删除元素 | `pop`，`shift`，`splice`      | `filter`，`slice`             |
| 替换元素 | `splice`，`arr[i] = ...` 赋值 | `map`                         |
| 排序     | `reverse`，`sort`             | 先将数组复制一份              |

或者，使用 **Immer**。

还有一个值得注意的点是，当对象是多层级的，或者数组中有下一层级的数组或对象，应当注意扩展运算符是浅拷贝的，也许第一层通过扩展运算符进行拷贝已经改变了引用，但他们的子元素仍然还有同样的引用：

```javascript
const a = [{name: 1, val: 1}, {name: 2, val: 2}, {name: 3, val: 3}]
const b = [...a]
b[0].name = 4 // b [{name: 4, val: 1}, {name: 2, val: 2}, {name: 3, val: 3}]
a // [{name: 4, val: 1}, {name: 2, val: 2}, {name: 3, val: 3}]
a === b // false
```

如果不想自己递归去查询并且修改某个值，请使用 **Immer** 编写更简洁的代码。

#### 避免重复创建初始状态

使用 useState 设置初始数据时，尽量传入一个初始化函数，而不是初始化函数生成数据的执行结果：`useState(func()) => useState(func)`。



## useEffect

### useEffect(setup, dependencies?)

**参数**

`setup`：处理 Effect 的函数。setup 函数选择性返回一个 **清理（cleanup）** 函数。当组件被添加到 DOM 的时候，React 将运行 setup 函数。在每次依赖项变更重新渲染后，React 将首先使用旧值运行 cleanup 函数（如果你提供了该函数），然后使用新值运行 setup 函数。在组件从 DOM 中移除后，React 将最后一次运行 cleanup 函数。

**可选** `dependencies`：`setup` 代码中引用的所有响应式值的列表。响应式值包括 props、state 以及所有直接在组件内部声明的变量和函数。如果你的代码检查工具 [配置了 React](https://zh-hans.react.dev/learn/editor-setup#linting)，那么它将验证是否每个响应式值都被正确地指定为一个依赖项。依赖项列表的元素数量必须是固定的，并且必须像 `[dep1, dep2, dep3]` 这样内联编写。React 将使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 来比较每个依赖项和它先前的值。如果省略此参数，则在每次重新渲染组件之后，将重新运行 Effect 函数。

**返回**

useEffect 返回 undefined。

**注意事项**

- `useEffect` 是一个 Hook，因此只能在 **组件的顶层** 或自己的 Hook 中调用它，而不能在循环或者条件内部调用。如果需要，抽离出一个新组件并将 state 移入其中。
- 如果你 **没有打算与某个外部系统同步**，[那么你可能不需要 Effect](https://zh-hans.react.dev/learn/you-might-not-need-an-effect)。
- 当严格模式启动时，React 将在真正的 setup 函数首次运行前，**运行一个开发模式下专有的额外 setup + cleanup 周期**。这是一个压力测试，用于确保 cleanup 逻辑“映射”到了 setup 逻辑，并停止或撤消 setup 函数正在做的任何事情。如果这会导致一些问题，[请实现 cleanup 函数](https://zh-hans.react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)。
- 如果你的一些依赖项是组件内部定义的对象或函数，则存在这样的风险，即它们将 **导致 Effect 过多地重新运行**。要解决这个问题，请删除不必要的 [对象](https://zh-hans.react.dev/reference/react/useEffect#removing-unnecessary-object-dependencies) 和 [函数](https://zh-hans.react.dev/reference/react/useEffect#removing-unnecessary-function-dependencies) 依赖项。你还可以 [抽离状态更新](https://zh-hans.react.dev/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) 和 [非响应式的逻辑](https://zh-hans.react.dev/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) 到 Effect 之外。
- 如果你的 Effect 不是由交互（比如点击）引起的，那么 React 会让浏览器 **在运行 Effect 前先绘制出更新后的屏幕**。如果你的 Effect 正在做一些视觉相关的事情（例如，定位一个 tooltip），并且有显著的延迟（例如，它会闪烁），那么将 `useEffect` 替换为 [`useLayoutEffect`](https://zh-hans.react.dev/reference/react/useLayoutEffect)。
- 即使你的 Effect 是由一个交互（比如点击）引起的，**浏览器也可能在处理 Effect 内部的状态更新之前重新绘制屏幕**。通常，这就是你想要的。但是，如果你一定要阻止浏览器重新绘制屏幕，则需要用 [`useLayoutEffect`](https://zh-hans.react.dev/reference/react/useLayoutEffect) 替换 `useEffect`。
- Effect **只在客户端上运行**，在服务端渲染中不会运行。

### 用法

#### 连接到外部系统

useEffect 适合于调用外部接口、使用定时器、使用 JS 原生事件订阅、使用第三方动画库、使用第三方地图组件等场景。

你需要向 `useEffect` 传递两个参数：

1. 一个 setup 函数，其 setup 代码用来连接到该系统。
    - 它应该返回一个 **清理函数**（cleanup），其 cleanup 代码用来与该系统断开连接。
2. 一个依赖项列表，包括这些函数使用的每个组件内的值。

React 在必要时会调用 setup 和 cleanup，这可能会**发生多次**：

1. 将组件挂载到页面时，将运行 setup 代码。
2. 重新渲染依赖项变更的组件后：
    - 首先，使用旧的 props 和 state 运行 cleanup 代码。
    - 然后，使用新的 props 和 state 运行 setup 代码。
3. 当组件从页面卸载后，cleanup 代码将运行最后一次。

#### 在自定义 Hook 中封装 Effect

Effect 是一种脱围机制：当你需要“走出 React 之外”或者当你的使用场景没有更好的内置解决方案时，你可以使用它们。如果你发现自己经常需要手动编写 Effect，那么这通常表明你需要为组件所依赖的通用行为提取一些 [自定义 Hook](https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks)。

> 脱围机制：有些组件可能需要控制和同步 React 之外的系统。例如，你可能需要使用浏览器 API 聚焦输入框，或者在没有 React 的情况下实现视频播放器，或者连接并监听远程服务器的消息。在本章中，你将学习到一些脱围机制，让你可以“走出” React 并连接到外部系统。大多数应用逻辑和数据流不应该依赖这些功能。

#### 使用 Effect 请求数据

假设有如下代码：

```javascript
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
    const [person, setPerson] = useState('Alice');
    const [bio, setBio] = useState(null);

    useEffect(() => {
        let ignore = false;
        setBio(null);
        fetchBio(person).then(result => {
            if (!ignore) {
                setBio(result);
            }
        });
        return () => {
            ignore = true;
        };
    }, [person]);

// ...
```

注意，`ignore` 变量被初始化为 `false`，并且在 cleanup 中被设置为 `true`。这样可以确保不会受到“竞争条件”的影响：网络响应可能会以与你发送的不同的顺序到达。比如在两个 tab 页中来回快速切换，从 1 切到 2 再秒切回 1，切到 2 时，`ignore = false`，当秒切回 1 时，2 由于被销毁，触发了 cleanup，接口请求到的数据将会被遗弃，从而避免了 1 页面先渲染 2 的数据后又渲染 1 的数据。

在 Effect 中使用 `fetch` 是请求数据的一种流行方式，特别是在完全的客户端应用程序中。然而，这是一种非常手动的方法，而且有很大的缺点：

- **Effect 不在服务器上运行**。这意味着初始服务器渲染的 HTML 将只包含没有数据的 loading 状态。客户端电脑仅为了发现它现在需要加载数据，将不得不下载所有的脚本来渲染你的应用程序。这并不高效。
- **在 Effect 中直接请求数据很容易导致“网络瀑布”**。当你渲染父组件时，它会请求一些数据，再渲染子组件，然后重复这样的过程来请求子组件的数据。如果网络不是很快，这将比并行请求所有数据要慢得多。
- **在 Effect 中直接请求数据通常意味着你不会预加载或缓存数据**。例如，如果组件卸载后重新挂载，它不得不再次请求数据。
- **这不符合工效学**。在调用 `fetch` 时，需要编写大量样板代码，以避免像**竞争条件**这样的 bug。

可以考虑使用 Next.js 等框架的内置数据获取机制，或者自行构建客户端缓存。

#### 指定响应式依赖项

Effect 代码中使用的每个**响应式值**都必须声明为依赖项，响应式值包括 props 和直接在组件内声明的所有变量和函数。如果没有任何依赖项，并且不希望组件的每次单独渲染（和重新渲染）之后反复执行 Effect，将第二个参数设置为空数组`[]`。

#### 在 Effect 中根据先前 state 更新 state 

当你想要在 Effect 中根据先前的 state 更新 state 时，你可能会遇到问题：

```javascript
function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCount(count + 1); // 你想要每秒递增该计数器...
        }, 1000)
        return () => clearInterval(intervalId);
    }, [count]); // 🚩 ... 但是指定 `count` 作为依赖项总是重置间隔定时器。
    // ...
}
```

因为 `count`  是一个响应式值，所以必须在依赖项列表中指定它。但是，这会导致 Effect 在每次 `count` 更改时再次执行 cleanup 和 setup。这并不理想。

为了解决这个问题，将`c => c + 1`状态更新器传递给 setCount，现在 Effect 不再需要依赖 count，每次 `count` 更改时，它都不需要清理（cleanup）和设置（setup）间隔定时器。

#### 删除不必要的依赖项

如果 Effect 的每次更新依赖于一个对象或者函数，如果这个对象或者函数创建于渲染期间，那 Effect 可能会频繁执行，因为每次组件更新执行渲染，都会创建一个新的对象或者函数。请避免使用渲染期间创建的对象作为依赖项。相反，在 Effect 内部创建对象：

```javascript
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
    const [message, setMessage] = useState('');
    
    // 避免使用渲染期间创建的对象
    // const options = {
    //     serverUrl: serverUrl,
    //     roomId: roomId
    // };

    useEffect(() => {
        // 现在只有在 roomId 变化后，才会重新执行 Effect 并创建一个新的对象
		const options = {
        	serverUrl: serverUrl,
        	roomId: roomId
    	};
        const connection = createConnection(options);
        connection.connect();
        return () => connection.disconnect();
    }, [roomId]);
// ...
```

#### 从 Effect 读取最新的 props 和 state

正常情况下，在 Effect 中读取响应式值时，必须将其添加为依赖项。这样可以确保你的 Effect 对该值的每次更改都“作出响应”。但是某些情况下，只是想获取最新的 props 和 state 而不触发响应。

```javascript
function Page({ url, shoppingCart }) {
    const onVisit = useEffectEvent(visitedUrl => {
        logVisit(visitedUrl, shoppingCart.length)
    });

    useEffect(() => {
        onVisit(url);
    }, [url]); // ✅ 所有声明的依赖项
    // ...
}
```

通过在 `onVisit` 中读取 `shoppingCart`，确保了 `shoppingCart` 不会使 Effect 重新运行。



## useLayoutEffect

如果 Effect 一定要阻止浏览器绘制屏幕，使用 useLayoutEffect 替换 useEffect。useLayoutEffect 是 useEffect 的一个版本，在浏览器重新绘制屏幕之前触发。

比如在某些情况下，元素的渲染需要依据当前的 dom 位置来进行计算，使用 useEffect，Effect 函数会在操作 dom 之后异步执行，所以可能看到闪烁（组件的两次渲染位置不同）。使用 useLayoutEffect 则是在同一个 JS 执行片段中同步执行 Effect 函数，也就是阻塞渲染，并在计算之后执行渲染，看上去的效果就好像页面只渲染了一次，从而避免闪烁。

但是如果 Effect 的执行时间过长，将可能导致渲染被阻塞太久，尽量避免这种情况。



## useReducer

### useReducer(reducer, initialArg, init?) 

**参数**

- `reducer`：用于更新 state 的纯函数。参数为 state 和 action，返回值是更新后的 state。state 与 action 可以是任意合法值。
- `initialArg`：用于初始化 state 的任意值。初始值的计算逻辑取决于接下来的 `init` 参数。
- **可选参数** `init`：用于计算初始值的函数。如果存在，使用 `init(initialArg)` 的执行结果作为初始值，否则使用 `initialArg`。

**返回**

1. 当前的 state。初次渲染时，它是 `init(initialArg)` 或 `initialArg` （如果没有 `init` 函数）。
2. [`dispatch` 函数](https://zh-hans.react.dev/reference/react/useReducer#dispatch)。用于更新 state 并触发组件的重新渲染。

### `dispatch` 函数 

**参数**

- `action`：用户执行的操作。可以是任意类型的值。通常来说 action 是一个对象，其中 `type` 属性标识类型，其它属性携带额外信息。

**返回**

dispatch 函数没有返回值。

**注意事项**

- `useReducer` 是一个 Hook，所以只能在 **组件的顶层作用域** 或自定义 Hook 中调用，而不能在循环或条件语句中调用。如果你有这种需求，可以创建一个新的组件，并把 state 移入其中。
- 严格模式下 React 会 **调用两次 reducer 和初始化函数**，这可以 [帮助你发现意外的副作用](https://zh-hans.react.dev/reference/react/useReducer#my-reducer-or-initializer-function-runs-twice)。这只是开发模式下的行为，并不会影响生产环境。只要 reducer 和初始化函数是纯函数（理应如此）就不会改变你的逻辑。其中一个调用结果会被忽略。
- `dispatch` 函数 **是为下一次渲染而更新 state**。因此在调用 `dispatch` 函数后读取 state [并不会拿到更新后的值](https://zh-hans.react.dev/reference/react/useReducer#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value)，也就是说只能获取到调用前的值。
- 如果你提供的新值与当前的 `state` 相同（使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较），React 会 **跳过组件和子组件的重新渲染**，这是一种优化手段。虽然在跳过重新渲染前 React 可能会调用你的组件，但是这不应该影响你的代码。
- React [会批量更新 state](https://zh-hans.react.dev/learn/queueing-a-series-of-state-updates)。state 会在 **所有事件函数执行完毕** 并且已经调用过它的 `set` 函数后进行更新，这可以防止在一个事件中多次进行重新渲染。如果在访问 DOM 等极少数情况下需要强制 React 提前更新，可以使用 [`flushSync`](https://zh-hans.react.dev/reference/react-dom/flushSync)。

### 用法

#### 向组件添加 reducer 

在组件的顶层作用域调用 `useReducer` 来创建一个用于管理状态（state）的 [reducer](https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer)。

```javascript
import { useReducer } from 'react';

function reducer(state, action) {
    if (action.type === 'incremented_age') {
        return {
            age: state.age + 1
        };
    }
    throw Error('Unknown action.');
}

export default function Counter() {
    const [state, dispatch] = useReducer(reducer, { age: 42 });

    return (
        <>
            <button onClick={() => {
                dispatch({ type: 'incremented_age' })
            }}>
                Increment age
            </button>
            <p>Hello! You are {state.age}.</p>
        </>
    );
}
```

`useReducer` 和 [`useState`](https://zh-hans.react.dev/reference/react/useState) 非常相似，但是它可以让你把状态更新逻辑从事件处理函数中移动到组件外部。



## useRef

### useRef(initialValue)

**参数**

- `initialValue`：ref 对象的 `current` 属性的初始值。可以是任意类型的值。这个参数在首次渲染后被忽略。

**返回**

`useRef` 返回一个只有一个属性的对象:

- `current`：初始值为传递的 `initialValue`。之后可以将其设置为其他值。如果将 ref 对象作为一个 JSX 节点的 `ref` 属性传递给 React，React 将为它设置 `current` 属性。

在后续的渲染中，`useRef` 将返回同一个对象。

**注意事项**

- 可以修改 `ref.current` 属性。与 state 不同，它是可变的。然而，如果它持有一个用于渲染的对象（例如 state 的一部分），那么就不应该修改这个对象。
- 改变 `ref.current` 属性时，React 不会重新渲染组件。React 不知道它何时会发生改变，因为 ref 是一个普通的 JavaScript 对象。
- 除了 [初始化](https://zh-hans.react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents) 外不要在渲染期间写入或者读取 `ref.current`，否则会使组件行为变得不可预测。
- 在严格模式下，React 将会 **调用两次组件方法**，这是为了 [帮助发现意外问题](https://zh-hans.react.dev/reference/react/useState#my-initializer-or-updater-function-runs-twice)。但这只是开发模式下的行为，不会影响生产模式。每个 ref 对象都将会创建两次，但是其中一个版本将被丢弃。如果使用的是组件纯函数（也应当如此），那么这不会影响其行为。

### 用法

#### 使用 ref 引用一个值

useRef 返回一个具有单个 current 属性的 ref 对象，在后续的渲染中，useRef 将返回相同的对象，可以通过改变 current 属性来存储信息，并在之后读取。**改变 ref 不会触发重新渲染**，这意味着 ref 是存储一些不影响组件视图输出信息的完美选择。

#### 通过 ref 操作 DOM

当 React 创建 DOM 节点并将其渲染到屏幕时，React 将会把 DOM 节点设置为 ref 对象的`current`属性。现在可以借助 ref 对象访问`<input>`的 DOM 节点，并且可以调用类似于`focus()`的方法：

```javascript
import { useRef } from 'react';

export default function Form() {
    const inputRef = useRef(null);

    function handleClick() {
        inputRef.current.focus();
    }

    return (
        <>
            <input ref={inputRef} />
            <button onClick={handleClick}>
                聚焦输入框
            </button>
        </>
    );
}
```

#### 通过 forwardRef 将 ref 传递给父组件

原生的标签可以拿到它的 ref，如果是自定义的组件，并没有暴露它们内部 DOM 节点的 ref，可以通过以下方式获取：

```javascript
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
    return (
        <input
            value={value}
            onChange={onChange}
            ref={ref}
        />
    );
});

export default MyInput;
```

父组件中：

```javascript
function Form() {
    const ref = useRef(null);

    function handleClick() {
        ref.current.focus();
    }

    return (
        <form>
            <MyInput label="Enter your name:" ref={ref} />
            <button type="button" onClick={handleClick}>
                编辑
            </button>
        </form>
    );
}
```



## useImperativeHandle

### useImperativeHandle(ref, createHandle, dependencies?)

**参数**

- `ref`：该 `ref` 是你从 [`forwardRef` 渲染函数](https://zh-hans.react.dev/reference/react/forwardRef#render-function) 中获得的第二个参数。
- `createHandle`：该函数无需参数，它返回你想要暴露的 ref 的句柄。该句柄可以包含任何类型。通常，你会返回一个包含你想暴露的方法的对象。
- **可选的** `dependencies`：函数 `createHandle` 代码中所用到的所有响应式的值的列表。响应式的值包含 props、状态和其他所有直接在你组件体内声明的变量和函数。倘若你的代码检查器已 [为 React 配置好](https://zh-hans.react.dev/learn/editor-setup#linting)，它会验证每一个响应式的值是否被正确指定为依赖项。该列表的长度必须是一个常数项，并且必须按照 `[dep1, dep2, dep3]` 的形式罗列各依赖项。React 会使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 来比较每一个依赖项与其对应的之前值。如果一次重新渲染导致某些依赖项发生了改变，或你没有提供这个参数列表，你的函数 `createHandle` 将会被重新执行，而新生成的句柄则会被分配给 ref。

**返回值**

useImperativeHandle 返回 undefined。

### 用法

#### 向父组件暴露一个自定义的 ref 句柄

默认情况下，组件不会将它们的 DOM 节点暴露给父组件。举例来说，如果想要 `MyInput` 的父组件 [能访问到](https://zh-hans.react.dev/learn/manipulating-the-dom-with-refs) `<input>` DOM 节点，必须选择使用`forwardRef`。在某些情况下，我们不是想暴露原生标签，而是暴露一些自定义内容，比如其中的两个方法：

```javascript
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
    const inputRef = useRef(null);
    
    useImperativeHandle(ref, () => {
        return {
            focus() {
                inputRef.current.focus();
            },
            scrollIntoView() {
                inputRef.current.scrollIntoView();
            },
        };
    }, []);

    return <input {...props} ref={inputRef} />;
});
```



## useContext

### useContext(SomeContext)

**参数**

- `SomeContext`：先前用 [`createContext`](https://zh-hans.react.dev/reference/react/createContext) 创建的 context。context 本身不包含信息，它只代表你可以提供或从组件中读取的信息类型。

**返回**

`useContext` 为调用组件返回 context 的值。它被确定为传递给树中调用组件上方最近的 `SomeContext.Provider` 的 `value`。如果没有这样的 provider，那么返回值将会是为创建该 context 传递给 [`createContext`](https://zh-hans.react.dev/reference/react/createContext) 的 `defaultValue`。返回的值始终是最新的。如果 context 发生变化，React 会自动重新渲染读取 context 的组件。

**注意事项**

- 组件中的 `useContext()` 调用不受 **同一** 组件返回的 provider 的影响。相应的 `<Context.Provider>` 需要位于调用 `useContext()` 的组件 **之上**。
- 从 provider 接收到不同的 `value` 开始，React 自动重新渲染使用了该特定 context 的所有子级。先前的值和新的值会使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 来做比较。使用 [`memo`](https://zh-hans.react.dev/reference/react/memo) 来跳过重新渲染并不妨碍子级接收到新的 context 值。
- 如果您的构建系统在输出中产生重复的模块（可能发生在符号链接中），这可能会破坏 context。通过 context 传递数据只有在用于传递 context 的 `SomeContext` 和用于读取数据的 `SomeContext` 是完全相同的对象时才有效，这是由 `===` 比较决定的。

### 用法

#### 向组件树深层传递数据

```javascript
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
    return (
        <ThemeContext.Provider value="dark">
            <Form />
        </ThemeContext.Provider>
    )
}

function Form() {
    return (
        <Panel title="Welcome">
            <Button>Sign up</Button>
            <Button>Log in</Button>
        </Panel>
    );
}

function Panel({ title, children }) {
    const theme = useContext(ThemeContext);
    const className = 'panel-' + theme;
    return (
        <section className={className}>
            <h1>{title}</h1>
            {children}
        </section>
    )
}

function Button({ children }) {
    const theme = useContext(ThemeContext);
    const className = 'button-' + theme;
    return (
        <button className={className}>
            {children}
        </button>
    );
}
```

如果有多层嵌套的 Provider，内层组件将获取离它最近的一层 Provider 所提供的值。

#### 在传递对象和函数时优化重新渲染

如果定义了一个对象或者函数，并且通过 context 传递给下层，当组件重新渲染时，React 还必须重新渲染内层调用该 context 的所有组件。可以使用 useCallback 包裹函数，使用 useMemo 包裹对象，这样只有当它们的依赖项发生变化，才会触发重新渲染。



## useMemo

### useMemo(calculateValue, dependencies)

**参数**

- `calculateValue`：要缓存计算值的函数。它应该是一个没有任何参数的纯函数，并且可以返回任意类型。React 将会在首次渲染时调用该函数；在之后的渲染中，如果 `dependencies` 没有发生变化，React 将直接返回相同值。否则，将会再次调用 `calculateValue` 并返回最新结果，然后缓存该结果以便下次重复使用。
- `dependencies`：所有在 `calculateValue` 函数中使用的响应式变量组成的数组。响应式变量包括 props、state 和所有你直接在组件中定义的变量和函数。如果你在代码检查工具中 [配置了 React](https://zh-hans.react.dev/learn/editor-setup#linting)，它将会确保每一个响应式数据都被正确地定义为依赖项。依赖项数组的长度必须是固定的并且必须写成 `[dep1, dep2, dep3]` 这种形式。React 使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 将每个依赖项与其之前的值进行比较。

**返回**

在初次渲染时，`useMemo` 返回不带参数调用 `calculateValue` 的结果。

在接下来的渲染中，如果依赖项没有发生改变，它将返回上次缓存的值；否则将再次调用 `calculateValue`，并返回最新结果。

**注意事项**

- `useMemo` 是一个 React Hook，所以你只能 **在组件的顶层** 或者自定义 Hook 中调用它。你不能在循环语句或条件语句中调用它。如有需要，将其提取为一个新组件并使用 state。
- 在严格模式下，为了 [帮你发现意外的错误](https://zh-hans.react.dev/reference/react/useMemo#my-calculation-runs-twice-on-every-re-render)，React 将会 **调用你的计算函数两次**。这只是一个开发环境下的行为，并不会影响到生产环境。如果计算函数是一个纯函数（它本来就应该是），这将不会影响到代码逻辑。其中一次的调用结果将被忽略。
- 除非有特定原因，React **不会丢弃缓存值**。例如，在开发过程中，React 会在你编辑组件文件时丢弃缓存。无论是在开发环境还是在生产环境，如果你的组件在初始挂载期间被终止，React 都会丢弃缓存。在未来，React 可能会添加更多利用丢弃缓存的特性——例如，如果 React 在未来增加了对虚拟化列表的内置支持，那么丢弃那些滚出虚拟化列表视口的缓存是有意义的。你可以仅仅依赖 `useMemo` 作为性能优化手段。否则，使用 [state 变量](https://zh-hans.react.dev/reference/react/useState#avoiding-recreating-the-initial-state) 或者 [ref](https://zh-hans.react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents) 可能更加合适。

### 用法

#### 跳过代价昂贵的重新计算

你需要给 `useMemo` 传递两样东西：

1. 一个没有任何参数的 calculation 函数，像这样 `() =>`，并且返回任何你想要的计算结果。
2. 一个由包含在你的组件中并在 calculation 中使用的所有值组成的依赖列表。

在初次渲染时，useMemo 提供的值将是 calculation 函数的执行结果；在后续渲染时，如果依赖列表中的依赖项没有变化，useMemo 将会返回之前的计算结果。否则 React 会重新调用 calculation 函数并返回一个新的值。

#### 跳过组件的重新渲染

**默认情况下，当一个组件重新渲染时，React 会递归地重新渲染它的所有子组件**。如果不想让子组件在 props 未变的情况下重新渲染，可以使用`memo`将其包裹，并结合 useMemo 对传入的对象类型 props 进行缓存。

#### 缓存一个对象或者函数

如果某个计算通过 useMemo 包装，并且它的依赖列表中的对象或者函数是在组件主体中创建的，请把这些值也通过 useMemo 进行包装，否则组件每次渲染，都会创建一个新的对象或者函数，触发最开始的计算函数进行重新计算，导致 useMemo 失效。

```javascript
function Dropdown({ allItems, text }) {
    // const searchOptions = { matchMode: 'whole-word', text };
    // 用 useMemo 将 searchOptions 也进行包裹
    const searchOptions = useMemo(() => {
        return { matchMode: 'whole-word', text };
    }, [text]); // ✅ 只有当 text 改变时才会发生改变

    const visibleItems = useMemo(() => {
        return searchItems(allItems, searchOptions);
    }, [allItems, searchOptions]); // ✅ 只有当 allItems 或 serachOptions 改变时才会发生改变
}
```

#### 循环的列表项中使用 useMemo

```javascript
function ReportList({ items }) {
    return (
        <article>
            {items.map(item =>
                <Report key={item.id} item={item} />
            )}
        </article>
    );
}

function Report({ item }) {
    // ✅ 在顶层调用 useMemo：
    const data = useMemo(() => calculateReport(item), [item]);
    return (
        <figure>
            <Chart data={data} />
        </figure>
    );
} 
```



## useCallback

### useCallback(fn, dependencies)

**参数**

- `fn`：想要缓存的函数。此函数可以接受任何参数并且返回任何值。在初次渲染时，React 将把函数返回给你（而不是调用它！）。当进行下一次渲染时，如果 `dependencies` 相比于上一次渲染时没有改变，那么 React 将会返回相同的函数。否则，React 将返回在最新一次渲染中传入的函数，并且将其缓存以便之后使用。React 不会调用此函数，而是返回此函数。你可以自己决定何时调用以及是否调用。
- `dependencies`：有关是否更新 `fn` 的所有响应式值的一个列表。响应式值包括 props、state，和所有在你组件内部直接声明的变量和函数。如果你的代码检查工具 [配置了 React](https://zh-hans.react.dev/learn/editor-setup#linting)，那么它将校验每一个正确指定为依赖的响应式值。依赖列表必须具有确切数量的项，并且必须像 `[dep1, dep2, dep3]` 这样编写。React 使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较每一个依赖和它的之前的值。

**返回**

在初次渲染时，`useCallback` 返回你已经传入的 `fn` 函数

在之后的渲染中, 如果依赖没有改变，`useCallback` 返回上一次渲染中缓存的 `fn` 函数；否则返回这一次渲染传入的 `fn`。

**注意事项**

- `useCallback` 是一个 Hook，所以应该在 **组件的顶层** 或自定义 Hook 中调用。你不应在循环或者条件语句中调用它。如果你需要这样做，请新建一个组件，并将 state 移入其中。
- 除非有特定的理由，React **将不会丢弃已缓存的函数**。例如，在开发中，当编辑组件文件时，React 会丢弃缓存。在生产和开发环境中，如果你的组件在初次挂载中暂停，React 将会丢弃缓存。在未来，React 可能会增加更多利用了丢弃缓存机制的特性。例如，如果 React 未来内置了对虚拟列表的支持，那么在滚动超出虚拟化表视口的项目时，抛弃缓存是有意义的。如果你依赖 `useCallback` 作为一个性能优化途径，那么这些对你会有帮助。否则请考虑使用 [state 变量](https://zh-hans.react.dev/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) 或 [ref](https://zh-hans.react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents)。

### 用法

#### 跳过组件的重新渲染

你需要传递两个参数给 `useCallback`：

1. 在多次渲染中需要缓存的函数
2. 函数内部需要使用到的所有组件内部值的依赖列表。

**默认情况下，当一个组件重新渲染时， React 将递归渲染它的所有子组件**。如果不想让子组件在 props 未变的情况下重新渲染，可以使用`memo`将其包裹，并结合 useCallback 对传入的函数类型 props 进行缓存。

#### 优化自定义 Hook

如果你正在编写一个自定义 Hook，建议将它返回的任何函数包裹在 `useCallback` 中：

```javascript
function useRouter() {
    const { dispatch } = useContext(RouterStateContext);

    const navigate = useCallback((url) => {
        dispatch({ type: 'navigate', url });
    }, [dispatch]);

    const goBack = useCallback(() => {
        dispatch({ type: 'back' });
    }, [dispatch]);

    return {
        navigate,
        goBack,
    };
}
```

这确保了 Hook 的使用者在需要时能够优化自己的代码。

#### 循环的列表项中使用 useMemo

```javascript
function ReportList({ items }) {
    return (
        <article>
            {items.map(item =>
                <Report key={item.id} item={item} />
            )}
        </article>
    );
}

function Report({ item }) {
    // ✅ 在最顶层调用 useCallback
    const handleClick = useCallback(() => {
        sendReport(item)
    }, [item]);

    return (
        <figure>
            <Chart onClick={handleClick} />
        </figure>
    );
}
```

