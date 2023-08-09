import ConnectFour, { Yellow, Red, Board, Draw, Unfinished } from "./connectFour";
import MonteCalroTreeNode, { MonteCalroTree } from "./monteCarloTree";
type NodeState = { board: Board; isFinish: Yellow | Red | Draw | Unfinished; turn: Yellow | Red };
class ConnectFourComputer {
    private static examNum = 2000;
    public static calcNextByPrimitiveMonteCarlo(board: Board, myColor: Yellow | Red, width: number, height: number) {
        const actions = ConnectFour.availableActions(board, width);
        const rate = actions.reduce<{ [key: number]: number }>((prev, cur) => ({ ...prev, [cur]: 0 }), {});
        const opponentColor = myColor === 1 ? 2 : 1;
        for (const cur of actions) {
            for (let i = 0; i < ConnectFourComputer.examNum; i++) {
                let examBoard = [...board];
                const res = ConnectFour.placeStone(examBoard, myColor, width, height, cur);
                if (res === myColor) {
                    rate[cur] += 1;
                    continue;
                }
                while (true) {
                    if (ConnectFour.isWinable(examBoard, opponentColor, width, height)) {
                        rate[cur] -= 1;
                        break;
                    }
                    const oppoPlace = ConnectFourComputer.randomPut(examBoard, opponentColor, width, height);
                    if (oppoPlace === 3) {
                        rate[cur] += 0.1;
                        break;
                    }
                    if (ConnectFour.isWinable(examBoard, myColor, width, height)) {
                        rate[cur] += 1;
                        break;
                    }
                    const myPlace = ConnectFourComputer.randomPut(examBoard, myColor, width, height);
                    if (myPlace === 3) {
                        rate[cur] += 0.1;
                        break;
                    }
                }
            }
        }

        return parseInt(Object.entries(rate).sort(([_a1, a2], [_b1, b2]) => b2 - a2)[0][0], 10);
    }

    public static playOut(board: Board, myColor: Yellow | Red): Yellow | Red | Draw {
        const opponentColor = myColor === 1 ? 2 : 1;
        while (true) {
            if (ConnectFour.isWinable(board, myColor, this.WIDTH, this.HEIGHT)) {
                return myColor;
            }
            const myPlace = ConnectFourComputer.randomPut(board, myColor, this.WIDTH, this.HEIGHT);
            if (myPlace === 3) {
                return 3;
            }
            if (ConnectFour.isWinable(board, opponentColor, this.WIDTH, this.HEIGHT)) {
                return opponentColor;
            }
            const opponentPlace = ConnectFourComputer.randomPut(board, opponentColor, this.WIDTH, this.HEIGHT);
            if (opponentPlace === 3) {
                return 3;
            }
        }
    }

    public static NODE_TRY_LIMIT = 500;
    public static WIDTH = 7;
    public static HEIGHT = 6;
    public static redwin = 0;
    public static yellowin = 0;
    public static traverseTree(
        node: MonteCalroTreeNode<{ board: Board; isFinish: Yellow | Red | Draw | Unfinished; turn: Yellow | Red }>,
        totalCount: number
    ): Yellow | Red | Draw {
        if (node.isLeaf()) {
            if (node.value.isFinish !== 4) {
                node.incrementNodeTryCount();
                if (node.value.isFinish === 3) {
                    node.addPoint(0.1);
                } else if (node.value.isFinish !== node.value.turn) {
                    node.addPoint(1);
                }
                return node.value.isFinish;
            }

            const res = this.playOut([...node.value.board], node.value.turn);
            if (node.getNodeTryCount() > this.NODE_TRY_LIMIT) {
                const actions = ConnectFour.availableActions(node.value.board, this.WIDTH);
                const valiableNodes = actions
                    .map((act) => {
                        const cloneBoard = [...node.value.board];
                        const res = ConnectFour.placeStone(
                            cloneBoard,
                            node.value.turn,
                            this.WIDTH,
                            this.HEIGHT,
                            act
                        ) as 1 | 2 | 3 | 4;
                        return new MonteCalroTreeNode<NodeState>(
                            act,
                            { board: cloneBoard, isFinish: res, turn: node.value.turn === 1 ? 2 : 1 },
                            []
                        );
                    })
                    .forEach((e) => node.addChild(e));
            }
            if (res === 3) {
                node.addPoint(0.1);
            } else if (res !== node.value.turn) {
                node.addPoint(1);
            }
            node.incrementNodeTryCount();
            return res;
        } else {
            const targetNode = node.getChildren().sort((a, b) => b.calcUCT(totalCount) - a.calcUCT(totalCount))[0];
            const res = this.traverseTree(targetNode, totalCount);
            if (res === 3) {
                node.addPoint(0.5);
            } else if (res !== node.value.turn) {
                node.addPoint(1);
            }
            node.incrementNodeTryCount();
            return res;
        }
    }

    public static LIMIT = 20000;

    public static calcNextByMonteCarloTreeSearch(board: Board, myColor: Yellow | Red, width: number, height: number) {
        const actions = ConnectFour.availableActions(board, width);
        const nodes = actions.map((act) => {
            const cloneBoard = [...board];
            const res = ConnectFour.placeStone(cloneBoard, myColor, this.WIDTH, this.HEIGHT, act) as 1 | 2 | 3 | 4;
            return new MonteCalroTreeNode<NodeState>(
                act,
                { board: cloneBoard, isFinish: res, turn: myColor === 1 ? 2 : 1 },
                []
            );
        });
        const rootDummyNode = new MonteCalroTreeNode<NodeState>(
            -1,
            { board: [...board], turn: myColor, isFinish: 4 },
            nodes
        );
        const monteCalroTree = new MonteCalroTree(rootDummyNode);
        for (let i = 0; i < this.LIMIT; i++) {
            this.traverseTree(monteCalroTree.getRootNode(), i + 1);
        }
        nodes
            .sort((a, b) => b.getPoint() / b.getNodeTryCount() - a.getPoint() / a.getNodeTryCount())
            .forEach((n) => console.log(n.getPoint() / n.getNodeTryCount(), n.key));

        return nodes.sort((a, b) => b.getPoint() / b.getNodeTryCount() - a.getPoint() / a.getNodeTryCount())[0].key;
    }

    public static randomPut(board: Board, color: Yellow | Red, width: number, height: number) {
        const availableAction = ConnectFour.availableActions(board, width);
        return ConnectFour.placeStone(
            board,
            color,
            width,
            height,
            availableAction[Math.floor(Math.random() * availableAction.length)]
        );
    }
}
export default ConnectFourComputer;
