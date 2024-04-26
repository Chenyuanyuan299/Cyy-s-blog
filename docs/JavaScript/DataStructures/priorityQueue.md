# JavaScript 实现优先队列

优先队列的实现主要基于堆的实现：

```javascript
import { Heap } from './Heap.js'

export class PriorityQueue {
    constructor(compare, _values) {
        if (typeof (compare) !== 'function') {
            throw new Error('PriorityQueue constructor expects a compare function')
        }
        this._heap = new Heap(compare, _values)
        if (_values) {
            this._heap.fix()
        }
    }

    enqueue(value) {
        return this._heap.insert(value)
    }
    push(value) {
        return this.enqueue(value)
    }

    dequeue() {
        return this._heap.extractRoot()
    }
    pop() {
        return this.dequeue()
    }

    front() {
        return this._heap.root()
    }
    back() {
        return this._heap.leaf()
    }

    // 根据回调函数删除对应节点
    remove(cb) {
        if (typeof cb !== 'function') {
            throw new Error('PriorityQueue remove expects a callback');
        }
        const removed = []
        const dequeue = []
        while(!this.isEmpty()) {
            const popped = this.pop()
            if (cb(popped)) {
                removed.push(popped)
            } else {
                dequeue.push(popped)
            }
        }

        dequeue.forEach((val) => this.enqueue(val))
        return removed
    }

    size() {
        return this._heap.size()
    }
    isEmpty() {
        return this._heap.isEmpty()
    }
    clear() {
        this._heap.clear()
    }
    toArray() {
        return this._heap.clone().sort().reverse()
    }

    [Symbol.iterator]() {
        let size = this.size();
        return {
            next: () => {
            --size
            return {
                value: this.pop(),
                done: size === -1
            };
            }
        };
    }

    static fromArray(compare, values) {
        return new PriorityQueue(compare, values)
    }
}
```

compare 函数可以指定当前优先队列从大到小还是从小到大：

```javascript
// 从大到小
const compare1 = (a, b) => {
	return a < b ? 1 : -1
}

// 从小到大
const compare2 = (a, b) => {
	return a > b ? 1 : -1
}
```

