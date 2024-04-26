# JavaScript 实现链表

## 单链表

单链表节点定义：

```javascript
export class LinkedListNode {
    /**
     * @param {any} value 
     * @param {LinkedListNode} [next] 
     */
    constructor(value, next) {
        this.value = value
        this.next = next
    }
    set value(value) {
        this._value = value
        return this
    }
    get value() {
        return this._value
    }
    set next(value) {
        let next = value
        if (next && !(next instanceof LinkedListNode)) {
            next = new LinkedListNode(value)
        }
        this._next = next || null
        return this
    }
    get next() {
        return this._next
    }
    
    clone() {
        const props = { ...this };
        const clone = Reflect.construct(this.constructor, [])
        Object.keys(props).forEach((prop) => {
            clone[prop] = props[prop]
        })
        clone.next = null
        return clone
    }
}
```

单链表：

```javascript
export class LinkedList {
    constructor() {
        this._head = null
        this._length = 0
    }

    insertFirst(value) {
        const newNode = this._nodeization(value)
        newNode.next = this._head
        this._head = newNode
        ++this._length
        return this._head
    }
    insertLast(value, startingNode) {
        if (this.isEmpty()) {
            return this.insertFirst(value)
        }
        if (startingNode && !(startingNode instanceof LinkedListNode)) {
            throw new Error('startingNode expects a LinkedListNode')
        }
        let current = startingNode || this._head
        while (current.next) {
            current = current.next
        }
        const newNode = this._nodeization(value)
        current.next = newNode
        ++this._length
        return newNode
    }
    append(value, startingNode) {
        return this.insertLast(value, startingNode)
    }
    insertAt(index, value) {
        if (Number.isNaN(+index) || index < 0 || index > this._length) {
            throw new Error('.insertAt() expects a valid index between 0 to linked list length')
        }
        if (index === 0) {
            return this.insertFirst(value)
        }
        const newNode = this._nodeization(value)
        let prev = this._head
        let currentIndex = 1
        while (currentIndex < index) {
            prev = prev.next
            ++currentIndex
        }
        newNode.next = prev.next
        prev.next = newNode
        ++this._length
        return newNode
    }

    removeFirst() {
        if (this.isEmpty()) {
            return null
        }
        const removeNode = this._head
        this._head = this._head.next
        --this._length
        removeNode.next = null
        return removeNode
    }
    removeLast() {
        if (this.isEmpty()) {
            return null
        }
        if (this._length === 1) {
            return this.removeFirst()
        }
        let prev = null
        let current = this._head
        while (current.next) {
            prev = current
            current = current.next
        }
        prev.next = null
        --this._length
        return current
    }
    removeAt(index) {
        if (Number.isNaN(+index) || index < 0 || index >= this._length) {
            return null
        }
        if (index === 0) {
            return this.removeFirst()
        }
        let prev = this._head
        let currentIndex = 1
        while (currentIndex < index) {
            prev = prev.next
            ++currentIndex
        }
        const removeNode = prev.next
        prev.next = removeNode.next
        --this._length
        removeNode.next = null
        return removeNode
    }
    removeBy(cb) {
        this._verifyCallBack(cb, '.removeBy() expects a callback')
        let removeCount = 0
        let index = 0
        let prev = null
        let current = this._head
        while (current instanceof LinkedListNode) {
            if (cb(current, index)) {
                const temp = current
                if (prev === null) {
                    this._head = this._head.next
                    current = this._head
                } else {
                    prev.next = prev.next.next
                    current = current.next
                }
                temp.next = null
                --this._length
                ++removeCount
            } else {
                prev = current
                current = current.next
            }
            ++index
        }
        return removeCount
    }

    forEach(cb) {
        this._verifyCallBack(cb, '.forEach(cb) expects a callback')
        let current = this._head
        let index = 0
        while (current instanceof LinkedListNode) {
            cb(current, index)
            ++index
            current = current.next
        }
    }
    find(cb, startingNode) {
        this._verifyCallBack(cb, '.find(cb) expects a callback')
        if (startingNode && !(startingNode instanceof LinkedListNode)) {
            throw new Error('.find(cb) expects a valid start node from LinkedListNode');
        }
        let current = startingNode || this._head
        while (current instanceof LinkedListNode) {
            if (cb(current)) {
                return current
            }
            current = current.next
        }
        return null
    }
    filter(cb) {
        this._verifyCallBack(cb, '.filter(cb) expects a callback')
        const res = new LinkedList()
        let tail = null
        this.forEach((node, index) => {
            if (cb(node, index)) {
                tail = res.insertLast(node.clone(), tail)
            }
        })
        return res
    }

    head() {
        return this._head
    }
    length() {
        return this._length
    }
    toArray() {
        const res = []
        this.forEach((node) => res.push(node._value));
        return res
    }
    toNodeArray() {
        const res = []
        this.forEach((node) => res.push(node));
        return res
    }
    isEmpty() {
        return this._head === null
    }
    clear() {
        this._head = null
        this._length = 0
    }

    _nodeization(value) {
        let newNode = value
        if (!(newNode instanceof LinkedListNode)) {
            newNode = new LinkedListNode(value)
        }
        return newNode
    }
    _verifyCallBack(cb, prompt) {
        let promptWord = prompt || 'the entry callback is not valid'
        if (typeof cb !== 'function') {
            throw new Error(promptWord)
        }
    }

    static fromArray(values) {
        if (!Array.isArray(values)) {
            throw new Error('cannot create LinkedList from none-array values')
        }
        const  linkedList = new LinkedList()
        let tail = null
        for (const v of values) {
            tail = linkedList.insertLast(v, tail)
        }
        return linkedList
    }
}
```

