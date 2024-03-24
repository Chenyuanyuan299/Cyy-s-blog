# 关于 useEffect() 的坑

之前写项目，用 React Hooks 重构了一遍，在使用 useEffect() 时，碰到了一些坑。

## 1.请求之后，组件循环渲染

初次渲染时，useEffect() 执行，获取后端返回的数据，准备渲染，触发副作用回调函数，导致状态更新，触发重新渲染，又执行了一遍 useEffect()，又触发了副作用回调函数。。。

这是一个很常见的问题，因为 useEffect() 是根据依赖项来判断是否要重新渲染的，我们只需要在第二个参数传入空数组，就可以解决无限渲染问题：

```javascript
useEffect(() => {
    const url = '/api/blog/detail?id=' + id
    axios.get(url).then(res => {
      const resData = res.data.data
      setData(resData)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
```

## 2.useEffect() 拿到数据后，却渲染不出来

明明通过后端已经拿到了数据，但是渲染的时候却说不存在，useState() 设置数据仿佛也失效了，这是为什么？

首先要说到 JS 的渲染，页面是一帧一帧绘制出来的，当每秒的绘制数（FPS）达到60时，页面是流畅的，1秒60帧，相当于分配给每一帧的渲染时间是 1000/60 ≈ 16 ms。在这16 ms 的工作时间中，需要完成：

- 处理用户的交互；
- JS 解析执行；
- 帧开始，窗口尺寸变更，页面滚动等处理；
- rAF (requestAnimationFrame)；
- 布局；
- 绘制。

这其中有一步时间过长，就会导致时间超过16 ms，从而造成卡顿，比如用户交互，点击按钮时处理 js 脚本，本来应该渲染下一帧，现在还在执行脚本，就造成了卡顿。

React Fiber 将这个过程细化了，把渲染更新分成子任务，如果16 ms 之内完成不了工作，就暂停工作，去执行其他优先级更高的工作。Fiber 做的事大概如下：

- 暂停工作，稍后再回来；
- 为不同类型的工作分配优先权；
- 重用以前完成的工作；
- 如果不再需要，则中止工作。

其中涉及到操作系统的任务调度策略。

回到问题，当 useEffect() 中拿到数据后，属于它的16 ms 已经过了，保存数据的工作暂停，自然就拿不到，但是工作并没有被丢弃。等到下一个工作周期，就会重新执行，拿到数据。

比如说现在要拿到一个 title：

```html
// 数据还未正确保存，报错
<div>{data.title}</div>

// 使用'?.'运算符，此时会先渲染一个空标签，然后等拿到数据后重新渲染
<div>{data?.title}</div>
```

这样做会发生页面闪动，并不会影响操作，页面闪动可以用一些用户体验优化来解决。
