class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const node = new Node(value);
        if (!this.root) {
            this.root = node;
        } else {
            this.insertNode(this.root, node);
        }
    }

    insertNode(root, node) {
        if (root.value < node.value) {
            if (!root.left) {
                root.left = node;
            } else {
                this.insertNode(root.left, node);
            }
        } else {
            if (!root.right) {
                root.right = node;
            } else {
                this.insertNode(root.right, node);
            }
        }
    }

    min(root) {
        root.left ? this.min(root.left) : root;
    }
    
    max(root) {
        root.right ? this.max(root.right) : root;
    }

    preOrder(root) {
        if (root) {
            return [root.value, ...this.preOrder(root.left), ...this.preOrder(root.right)];
        } else {
            return [];
        }
    }

    inOrder(root) {
        const sequence = [];
        this.inOrderHelper(root.left, sequence);
        this.inOrderHelper(root, sequence);
        this.inOrderHelper(root.right, sequence);
        return sequence;
    }

    levelOrder(root) {
        const queue = [];
        const bfs = [];
        if (!root) {
           queue.push(root); 
        }
        while (queue.length) {
            const curr = queue.shift();
            bfs.push(curr.value);
            curr.left ? queue.push(curr.left) : undefined;
            curr.right ? queue.push(curr.right) : undefined;
        }
        return bfs;
    }

    delete(value) {
        if (this.root === null) {
            return null;
        }
        this.root = this.deleteNode(this.root, value);
    }

    deleteNode(root, value) {
        if (value < root.value) {
            root.left = this.deleteNode(root.left, value);
        } else if (value > root.value) {
            root.right = this.deleteNode(root.right, value);
        } else {
            if (!root.left && !root.right) {
                return null;
            } else if (!root.left) {
                return root.left; 
            } else if (!root.right) {
                return root.right;
            } else {
                const inOrderSuccessor = this.min(root.right);
                root.value = inOrderSuccessor.value;
                root.right = this.deleteNode(root.right, root.value);
            }
        }
        return root;
    }
}

class AVL extends BST {
    constructor() {
        super();
    }

    
}
