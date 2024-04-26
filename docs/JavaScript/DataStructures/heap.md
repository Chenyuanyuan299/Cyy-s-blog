# JavaScript 实现堆

```javascript
export class Heap {
    /**
     * @param {function} compare 
     * @param {array} [_values]
     * @param {number|string|object} [_leaf]
     */
    constructor(compare, _values, _leaf) {
        if (typeof (compare) !== 'function') {
            throw new Error('Heap constructor expects a compare function')
        }
        this._compare = compare
        this._nodes = Array.isArray(_values) ? _values : []
        this._leaf = _leaf || null;
    }

    // 插入元素
    insert(value) {
        this._nodes.push(value);
        this._heapifyUp(this.size() - 1)
        if (this._leaf === null || this._compare(value, this._leaf) > 0) {
            this._leaf = value
        }
        return this
    }
    push(value) {
        return this.insert(value)
    }

    // 弹出堆顶元素
    extractRoot() {
        if (this.isEmpty()) {
            return null
        }
        const root = this.root()
        this._nodes[0] = this._nodes[this.size() - 1]
        this._nodes.pop()
        this._heapifyDown(0)
        if (root === this._leaf) {
            this._leaf = this.root()
        }
        return root
    }
    pop() {
        return this.extractRoot()
    }

    // 返回堆顶元素值
    root() {
        if (this.isEmpty()) {
            return null
        }
        return this._nodes[0]
    }
    top() {
        return this.root()
    }
    // 返回对应规则的最后一个叶子节点
    leaf() {
        return this._leaf
    }

    _compareAt(i, j) {
        return this._compare(this._nodes[i], this._nodes[j])
    }
    _swap(i, j) {
        [this._nodes[i], this._nodes[j]] = [this._nodes[j], this._nodes[i]]
    }
    // 根据比较类型判断是否需要交换
    _shouldSwap(parentIndex, childIndex) {
        if (parentIndex < 0 || parentIndex >= this.size()) {
            return false
        }
        if (childIndex < 0 || childIndex >= this.size()) {
            return false
        }
        return this._compareAt(parentIndex, childIndex) > 0
    }
    _hasLeftChild(parentIndex) {
        const leftChildIndex = (parentIndex << 1) + 1
        return leftChildIndex < this.size()
    }
    _hasRightChild(parentIndex) {
        const rightChildIndex = (parentIndex << 1) + 2
        return rightChildIndex < this.size()
    }
    _compareChildrenOf(parentIndex) {
        if (!this._hasLeftChild(parentIndex) && !this._hasRightChild(parentIndex)) {
            return -1
        }
        const leftChildIndex = (parentIndex << 1) + 1
        const rightChildIndex = (parentIndex << 1) + 2
        if (!this._hasLeftChild(parentIndex)) {
            return rightChildIndex
        }
        if (!this._hasRightChild(parentIndex)) {
            return leftChildIndex
        }
        const compare = this._compareAt(leftChildIndex, rightChildIndex)
        return compare > 0 ? rightChildIndex : leftChildIndex
    }
    _heapifyUp(startIndex) {
        let childIndex = startIndex
        let parentIndex = (childIndex - 1) >> 1
        while (this._shouldSwap(parentIndex, childIndex)) {
            this._swap(parentIndex, childIndex)
            childIndex = parentIndex
            parentIndex = (childIndex - 1) >> 1
        }
    }
    _heapifyDown(startIndex) {
        let parentIndex = startIndex
        let childIndex = this._compareChildrenOf(parentIndex)
        while (this._shouldSwap(parentIndex, childIndex)) {
            this._swap(parentIndex, childIndex)
            parentIndex = childIndex
            childIndex = this._compareChildrenOf(parentIndex)
        }
    }

    size() {
        return this._nodes.length
    }
    isEmpty() {
        return this.size() === 0
    }
    clear() {
        this._nodes = []
        this._leaf = null
    }

    toArray() {
        return Array.from(this._nodes)
    }
    clone() {
        return new Heap(this._compare, this._nodes.slice(), this._leaf)
    }
    fix() {
        for (let i = (this.size() >> 1) - 1; i >= 0; --i) {
            this._heapifyDown(i)
        }
        for (let i = (this.size() >> 1); i < this.size(); ++i) {
            const value = this._nodes[i]
            if (this._leaf === null || this._compare(value, this._leaf) > 0) {
                this._leaf = value
            }
        }
        return this
    }
    isValid() {
        const isValidRecursive = (parentIndex) => {
            let isValidLeft = true
            let isValidRight = true

            if (this._hasLeftChild(parentIndex)) {
                const leftChildIndex = (parentIndex << 1) + 1
                if (this._compareAt(parentIndex, leftChildIndex) > 0) {
                    return false
                }
                isValidLeft = isValidRecursive(leftChildIndex)
            }

            if (this._hasRightChild(parentIndex)) {
                const rightChildIndex = (parentIndex << 1) + 1
                if (this._compareAt(parentIndex, rightChildIndex) > 0) {
                    return false
                }
                isValidRight = isValidRecursive(rightChildIndex)
            }

            return isValidLeft && isValidRight
        }

        return isValidRecursive(0)
    }
    sort() {
        for (let i = this.size() - 1; i > 0; --i) {
            this._swap(0, i)
            this._heapifyDownUntil(i)
        }
        return this._nodes
    }
    _heapifyDownUntil(index) {
        let parentIndex = 0;
        let leftChildIndex = 1;
        let rightChildIndex = 2;
        let childIndex;

        while (leftChildIndex < index) {
            childIndex = this._compareChildrenBefore(
                index,
                leftChildIndex,
                rightChildIndex
            )
            if (this._shouldSwap(parentIndex, childIndex)) {
                this._swap(parentIndex, childIndex)
            }
            parentIndex = childIndex;
            leftChildIndex = (parentIndex << 1) + 1
            rightChildIndex = (parentIndex << 1) + 2
        }
    }
    _compareChildrenBefore(index, leftChildIndex, rightChildIndex) {
        const compare = this._compareAt(rightChildIndex, leftChildIndex);
        if (compare <= 0 && rightChildIndex < index) {
            return rightChildIndex;
        }
        return leftChildIndex;
    }

    [Symbol.iterator]() {
        let size = this.size()
        return {
            next: () => {
                --size
                return {
                    value: this.pop(),
                    done: size === -1
                }
            }
        }
    }

    static heapify(compare, values) {
        if (typeof compare !== 'function') {
            throw new Error('Heap.heapify expects a valid compare function')
        }
        if (!Array.isArray(values)) {
            throw new Error('Heap.heapify expects an valid array')
        }
        return new Heap(compare, values).fix()
    }

    static isHeapified(compare, values) {
        return new Heap(compare, values).isValid()
    }
}
```

compare 函数可以指定当前堆是大顶堆还是小顶堆：

```javascript
// 大顶堆
const compare1 = (a, b) => {
	return a < b ? 1 : -1
}

// 小顶堆
const compare2 = (a, b) => {
	return a > b ? 1 : -1
}
```

