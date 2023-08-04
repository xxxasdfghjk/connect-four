import ConnectFour, { Yellow, Red, Empty, Boards } from "./connectFour";

class ConnectFourComputer {
    private static examNum = 2000;
    public static calcNext(board: Boards, myColor: Yellow | Red, width: number, height: number) {
        const actions = ConnectFour.availableActions(board, width);
        const rate = actions.reduce<{ [key: number]: number }>((prev, cur) => ({ ...prev, [cur]: 0 }), {});
        const opponentColor = myColor === 1 ? 2 : 1;
        for (const cur of actions) {
            for (let i = 0; i < ConnectFourComputer.examNum; i++) {
                let examBoard = JSON.parse(JSON.stringify(board));
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
                    if (oppoPlace === opponentColor) {
                        rate[cur] -= 1;
                        break;
                    }
                    if (oppoPlace === 3) {
                        rate[cur] += 0.1;
                        break;
                    }
                    if (ConnectFour.isWinable(examBoard, myColor, width, height)) {
                        rate[cur] += 1;
                        break;
                    }
                    const myPlace = ConnectFourComputer.randomPut(examBoard, myColor, width, height);
                    if (myPlace === myColor) {
                        rate[cur] += 1;
                        break;
                    }
                    if (myPlace === 3) {
                        rate[cur] += 0.1;
                        break;
                    }
                }
            }
        }
        return parseInt(Object.entries(rate).sort(([_a1, a2], [_b1, b2]) => b2 - a2)[0][0], 10);
    }

    public static randomPut(board: Boards, color: Yellow | Red, width: number, height: number) {
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
