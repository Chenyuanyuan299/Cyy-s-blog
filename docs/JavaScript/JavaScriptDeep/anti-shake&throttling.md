# 防抖（debounce）与节流（throttle）

防抖与节流事实上属于前端性能优化的范畴，但是碰到的概率还是蛮大的。

比如一个滚动事件，要根据滚动高度来进行渲染，但是滚动的 API 触发频率太高了，会导致多次渲染，要求过一段时间渲染一次，这就要使用到防抖与节流。

防抖与节流都是防止多次函数调用。

所谓防抖，就是指触发事件在 delay 后才执行函数，如果在这个 delay 内又触发了事件，则将重新计算这段时间。

## 防抖

一个简单的防抖函数：

```javascript
// 基础版，只能最后调用，不能立即调用
const debounce = (fn, delay) => {
    let timer
    return function(...args) {
        // 如果已经设定过定时器就清空
        if (timer) {
            clearTimeout(timer)
        }
        // 开始一个新的定时器，延迟用户行为
        // 最后一次触发之后，在一个delay时间段内用户不再触发，就执行
        timer = setTimeout(() => {
        	fn.apply(this, args)
        }, delay)
    }
}
```

这个防抖函数，会在用户最后一次触发时隔一个 delay 执行，但是这有一个缺点，有些情况下我们希望开始的一瞬间先执行一遍用户的操作，然后根据这个操作来开启防抖。

比如说后端传来数据，前端将数据渲染到一个 input 框，现在用户要改变输入，虽然做了双向绑定但是输入时却没有任何反应，这是因为设置了防抖之后，用户的操作必须等 delay 之后才执行，然而触发防抖这个函数又需要 onChange，就自相矛盾了。

正确的做法是，在防抖开始之前，先触发一遍函数，来带动防抖的执行：

```javascript
// 升级版，第三个参数代表是否要立即执行一遍
const debounce = (fn, delay, immediate = true) => {
    let timer, context, params

    // 延迟执行函数
    const later = () => setTimeout(() => {
        timer = null
        // 定时器到时，如果是非立即执行，就拿到之前的缓存，执行最后一次操作
        if (!immediate) {
            fn.apply(context, params)
            context = params = null
        }
    }, delay)
    return function (...args) {
        // 如果没有延迟执行函数，就创建一个
        if (!timer) {
            timer = later()
            // 如果是立即执行，那么先执行一遍用户操作 fn
            // 如果是非立即执行，就把用户操作先缓存
            if (immediate) {
                fn.apply(this, args)
            } else {
                context = this
                params = args
            }
        } else {
            // 如果有延迟执行函数，说明delay之内用户仍在操作，清空定时器，重新定时
            clearTimeout(timer)
            timer = later()
        }
    }
}
```

## 节流

节流会每隔一个 delay 调用一次（用户一直触发）。

使用时间戳写法，函数会立即执行，停止出触发后没有办法再次执行：

```javascript
const throttle = (fn, delay) => {
    let oldTime = Date.now()
    return function (...args) {
        let curTime = Date.now()
        if (curTime - oldTime >= delay) {
            fn.apply(null, args)
            oldTime = Date.now()
        }
	}
}
```

使用定时器写法，delay 后第一次执行，最后一次事件停止触发后依然会再执行一次：

```javascript
const throttle = (fn, delay) => {
	let timer = null
    return function (...args) {
		if (!timer) {
			time = setTimeout(() => {
                fn.apply(this, args)
                timer = null
        	}, delay)
        }
    }
}
```

合并版本：

```javascript
const throttled = (fn, delay) => {
    let timer = null
    let oldTime = Date.now()
    return function (...args) {
        let curTime = Date.now()
        // 从上一次到现在，还剩下多少多余时间
        let remaining = delay - (curTime - oldTime)
        clearTimeout(timer)
        if (remaining <= 0) {
            fn.apply(this, args)
            oldTime = Date.now()
        } else {
            timer = setTimeout(fn, remaining);
        }
    }
}
```

