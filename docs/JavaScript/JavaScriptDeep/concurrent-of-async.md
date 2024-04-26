# 异步任务的并发量控制

如果需要调用若干个接口请求数据，但是并发调用接口有窗口限制，比如在窗口大小为 2 时，一次只能调用两个接口，请实现一个函数以做到相关功能。

```javascript
// 模拟调用接口
function fac(i, task) {
    return new Promise((resolve) => {
        console.log(task[0], task[1])
        setTimeout(() => {
            console.log(task[0], task[1], 'end----------')
            resolve(i)
        }, task[0] * 1000)
    })
}

function go(limit = 3) {
    const tasks = [[1, "吃饭"], [3, "睡觉"], [5, "打游戏"], [3.5, "学习算法"], [4, "学习 Vue 和 React"]]
    const n = tasks.length
    // 设置任务队列
    const working = new Array(limit).fill().map((_, i) => fac(i % n, tasks[i]))
    let promise = Promise.race(working)
    for (let i = limit; i < n; ++i) {
        promise = promise.then(r => {
            working[r] = fac(i % n, tasks[i]).then(() => r)
            return Promise.race(working)
        })
    }
}
go()
```

