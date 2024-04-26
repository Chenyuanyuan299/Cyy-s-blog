# JavaScript 实现二叉搜索树

二叉搜索树节点定义：

```javascript
export class BinarySearchTreeNode {
    constructor(value) {
        this._value = value
        this.parent = null
        this.left = null
        this.right = null
    }

    set value(value) {
        this._value = value
        return this
    }
    get value() {
        return this._value
    }

    set parent(parent) {
        if (parent && !(parent instanceof BinarySearchTreeNode)) {
            throw new Error('parent expects a BinarySearchTreeNode')
        }

        this._parent = parent || null
        return this
    }
    get parent() {
        return this._parent
    }

    set left(left) {
        if (left && !(left instanceof BinarySearchTreeNode)) {
            throw new Error('left expects a BinarySearchTreeNode')
        }

        this._left = left || null
        return this
    }
    get left() {
        return this._left
    }

    set right(right) {
        if (right && !(right instanceof BinarySearchTreeNode)) {
            throw new Error('right expects a BinarySearchTreeNode')
        }

        this._right = right || null
        return this
    }
    get right() {
        return this._right
    }

    isRoot() {
        return this._parent === null
    }
    isLeaf() {
        return !this._left && !this._right
    }
}
```

二叉搜索树：

```javascript
const defaultCompare = (a, b) => {
    if (a === b) return 0
    return a > b ? 1 : -1
}

export class BinarySearchTree {
    constructor(compare, options) {
        if (compare && typeof compare !== 'function') {
            throw new Error('BinarySearchTree constructor expects a compare function')
        }

        this._compare = compare || defaultCompare
        this._options = options || {}
        this._root = null
        this._size = 0
    }
    
    insert(value) {
        const newNode = this._nodeization(value)
        const insertRecursive = (current) => {
            const compare = this._compare(newNode.value, current.value)
            if (compare < 0) {
                if (current.left) {
                    insertRecursive(current.left)
                } else {
                    newNode.parent = current
                    current.left = newNode
                    ++this._size
                }
            } else if (compare > 0) {
                if (current.right) {
                    insertRecursive(current.right)
                } else {
                    newNode.parent = current
                    current.right = newNode
                    ++this._size
                }
            } else {
                current.value = value instanceof BinarySearchTreeNode ? value.value : value
            }
        }

        if (this._root === null) {
            this._root = newNode
            ++this._size
        } else {
            insertRecursive(this._root)
        }
        return this
    }
    
    remove(value) {
        const removeRecursively = (value, current) => {
            if (current === null) return false;
            const compare = this._compare(value, current.value)
            if (compare < 0) return removeRecursively(value, current.left)
            if (compare > 0) return removeRecursively(value, current.right)
            return this.removeNode(current)
        }
        return removeRecursively(value, this._root)
    }
    removeNode(node) {
        if (node === null || !(node instanceof BinarySearchTreeNode)) {
            return false
        }

        // node has no children
        if (node.isLeaf()) {
            if (node.isRoot()) {
                this._root = null
            } else if (this._compare(node.value, node.parent.value) < 0) {
                node.parent.left = null
            } else {
                node.parent.right = null
            }
            --this._size
            this._clearNode(node)
            return true
        }

        // node has a left child and no right child
        if (!node.right) {
            if (node.isRoot()) {
                this._root = node.left
            } else if (this._compare(node.value, node.parent.value) < 0) {
                node.parent.left = node.left
            } else {
                node.parent.right = node.left
            }
            node.left.parent = node.parent
            --this._size
            this._clearNode(node)
            return true
        }

        // node has a right child and no left child
        if (!node.left) {
            if (node.isRoot()) {
                this._root = node.right
            } else if (this._compare(node.value, node.parent.value) < 0) {
                node.parent.left = node.right
            } else {
                node.parent.right = node.right
            }
            node.right.parent = node.parent
            --this._size
            this._clearNode(node)
            return true
        }

        // node has a left child and a right child
        const minRight = this.min(node.right)
        node.value = minRight.value
        return this.removeNode(minRight)
    }

    has(value) {
        const hasValueRecursive = (current) => {
            if (current === null) return false
            const compare = this._compare(value, current.value)
            if (compare === 0) {
                return true
            } else if (compare < 0) {
                return hasValueRecursive(current.left)
            } else {
                return hasValueRecursive(current.right)
            }
        }
        return hasValueRecursive(this._root)
    }
    hasKey(key) {
        if (this._options.key === undefined || this._options.key === null) {
            throw new Error('Missing key prop name in constructor options')
        }
        return this.has({ [this._options.key]: key })
    }
    find(value) {
        const findValueRecursive = (current) => {
            if (current === null) return null
            const compare = this._compare(value, current.value)
            if (compare === 0) {
                return current
            } else if (compare < 0) {
                return findValueRecursive(current.left)
            } else {
                return findValueRecursive(current.right)
            }
        }
        return findValueRecursive(this._root)
    }
    findKey(key) {
        if (this._options.key === undefined || this._options.key === null) {
            throw new Error('Missing key prop name in constructor options')
        }
        return this.find({ [this._options.key]: key })
    }
    max(current = this._root) {
        if (current === null) return null
        if (current.right) return this.max(current.right)
        return current
    }
    min(current = this._root) {
        if (current === null) return null
        if (current.left) return this.min(current.left)
        return current
    }
    // 返回小于指定节点的最大节点
    lowerBound(value, includeEqual = true) {
        let lowerBound = null
        const lowerBoundRecursively = (current)=> {
            if (current === null) return lowerBound
            const compare = this._compare(value, current.value)
            if (compare > 0 || (includeEqual && compare === 0)) {
                if (lowerBound === null || this._compare(lowerBound.value, current.value) <= 0) {
                    lowerBound = current
                }
                return lowerBoundRecursively(current.right)
            }
            return lowerBoundRecursively(current.left)
        }
        return lowerBoundRecursively(this._root)
    }
    floor(value, includeEqual = true) {
        return this.lowerBound(value, includeEqual)
    }
    lowerBoundKey(key, includeEqual = true)  {
        if (this._options.key === undefined || this._options.key === null) {
            throw new Error('Missing key prop name in constructor options')
        }
        return this.lowerBound({ [this._options.key]: key }, includeEqual)
    }
    floorKey(key, includeEqual = true) {
        return this.lowerBoundKey(key, includeEqual)
    }
    // 返回大于指定节点的最小节点
    upperBound(value, includeEqual = true) {
        let upperBound = null
        const upperBoundRecursively = (current)=> {
            if (current === null) return upperBound
            const compare = this._compare(value, current.value)
            if (compare < 0 || (includeEqual && compare === 0)) {
                if (upperBound === null || this._compare(upperBound.value, current.value) >= 0) {
                    upperBound = current
                }
                return upperBoundRecursively(current.left)
            }
            return upperBoundRecursively(current.right)
        }
        return upperBoundRecursively(this._root)
    }
    ceil(value, includeEqual = true) {
        return this.upperBound(value, includeEqual)
    }
    upperBoundKey(key, includeEqual = true) {
        if (this._options.key === undefined || this._options.key === null) {
            throw new Error('Missing key prop name in constructor options')
        }
        return this.upperBound({ [this._options.key]: key }, includeEqual)
    }
    ceilKey(key, includeEqual = true) {
        return this.upperBoundKey(key, includeEqual)
    }

    // Traverses the tree pre-order (node-left-right)
    traversePreOrder(cb, aboutCb) {
        if (typeof cb !== 'function') {
            throw new Error('.traversePreOrder expects a callback function');
        }
        const traverseRecursively = (current) => {
            if (current === null || aboutCb && aboutCb()) return;
            cb(current)
            traverseRecursively(current.left)
            traverseRecursively(current.right)
        }
        traverseRecursively(this._root)
    }
    // Traverses the tree in-order (left-node-right)
    traverseInOrder(cb, aboutCb) {
        if (typeof cb !== 'function') {
            throw new Error('.traverseInOrder expects a callback function');
        }
        const traverseRecursively = (current) => {
            if (current === null) return;
            traverseRecursively(current.left)
            cb(current)
            if (aboutCb && aboutCb()) return;
            traverseRecursively(current.right)
        }
        traverseRecursively(this._root)
    }
    // Traverses the tree post-order (left-right-node)
    traversePostOrder(cb, aboutCb) {
        if (typeof cb !== 'function') {
            throw new Error('.traversePostOrder expects a callback function');
        }
        const traverseRecursively = (current) => {
            if (current === null) return;
            traverseRecursively(current.left)
            traverseRecursively(current.right)
            cb(current)
            if (aboutCb && aboutCb()) return;
        }
        traverseRecursively(this._root)
    }

    root() {
        return this._root
    }
    size() {
        return this._size
    }
    clear() {
        this._root = null
        this._size = 0
    }
    _nodeization(value) {
        let newNode = value
        if (!(newNode instanceof BinarySearchTreeNode)) {
            newNode = new BinarySearchTreeNode(value)
        }
        return newNode
    }
    _clearNode(node) {
        if (node === null || !(node instanceof BinarySearchTreeNode)) {
            return false
        }
        node._value = null
        node._parent = null
        node._left = null
        node._right = null
    }
}
```

