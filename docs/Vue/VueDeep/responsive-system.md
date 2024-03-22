# 响应系统的作用与实现

副作用函数指，当该函数执行时，会直接或间接影响其他函数的执行，例如对 body 的设置，或者对全局变量的修改。

响应式数据指，副作用函数读取了该数据并作用于其他地方，当该数据内容发生改变时，副作用函数能自动重新执行更新。

## 响应式数据的基本实现

副作用函数执行，会触发响应式数据的读取；修改响应式数据，会触发响应式数据的设置。我们可以拦截这两个过程。

``` javascript
// 存储副作用函数的桶
const bucket = new Set()

const data = { text: 'hello world' }
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 effect 添加到存储副作用函数的桶中
    bucket.add(effect)
    return target[key]
  },
  // 拦截设置操作
  set(target, key, newVal) {
    target[key] = newVal
    // 把副作用函数从桶里取出并执行
    bucket.forEach(fn => fn())
  }
})

function effect() {
  document.body.innerText = obj.text
}
effect()
```

## 设计一个完善的响应式系统

完善一下副作用函数名 effect 的硬编码方式：

```javascript
let activeEffect
function effect(fn) {
  // 当调用 effect 注册副作用函数时，将副作用函数复制给 activeEffect
  activeEffect = fn
  // 执行副作用函数
  fn()
}

// 可以注册任何形式的副作用函数了
effect(() => {
  // console.log('effect run')
  document.body.innerText = obj.text
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)
```

实际上按照以上的代码，副作用函数与被操作的目标字段间并没有建立联系，无论读取该对象的哪个属性，都会把副作用函数收集到桶中；无论设置该对象的哪个属性，都会把桶中的副作用函数取出来执行。console.log 将会被执行两次。

使用 weakMap 进行改造，并将收集和触发进行封装：

``` javascript
const bucket = new WeakMap()

const data = { text: 'hello world' }
const obj = new Proxy(data, {
  get(target, key) {
    track(target, key)
    return target[key]
  },
  
  set(target, key, newVal) {
    target[key] = newVal
		trigger(target, key)
  }
})

function track(target, key) {
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
}
function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  effects && effects.forEach(fn => fn())
}
```

## 分支切换与 cleanup

有如下代码：

``` javascript
const data = { ok: true, text: 'hello world' }
const obj = new Proxy(data, { /*...*/ })

effect(function effectFn() {
  document.body.innerText = obj.ok ? obj.text : 'not'
})
```

此时，副作用函数 effectFn 被字段 data.ok 和 data.text 对应的依赖集合收集，当 obj.ok 的值被修改为 fasle，理想情况下副作用函数 effectFn 不应再被 obj.text 对应的依赖集合收集，但是当执行`obj.text = 'hello vue3'`时，由于副作用函数 effectFn 仍存在于 obj.text 对应的依赖集合中，所以该函数会重新执行，为了解决这个问题，可以在 track 函数中对该依赖集合进行反向收集，并且在每次副作用函数执行时，将其从相关联的依赖集合中移除并建立新的联系：

```javascript
let activeEffect
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
  }
  // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
  effectFn.deps = []
  effectFn()
}

function track(target, key) {
	...
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}
```

当前的代码会导致无限循环，

