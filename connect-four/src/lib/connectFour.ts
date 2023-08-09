export type Yellow = 1;
export type Red = 2;
export type Empty = 0;
export type Draw = 3;
export type Unfinished = 4;
export type BoardCellStatus = Yellow | Red | Empty;
export type Winner = Yellow | Red | Draw;
/**
 * 左上から
 *  [(0,0),(1,0),(2,0),(3,0),(4,0)..(boardWidth-1,0),(0,1),(0,2)..(boardWidth-1,boardHeight-1)]
 * -> [0,1,2,3..(boardWidth-1),(boardWidth-1+1)..(boardWidth*boardHeight-1]
 * (x,y) -> [x + y*boardWidth]
 *  */
export type Board = Array<Yellow | Red | Empty>;
class ConnectFour {
    private boards: Board;
    private boardWidth: number;
    private boardHeight: number;
    public static Yellow = 1 as const;
    public static Red = 2 as const;
    public static Empty = 0 as const;
    private turnPlayer: Yellow | Red;
    constructor(boardWidth: number, boardHeight: number) {
        this.boardHeight = boardHeight;
        this.boardWidth = boardWidth;
        this.boards = [];
        this.initialize(boardWidth, boardHeight);
        this.turnPlayer = ConnectFour.Yellow;
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

    public static isPlaceableStone(boards: Board, x: number, boardWidth: number) {
        if (boardWidth === undefined) {
            return false;
        }
        if (boardWidth - 1 < x) {
            return false;
        }
        return boards.filter((_, i) => i % boardWidth === x).some((e) => e === ConnectFour.Empty);
    }

    isPlaceableStone(x: number) {
        if (this?.boardWidth === undefined) {
            return false;
        }
        if (this.boardWidth - 1 < x) {
            return false;
        }
        return this.boards.filter((_, i) => i % this.boardWidth === x).some((e) => e === ConnectFour.Empty);
    }

    initialize(boardWidth: number, boardHeight: number) {
        this.boards = new Array(boardHeight * boardWidth).fill(ConnectFour.Empty);
        this.turnPlayer = ConnectFour.Yellow;
    }

    public static placeStone(
        boards: Board,
        color: Exclude<BoardCellStatus, Empty>,
        boardWidth: number,
        boardHeight: number,
        x: number
    ) {
        if (ConnectFour.isPlaceableStone(boards, x, boardWidth)) {
            boards[boards.findIndex((e, i) => i % boardWidth === x && e === ConnectFour.Empty)!] = color;

            return ConnectFour.isFinish(boards, boardHeight, boardWidth);
        } else {
            return false;
        }
    }

    placeStone(color: Exclude<BoardCellStatus, Empty>, x: number): Winner | Unfinished | false {
        if (this.isPlaceableStone(x)) {
            this.boards[this.boards.findIndex((e, i) => i % this.boardWidth === x && e === ConnectFour.Empty)!] = color;
            return this.isFinish();
        } else {
            return false;
        }
    }
    getBoard() {
        return [...this.boards];
    }

    public static isFinish(boards: Board, boardHeight: number, boardWidth: number) {
        if (boards.filter((e) => e === ConnectFour.Empty).length === 0) {
            return 3;
        }
        // 横方向を調べる
        for (let y = 0; y < boardHeight; y++) {
            for (let x = 0; x < boardWidth - 3; x++) {
                if (
                    boards[y * boardWidth + x] === boards[y * boardWidth + x + 1] &&
                    boards[y * boardWidth + x + 1] === boards[y * boardWidth + x + 2] &&
                    boards[y * boardWidth + x + 2] === boards[y * boardWidth + x + 3] &&
                    boards[y * boardWidth + x] !== ConnectFour.Empty
                ) {
                    return boards[y * boardWidth + x] as Red | Yellow;
                }
            }
        }

        //  縦方向を調べる
        for (let y = 0; y < boardHeight - 3; y++) {
            for (let x = 0; x < boardWidth; x++) {
                if (
                    boards[y * boardWidth + x] === boards[(y + 1) * boardWidth + x] &&
                    boards[(y + 1) * boardWidth + x] === boards[(y + 2) * boardWidth + x] &&
                    boards[(y + 2) * boardWidth + x] === boards[(y + 3) * boardWidth + x] &&
                    boards[y * boardWidth + x] !== ConnectFour.Empty
                ) {
                    return boards[y * boardWidth + x] as Red | Yellow;
                }
            }
        }

        //  右斜上方向を調べる
        for (let y = 0; y < boardHeight - 3; y++) {
            for (let x = 0; x < boardWidth - 3; x++) {
                if (
                    boards[y * boardWidth + x] === boards[(y + 1) * boardWidth + x + 1] &&
                    boards[(y + 1) * boardWidth + x + 1] === boards[(y + 2) * boardWidth + x + 2] &&
                    boards[(y + 2) * boardWidth + x + 2] === boards[(y + 3) * boardWidth + x + 3] &&
                    boards[y * boardWidth + x] !== ConnectFour.Empty
                ) {
                    return boards[y * boardWidth + x] as Red | Yellow;
                }
            }
        }

        //  左斜上方向を調べる
        for (let y = 0; y < boardHeight - 3; y++) {
            for (let x = 4; x < boardWidth; x++) {
                if (
                    boards[y * boardWidth + x] === boards[(y + 1) * boardWidth + x - 1] &&
                    boards[(y + 1) * boardWidth + x - 1] === boards[(y + 2) * boardWidth + x - 2] &&
                    boards[(y + 2) * boardWidth + x - 2] === boards[(y + 3) * boardWidth + x - 3] &&
                    boards[y * boardWidth + x] !== ConnectFour.Empty
                ) {
                    return boards[y * boardWidth + x] as Red | Yellow;
                }
            }
        }
        return 4;
    }

    isFinish(): Winner | Unfinished {
        if (this.boards.filter((e) => e === ConnectFour.Empty).length === 0) {
            return 3;
        }
        // 横方向を調べる
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth - 3; x++) {
                if (
                    this.boards[y * this.boardWidth + x] === this.boards[y * this.boardWidth + x + 1] &&
                    this.boards[y * this.boardWidth + x + 1] === this.boards[y * this.boardWidth + x + 2] &&
                    this.boards[y * this.boardWidth + x + 2] === this.boards[y * this.boardWidth + x + 3] &&
                    this.boards[y * this.boardWidth + x] !== ConnectFour.Empty
                ) {
                    return this.boards[y * this.boardWidth + x] as Red | Yellow;
                }
            }
        }

