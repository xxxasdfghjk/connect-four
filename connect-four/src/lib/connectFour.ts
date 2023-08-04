export type Yellow = 1;
export type Red = 2;
export type Empty = 0;
export type Draw = 3;
export type Unfinished = 4;
export type BoardCellStatus = Yellow | Red | Empty;
export type Winner = Yellow | Red | Draw;
export type Boards = Array<Array<Yellow | Red | Empty>>;
class ConnectFour {
    private boards: Array<Array<Yellow | Red | Empty>>;
    private boardWidth: number;
    private boardHeight: number;
    public static Yellow = 1 as const;
    public static Red = 2 as const;
    public static Empty = 0 as const;
    private turnPlayer: Yellow | Red;
    constructor(boardWidth: number, boardHeight: number) {
        this.boardHeight = boardHeight;
        this.boardWidth = boardWidth;
        this.boards = [[]];
        this.initialize(boardWidth, boardHeight);
        this.turnPlayer = ConnectFour.Red;
    }

    changeTurn() {
        if (this.turnPlayer === ConnectFour.Red) {
            this.turnPlayer = ConnectFour.Yellow;
        } else {
            this.turnPlayer = ConnectFour.Red;
        }
    }
    getTurnPlayer() {
        return this.turnPlayer;
    }

    public static isPlaceableStone(boards: Array<Array<Yellow | Red | Empty>>, x: number, boardWidth: number) {
        if (boardWidth === undefined) {
            return false;
        }
        if (boardWidth - 1 < x) {
            return false;
        }
        return boards.some((e) => e[x] === ConnectFour.Empty);
    }

    isPlaceableStone(x: number) {
        if (this?.boardWidth === undefined) {
            return false;
        }
        if (this.boardWidth - 1 < x) {
            return false;
        }
        return this.boards.some((e) => e[x] === ConnectFour.Empty);
    }

    initialize(boardWidth: number, boardHeight: number) {
        let array = new Array(boardHeight);
        for (let y = 0; y < boardHeight; y++) {
            array[y] = new Array(boardWidth).fill(ConnectFour.Empty);
        }
        this.boards = array;
        this.turnPlayer = ConnectFour.Red;
    }

    public static placeStone(
        boards: Array<Array<Yellow | Red | Empty>>,
        color: Exclude<BoardCellStatus, Empty>,
        boardWidth: number,
        boardHeight: number,
        x: number
    ) {
        if (ConnectFour.isPlaceableStone(boards, x, boardWidth)) {
            boards.find((e) => e[x] === ConnectFour.Empty)![x] = color;

            return ConnectFour.isFinish(boards, boardHeight, boardWidth);
        } else {
            return false;
        }
    }

    placeStone(color: Exclude<BoardCellStatus, Empty>, x: number): Winner | Unfinished | false {
        if (this.isPlaceableStone(x)) {
            this.boards.find((e) => e[x] === ConnectFour.Empty)![x] = color;
            return this.isFinish();
        } else {
            return false;
        }
    }
    getBoard() {
        return [...this.boards];
    }

    public static isFinish(boards: Array<Array<Yellow | Red | Empty>>, boardHeight: number, boardWidth: number) {
        if (boards.filter((e) => e.every((ee) => ee !== ConnectFour.Empty)).length === boardHeight) {
            return 3;
        }
        // 横方向を調べる
        for (let y = 0; y < boardHeight; y++) {
            for (let x = 0; x < boardWidth - 3; x++) {
                if (
                    boards[y][x] === boards[y][x + 1] &&
                    boards[y][x + 1] === boards[y][x + 2] &&
                    boards[y][x + 2] === boards[y][x + 3] &&
                    boards[y][x] !== ConnectFour.Empty
                ) {
                    return boards[y][x] as Red | Yellow;
                }
            }
        }

        //  縦方向を調べる
        for (let y = 0; y < boardHeight - 3; y++) {
            for (let x = 0; x < boardWidth; x++) {
                if (
                    boards[y][x] === boards[y + 1][x] &&
                    boards[y + 1][x] === boards[y + 2][x] &&
                    boards[y + 2][x] === boards[y + 3][x] &&
                    boards[y][x] !== ConnectFour.Empty
                ) {
                    return boards[y][x] as Red | Yellow;
                }
            }
        }

        //  右斜上方向を調べる
        for (let y = 0; y < boardHeight - 3; y++) {
            for (let x = 0; x < boardWidth - 3; x++) {
                if (
                    boards[y][x] === boards[y + 1][x + 1] &&
                    boards[y + 1][x + 1] === boards[y + 2][x + 2] &&
                    boards[y + 2][x + 2] === boards[y + 3][x + 3] &&
                    boards[y][x] !== ConnectFour.Empty
                ) {
                    return boards[y][x] as Red | Yellow;
                }
            }
        }

        //  左斜上方向を調べる
        for (let y = 0; y < boardHeight - 3; y++) {
            for (let x = 4; x < boardWidth; x++) {
                if (
                    boards[y][x] === boards[y + 1][x - 1] &&
                    boards[y + 1][x - 1] === boards[y + 2][x - 2] &&
                    boards[y + 2][x - 2] === boards[y + 3][x - 3] &&
                    boards[y][x] !== ConnectFour.Empty
                ) {
                    return boards[y][x] as Red | Yellow;
                }
            }
        }
        return 4;
    }