## 双链表

双链表节点定义：

```javascript
export class DoublyLinkedListNode {
    constructor(value, prev, next) {
        this.value = value
        this.prev = prev
        this.next = next
    }
    set value(value) {
        this._value = value
        return this
    }
    get value() {
        return this._value
    }
    set prev(value) {
        let prev = value
        if (prev && !(prev instanceof DoublyLinkedListNode)) {
            prev = new DoublyLinkedListNode(value)
        }
        this._prev = prev || null
        return this
    }
    get prev() {
        return this._prev
    }
    set next(value) {
        let next = value
        if (next && !(next instanceof LinkedListNode)) {
            next = new LinkedListNode(value)
        }
        this._next = next || null
        return this
    }
    get next() {
        return this._next
    }

    clone() {
        const props = { ...this };
        const clone = Reflect.construct(this.constructor, [])
        Object.keys(props).forEach((prop) => {
            clone[prop] = props[prop]
        })
        clone.prev = null
        clone.next = null
        return clone
    }
}
```

双链表：

```javascript
export class DoublyLinkedList {
    constructor() {
        this._head = null
        this._tail = null
        this._length = 0
    }

    insertFirst(value) {
        const newNode = this._nodeization(value)
        if (this.isEmpty()) {
            this._head = newNode
            this._tail = newNode
        } else {
            this._head.prev = newNode
            newNode.next = this._head
            this._head = newNode
        }
        ++this._length
        return newNode
    }
    insertLast(value) {
        const newNode = this._nodeization(value)
        if (this.isEmpty()) {
            this._head = newNode
            this._tail = newNode
        } else {
            newNode.prev = this._tail
            this._tail.next = newNode
            this._tail = newNode
        }
        ++this._length
        return newNode
    }
    append(value) {
        return this.insertLast(value)
    }
    insertAt(index, value) {
        if (Number.isNaN(+index) || index < 0 || index > this._length) {
            throw new Error('.insertAt() expects a valid index between 0 to linked list length')
        }
        if (index === 0) {
            return this.insertFirst(value)
        }
        if (index === this._length) {
            return this.insertLast(value)
        }

        const newNode = this._nodeization(value)
        let prev = this._head
        let currentIndex = 1
        while (currentIndex < index) {
            prev = prev.next
            ++currentIndex
        }
        newNode.prev = prev
        newNode.next = prev.next
        newNode.prev.next = newNode
        newNode.next.prev = newNode
        ++this._length
        return newNode
    }
    insertBefore(value, existingNode) {
        if (existingNode === this._head) {
            return this.insertFirst(value);
        }
        if (!existingNode) {
            return this.insertLast(value);
        }
        const newNode = this._nodeization(value)
        newNode.prev = existingNode.prev
        newNode.next = existingNode
        newNode.next.prev = newNode
        newNode.prev.next = newNode
        ++this._length
        return newNode
    }
    insertAfter(value, existingNode) {
        if (existingNode === this._tail) {
            return this.insertLast(value);
        }
        if (!existingNode) {
            return this.insertFirst(value);
        }
        const newNode = this._nodeization(value)
        newNode.prev = existingNode
        newNode.next = existingNode.next
        newNode.next.prev = newNode
        newNode.prev.next = newNode
        ++this._length
        return newNode
    }

    removeFirst() {
        if (this.isEmpty()) {
            return null
        }
        const removeNode = this._head
        if (this._head.next) {
            this._head = this._head.next
            this._head.prev = null
        } else {
            this._head = null
            this._tail = null
        }
        --this._length
        removeNode.next = null
        return removeNode
    }
    removeLast() {
        if (this.isEmpty()) {
            return null
        }
        const removeNode = this._tail
        if (this._tail.prev) {
            this._tail = this._tail.prev
            this._tail.next = null
        } else {
            this._head = null
            this._tail = null
        }
        --this._length
        removeNode.prev = null
        return removeNode
    }
    removeAt(index) {
        if (Number.isNaN(+index) || index < 0 || index >= this._length) {
            return null
        }
        if (index === 0) {
            return this.removeFirst()
        }
        if (index === this._length - 1) {
            return this.removeLast()
        }
        let current = this._head.next
        let currentIndex = 1
        while (currentIndex < index) {
            current = current.next
            ++currentIndex
        }
        return this.remove(current)
    }
    removeBy(cb) {
        this._verifyCallBack(cb, '.removeBy() expects a callback')
        let removeCount = 0
        let index = 0
        let current = this._head
        while (current instanceof LinkedListNode) {
            if (cb(current, index)) {
                const next = current.next
                this.remove(current)
                ++removeCount
                current = next
            } else {
                current = current.next
            }
            ++index
        }
        return removeCount
    }
    remove(node) {
        if (node && !(node instanceof DoublyLinkedListNode)) {
            throw new Error('remove expects a DoublyLinkedListNode node');
        }
        if (!node) {
            return null
        }
        if (!node.prev) {
            return this.removeFirst();
        }
        if (!node.next) {
            return this.removeLast();
        }
        node.prev.next = node.next
        node.next.prev = node.prev
        node.prev = null
        node.next = null
        --this._length
        return node
    }

    forEach(cb) {
        this._verifyCallBack(cb, '.forEach(cb) expects a callback')
        let current = this._head
        let index = 0
        while (current instanceof DoublyLinkedListNode) {
            cb(current, index)
            ++index
            current = current.next
        }
    }
    forEachReverse(cb) {
        this._verifyCallBack(cb, '.forEachReverse(cb) expects a callback')
        let current = this._tail
        let index = this._length - 1
        while (current instanceof DoublyLinkedListNode) {
            cb(current, index)
            --index
            current = current.prev
        }
    }
    find(cb, startingNode) {
        this._verifyCallBack(cb, '.find(cb) expects a callback')
        if (startingNode && !(startingNode instanceof DoublyLinkedListNode)) {
            throw new Error('.find(cb) expects a valid start node from DoublyLinkedListNode');
        }
        let current = startingNode || this._head
        while (current instanceof DoublyLinkedListNode) {
            if (cb(current)) {
                return current
            }
            current = current.next
        }
        return null
    }
    findReverse(cb, startingNode) {
        this._verifyCallBack(cb, '.findReverse(cb) expects a callback')
        if (startingNode && !(startingNode instanceof DoublyLinkedListNode)) {
            throw new Error('.findReverse(cb) expects a valid start node from DoublyLinkedListNode');
        }
        let current = startingNode || this._tail
        while (current instanceof DoublyLinkedListNode) {
            if (cb(current)) {
                return current
            }
            current = current.prev
        }
        return null
    }
    filter(cb) {
        this._verifyCallBack(cb, '.filter(cb) expects a callback')
        const res = new DoublyLinkedList()
        this.forEach((node, index) => {
            if (cb(node, index)) {
                res.insertLast(node.clone())
            }
        })
        return res
    }

    head() {
        return this._head
    }
    tail() {
        return this._tail
    }
    length() {
        return this._length
    }
    toArray() {
        const res = []
        this.forEach((node) => res.push(node._value));
        return res
    }
    toNodeArray() {
        const res = []
        this.forEach((node) => res.push(node));
        return res
    }
    isEmpty() {
        return this._head === null
    }
    clear() {
        this._head = null
        this._tail = null
        this._length = 0
    }

    _nodeization(value) {
        let newNode = value
        if (!(newNode instanceof DoublyLinkedListNode)) {
            newNode = new DoublyLinkedListNode(value)
        }
        return newNode
    }
    _verifyCallBack(cb, prompt) {
        let promptWord = prompt || 'the entry callback is not valid'
        if (typeof cb !== 'function') {
            throw new Error(promptWord)
        }
    }
}
```