        //  縦方向を調べる
        for (let y = 0; y < this.boardHeight - 3; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (
                    this.boards[y * this.boardWidth + x] === this.boards[(y + 1) * this.boardWidth + x] &&
                    this.boards[(y + 1) * this.boardWidth + x] === this.boards[(y + 2) * this.boardWidth + x] &&
                    this.boards[(y + 2) * this.boardWidth + x] === this.boards[(y + 3) * this.boardWidth + x] &&
                    this.boards[y * this.boardWidth + x] !== ConnectFour.Empty
                ) {
                    return this.boards[y * this.boardWidth + x] as Red | Yellow;
                }
            }
        }

        //  右斜上方向を調べる
        for (let y = 0; y < this.boardHeight - 3; y++) {
            for (let x = 0; x < this.boardWidth - 3; x++) {
                if (
                    this.boards[y * this.boardWidth + x] === this.boards[(y + 1) * this.boardWidth + x + 1] &&
                    this.boards[(y + 1) * this.boardWidth + x + 1] === this.boards[(y + 2) * this.boardWidth + x + 2] &&
                    this.boards[(y + 2) * this.boardWidth + x + 2] === this.boards[(y + 3) * this.boardWidth + x + 3] &&
                    this.boards[y * this.boardWidth + x] !== ConnectFour.Empty
                ) {
                    return this.boards[y * this.boardWidth + x] as Red | Yellow;
                }
            }
        }

        //  左斜上方向を調べる
        for (let y = 0; y < this.boardHeight - 3; y++) {
            for (let x = 4; x < this.boardWidth; x++) {
                if (
                    this.boards[y * this.boardWidth + x] === this.boards[(y + 1) * this.boardWidth + x - 1] &&
                    this.boards[(y + 1) * this.boardWidth + x - 1] === this.boards[(y + 2) * this.boardWidth + x - 2] &&
                    this.boards[(y + 2) * this.boardWidth + x - 2] === this.boards[(y + 3) * this.boardWidth + x - 3] &&
                    this.boards[y * this.boardWidth + x] !== ConnectFour.Empty
                ) {
                    return this.boards[y * this.boardWidth + x] as Red | Yellow;
                }
            }
        }
        return 4;
    }
    printBoard() {
        [...this.boards]
            .flatMap((_, i, a) => (i % this.boardWidth ? [] : [a.slice(i, i + this.boardWidth)]))
            .reverse()
            .forEach((e: Board) => console.log(e));
        console.log(this.boards);
    }

    availableActions() {
        return Array(this.boardWidth)
            .fill(0)
            .map((_, i) => i)
            .map((x) => this.isPlaceableStone(x))
            .reduce<number[]>((prev, cur, index) => (cur ? [...prev, index] : prev), []);
    }

    public static availableActions(boards: Board, width: number) {
        return Array(width)
            .fill(0)
            .map((_, i) => i)
            .map((x) => ConnectFour.isPlaceableStone(boards, x, width))
            .reduce<number[]>((prev, cur, index) => (cur ? [...prev, index] : prev), []);
    }

    public static isWinable(boards: Board, color: Yellow | Red, width: number, height: number) {
        const placeable = ConnectFour.availableActions(boards, width);
        for (const cur of placeable) {
            const copy = [...boards];
            const res = ConnectFour.placeStone(copy, color, width, height, cur);
            if (res === color) {
                return true;
            }
        }
        return false;
    }
    public static printBoard(board: Board, width: number, height: number) {
        console.log("======");

        board
            .flatMap((v, i) => (i % width === 0 ? [board.slice(i, i + width)] : []))
            .reverse()
            .forEach((e) => console.log(e));
        console.log("======");
    }
}

export default ConnectFour;