    isFinish(): Winner | Unfinished {
        if (this.boards.filter((e) => e.every((ee) => ee !== ConnectFour.Empty)).length === this.boardHeight) {
            return 3;
        }
        // 横方向を調べる
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth - 3; x++) {
                if (
                    this.boards[y][x] === this.boards[y][x + 1] &&
                    this.boards[y][x + 1] === this.boards[y][x + 2] &&
                    this.boards[y][x + 2] === this.boards[y][x + 3] &&
                    this.boards[y][x] !== ConnectFour.Empty
                ) {
                    return this.boards[y][x] as Red | Yellow;
                }
            }
        }

        //  縦方向を調べる
        for (let y = 0; y < this.boardHeight - 3; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (
                    this.boards[y][x] === this.boards[y + 1][x] &&
                    this.boards[y + 1][x] === this.boards[y + 2][x] &&
                    this.boards[y + 2][x] === this.boards[y + 3][x] &&
                    this.boards[y][x] !== ConnectFour.Empty
                ) {
                    return this.boards[y][x] as Red | Yellow;
                }
            }
        }

        //  右斜上方向を調べる
        for (let y = 0; y < this.boardHeight - 3; y++) {
            for (let x = 0; x < this.boardWidth - 3; x++) {
                if (
                    this.boards[y][x] === this.boards[y + 1][x + 1] &&
                    this.boards[y + 1][x + 1] === this.boards[y + 2][x + 2] &&
                    this.boards[y + 2][x + 2] === this.boards[y + 3][x + 3] &&
                    this.boards[y][x] !== ConnectFour.Empty
                ) {
                    return this.boards[y][x] as Red | Yellow;
                }
            }
        }

        //  左斜上方向を調べる
        for (let y = 0; y < this.boardHeight - 3; y++) {
            for (let x = 4; x < this.boardWidth; x++) {
                if (
                    this.boards[y][x] === this.boards[y + 1][x - 1] &&
                    this.boards[y + 1][x - 1] === this.boards[y + 2][x - 2] &&
                    this.boards[y + 2][x - 2] === this.boards[y + 3][x - 3] &&
                    this.boards[y][x] !== ConnectFour.Empty
                ) {
                    return this.boards[y][x] as Red | Yellow;
                }
            }
        }
        return 4;
    }
    printBoard() {
        [...this.boards].reverse().forEach((e: Array<Yellow | Empty | Red>) => console.log(e.join(" ")));
        console.log(this.boards);
    }

    availableActions() {
        return Array(this.boardWidth)
            .fill(0)
            .map((_, i) => i)
            .map((x) => this.isPlaceableStone(x))
            .reduce<number[]>((prev, cur, index) => (cur ? [...prev, index] : prev), []);
    }

    public static availableActions(boards: Array<Array<Yellow | Red | Empty>>, width: number) {
        return Array(width)
            .fill(0)
            .map((_, i) => i)
            .map((x) => boards.some((e) => e[x] === ConnectFour.Empty))
            .reduce<number[]>((prev, cur, index) => (cur ? [...prev, index] : prev), []);
    }

    public static isWinable(
        boards: Array<Array<Yellow | Red | Empty>>,
        color: Yellow | Red,
        width: number,
        height: number
    ) {
        const placeable = ConnectFour.availableActions(boards, width);
        for (const cur of placeable) {
            const copy = JSON.parse(JSON.stringify(boards));
            const res = ConnectFour.placeStone(copy, color, width, height, cur);
            if (res === color) {
                return true;
            }
        }
        return false;
    }
}

export default ConnectFour;
