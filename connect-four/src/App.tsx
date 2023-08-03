import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ConnectFour, { Empty, Red, Yellow } from "./lib/connectFour";
type ConnectFourProps = {
    boardWidth: number;
    boardHeight: number;
};
const ConnectFourBoards = (props: ConnectFourProps) => {
    const [connectFourInstance] = useState(new ConnectFour(10, 10));
    const [board, setBoard] = useState<Array<Array<Yellow | Empty | Red>>>(
        new Array(props.boardHeight).fill(new Array(props.boardWidth).fill(ConnectFour.Empty)) as Array<Array<Empty>>
    );

    return (
        <div>
            {new Array(props.boardWidth).fill(0).map((e, i) => (
                <input
                    type={"button"}
                    onClick={() => {
                        console.log(i);
                        connectFourInstance.placeStone(connectFourInstance.getTurnPlayer(), i);
                        setBoard(connectFourInstance.getBoard());
                    }}
                />
            ))}

            <div>
                {board.map((e) => [
                    <br />,
                    ...e.map((ee) => <span>{ee === ConnectFour.Empty ? 0 : ee === ConnectFour.Red ? "R" : "Y"}</span>),
                ])}
            </div>
        </div>
    );
};

function App() {
    return (
        <div className="App">
            <ConnectFourBoards boardWidth={10} boardHeight={10}></ConnectFourBoards>
        </div>
    );
}

export default App;
