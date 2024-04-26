# JavaScript 实现平衡二叉树

平衡二叉树的实现基于二叉搜索树

平衡二叉树节点继承于二叉搜索树节点，但是我们把节点的高度以及自旋等功能也放在了节点的类上。

平衡二叉树的节点定义：

```javascript
import { BinarySearchTreeNode } from "./BinarySearchTree.js";

export class AvlTreeNode extends BinarySearchTreeNode {
    constructor(value) {
        super(value)
        this._height = 1
    }
    /**
     * @param {AvlTreeNode} parent
     */
    set parent(parent) {
        if (parent && !(parent instanceof AvlTreeNode)) {
            throw new Error('parent expects a AvlTreeNode')
        }

        this._parent = parent || null
        return this
    }
    /**
     * @param {AvlTreeNode} left
     */
    set left(left) {
        if (left && !(left instanceof AvlTreeNode)) {
            throw new Error('left expects a AvlTreeNode')
        }

        this._left = left || null
        return this
    }
    /**
     * @param {AvlTreeNode} right
     */
    set right(right) {
        if (right && !(right instanceof AvlTreeNode)) {
            throw new Error('right expects a AvlTreeNode')
        }

        this._right = right || null
        return this
    }
    get height() {
        return this._height
    }

    // LL 情况下右旋
    rotateRight() {
        const left = this._left
        if (left) {
            if (left.right) {
                left.right.parent = this
            }
            this._left = left.right
            left.right = this
            left.parent = this._parent
        }
        if (this.parent && left) {
            if (this._compare(this._parent.value, left.value) < 0) {
                this._parent.right = left
            } else {
                this._parent.left = left
            }
        }

        this._parent = left
        this.updateHeight()
        if (this.parent) {
            this._parent.updateHeight()
        }
        return this
    }
    // RR 情况下左旋
    rotateLeft() {
        const right = this._right
        if (right) {
            if (right.left) {
                right.left.parent = this
            }
            this._right = right.left
            right.left = this
            right.parent = this._parent
        } 
        if (this.parent && right) {
            if (this._compare(this._parent.value, right.value) < 0) {
                this._parent.right = right
            } else {
                this._parent.left = right
            }
        }

        this._parent = right
        this.updateHeight()
        if (this.parent) {
            this._parent.updateHeight()
        }
        return this
    }
    // LR 情况下先左旋后右旋
    rotateLeftRight() {
        if (this.left) {
            this._left.rotateLeft()
        }
        this.rotateRight()
        return this
    }
    // RL 情况下先右旋后左旋
    rotateRightLeft() {
        if (this.right) {
            this._right.rotateRight()
        }
        this.rotateLeft()
    }

    getLeftHeight() {
        return this.left ? this.left.getLeftHeight() : 0
    }
    getRightHeight() {
        return this.right ? this.right.getRightHeight() : 0
    }
    updateHeight() {
        this._height = Math.max(this.getLeftHeight(), this.getRightHeight())
        return this
    }
    getBalance() {
        return this.getLeftHeight() - this.getRightHeight()
    }
    isBalanced() {
        const balance = this.getBalance()
        return balance >= -1 && balance <= 1
    }
}
```

平衡二叉树：

```javascript
import { BinarySearchTree } from "./BinarySearchTree.js";

export class AvlTree extends BinarySearchTree {
    constructor(compare, options) {
        if (compare && typeof compare !== 'function') {
            throw new Error('BinarySearchTree constructor expects a compare function')
        }
        super(compare, options)
    }

    insert(value) {
        const newNode = this._nodeization(value)
        const insertRecursive = (current) => {
            const compare = this._compare(newNode.value, current.value)
            if (compare < 0) {
                if (current.left) {
                    insertRecursive(current.left)
                    this._balanceNode(current)
                } else {
                    newNode.parent = current
                    current.left = newNode
                    current.updateHeight()
                    ++this._size
                }
            } else if (compare > 0) {
                if (current.right) {
                    insertRecursive(current.right)
                    this._balanceNode(current)
                } else {
                    newNode.parent = current
                    current.right = newNode
                    current.updateHeight()
                    ++this._size
                }
            } else {
                current.value = value instanceof AvlTreeNode ? value.value : value
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
            if (compare < 0) {
                const removed = removeRecursively(value, current.left)
                this._balanceNode(current)
                return removed
            }
            if (compare > 0) {
                const removed = removeRecursively(value, current.right)
                this._balanceNode(current)
                return removed
            }
            return this.removeNode(current)
        }
        return removeRecursively(value, this._root)
    }
    removeNode(node) {
        if (node === null || !(node instanceof AvlTreeNode)) {
            return false
        }

        // node has no children
        if (node.isLeaf()) {
            if (node.isRoot()) {
                this._root = null
            } else if (this._compare(node.value, node.parent.value) < 0) {
                node.parent.left = null
                node.parent.updateHeight()
            } else {
                node.parent.right = null
                node.parent.updateHeight()
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
                node.parent.updateHeight()
            } else {
                node.parent.right = node.left
                node.parent.updateHeight()
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
                node.parent.updateHeight()
            } else {
                node.parent.right = node.right
                node.parent.updateHeight()
            }
            node.right.parent = node.parent
            --this._size
            this._clearNode(node)
            return true
        }

        // node has a left child and a right child
        const minRight = this.min(node.right)
        node.value = minRight.value
        this._balanceNode(node)
        return this.removeNode(minRight)
    }

    _getNodeHeight(node) {
        if (!node) return 0;
        return node.height
    }

    // 插入或者删除都要及时调整平衡
    _balanceNode(node) {
        if (!node) return;

        node.updateHeight()
        const balance = node.getBalance()
        if (balance > 1) {
            const leftLeft = node.left.left
            const leftRight = node.left.right
            if (this._getNodeHeight(leftLeft) >= this._getNodeHeight(leftRight)) {
                node.rotateRight()
            } else {
                node.rotateLeftRight()
            }
        } else if (balance < -1) {
            const rightRight = node.right.right
            const rightLeft = node.right.left
            if (this._getNodeHeight(rightRight) >= this._getNodeHeight(rightLeft)) {
                node.rotateLeft()
            } else {
                node.rotateRightLeft()
            }
        }

        // check if root was rotated
        if ((balance < -1 || balance > 1) && node === this._root) {
            this._root = node.parent
        }
    }

    _nodeization(value) {
        let newNode = value
        if (!(newNode instanceof AvlTreeNode)) {
            newNode = new AvlTreeNode(value)
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
        node._height = 0
    }
}
```

