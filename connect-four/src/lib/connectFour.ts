export type Yellow = 1;
export type Red = 2;
export type Empty = 0;
export type BoardCellStatus = Yellow | Red | Empty;
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

    isPlaceableStone(x: number) {
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

    placeStone(color: Exclude<BoardCellStatus, Empty>, x: number) {
        if (this.isPlaceableStone(x)) {
            this.boards.find((e) => e[x] === ConnectFour.Empty)![x] = color;
            return true;
        } else {
            return false;
        }
    }
    getBoard() {
        return [...this.boards];
    }

    isFinish(): Red | Yellow | false {
        // 横方向を調べる
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth - 4; x++) {
                if (
                    this.boards[y][x] === this.boards[y][x + 1] &&
                    this.boards[y][x + 1] === this.boards[y][x + 2] &&
                    this.boards[y][x + 2] === this.boards[y][x + 3] &&
                    this.boards[y][x + 3] === this.boards[y][x + 4] &&
                    this.boards[y][x] !== ConnectFour.Empty
                ) {
                    return this.boards[y][x] as Red | Yellow;
                }
            }
        }

        //  縦方向を調べる
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth - 4; x++) {
                if (
                    this.boards[y][x] === this.boards[y + 1][x] &&
                    this.boards[y + 1][x] === this.boards[y + 2][x] &&
                    this.boards[y + 2][x] === this.boards[y + 3][x] &&
                    this.boards[y + 3][x] === this.boards[y + 4][x] &&
                    this.boards[y][x] !== ConnectFour.Empty
                ) {
                    return this.boards[y][x] as Red | Yellow;
                }
            }
        }

        //  右斜上方向を調べる
        for (let y = 0; y < this.boardHeight - 4; y++) {
            for (let x = 0; x < this.boardWidth - 4; x++) {
                if (
                    this.boards[y][x] === this.boards[y + 1][x + 1] &&
                    this.boards[y + 1][x + 1] === this.boards[y + 2][x + 2] &&
                    this.boards[y + 2][x + 2] === this.boards[y + 3][x + 3] &&
                    this.boards[y + 3][x + 3] === this.boards[y + 4][x + 4] &&
                    this.boards[y][x] !== ConnectFour.Empty
                ) {
                    return this.boards[y][x] as Red | Yellow;
                }
            }
        }

        //  左斜上方向を調べる
        for (let y = 0; y < this.boardHeight - 4; y++) {
            for (let x = 4; x < this.boardWidth; x++) {
                if (
                    this.boards[y][x] === this.boards[y + 1][x - 1] &&
                    this.boards[y + 1][x - 1] === this.boards[y + 2][x - 2] &&
                    this.boards[y + 2][x - 2] === this.boards[y + 3][x - 3] &&
                    this.boards[y + 3][x - 3] === this.boards[y + 4][x - 4] &&
                    this.boards[y][x] !== ConnectFour.Empty
                ) {
                    return this.boards[y][x] as Red | Yellow;
                }
            }
        }
        return false;
    }
    printBoard() {
        [...this.boards].reverse().forEach((e: Array<Yellow | Empty | Red>) => console.log(e.join(" ")));
        console.log(this.boards);
    }
}

export default ConnectFour;
