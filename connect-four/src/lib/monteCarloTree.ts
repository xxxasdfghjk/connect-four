interface TreeNodeInterface<T> {
    key: number;
    value: T;
    children: TreeNodeInterface<T>[];
}

interface MonteCalroTreeNodeInterface<T> extends TreeNodeInterface<T> {
    uct: number;
    tryCount: number;
}

export class MonteCalroTree<T> {
    private totalTryCount = 0;
    constructor(public rootNode: MonteCalroTreeNode<T>) {}
    getTotalTryCount() {
        return this.totalTryCount;
    }
    getRootNode() {
        return this.rootNode;
    }
    reduceTreeInOrder(func: (node: MonteCalroTreeNode<T>) => void) {
        return MonteCalroTree.reduceTreeInOrderRecursive<T>(this.rootNode, func);
    }
    public static reduceTreeInOrderRecursive<T>(
        node: MonteCalroTreeNode<T>,
        func: (node: MonteCalroTreeNode<T>) => void
    ) {
        func(node);
        for (const child of node.getChildren()) {
            MonteCalroTree.reduceTreeInOrderRecursive<T>(child, func);
        }
    }
    getTreeSize() {
        return this.getTreeSizeRecursive(this.getRootNode());
    }
    getTreeSizeRecursive(node: MonteCalroTreeNode<T>) {
        if (node.children.length === 0) return 1;
        let sum = 0;
        for (const child of node.getChildren()) {
            sum += this.getTreeSizeRecursive(child);
        }
        return 1 + sum;
    }

    public static calcUCT(totalTryCount: number, nodeTryCount: number, gotPoints: number) {
        return gotPoints / nodeTryCount + Math.SQRT2 * Math.sqrt(Math.log(totalTryCount / nodeTryCount));
    }
}

class TreeNode<T> {
    constructor(public key: number, public value: T, public children: TreeNodeInterface<T>[]) {}
    public static ROOT_DUMMY_VALUE = "_root_" as const;

    addChild(node: TreeNodeInterface<T>) {
        this.children.push(node);
    }
    isLeaf() {
        return this.children.length == 0;
    }
    getChildren() {
        return this.children;
    }
    public static getAllLeaf<T>(node: TreeNodeInterface<T>): TreeNodeInterface<T>[] {
        return node.children.length === 0 ? [node] : node.children.flatMap((e) => TreeNode.getAllLeaf(e));
    }
}
class MonteCalroTreeNode<T> extends TreeNode<T> {
    private nodeTryCount = 1;
    private point = 0;

    constructor(key: number, value: T, children: MonteCalroTreeNode<T>[]) {
        super(key, value, children);
    }

    public incrementNodeTryCount() {
        this.nodeTryCount++;
    }
    public getNodeTryCount() {
        return this.nodeTryCount;
    }
    public addPoint(point: number) {
        this.point += point;
    }
    public getPoint() {
        return this.point;
    }

    public getChildren() {
        return this.children as MonteCalroTreeNode<T>[];
    }

    public calcUCT(totalTryCount: number) {
        return this.point / this.nodeTryCount + Math.SQRT2 * Math.sqrt(Math.log(totalTryCount) / this.nodeTryCount);
    }
}
export default MonteCalroTreeNode;
