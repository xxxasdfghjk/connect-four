import { useState } from "react";
import "./App.css";
import ConnectFour, { Empty, Red, Yellow } from "./lib/connectFour";
import { Button, Modal, ModalContent, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react";
type ConnectFourProps = {
    boardWidth: number;
    boardHeight: number;
};
type GameState = "Playing" | "BeforeStart" | "Finish";

const ConnectFourBoards = (props: ConnectFourProps) => {
    const [connectFourInstance] = useState(new ConnectFour(props.boardWidth, props.boardHeight));
    const [board, setBoard] = useState<Array<Array<Yellow | Empty | Red>>>(
        new Array(props.boardHeight).fill(new Array(props.boardWidth).fill(ConnectFour.Empty)) as Array<Array<Empty>>
    );
    const [gameState, setGameState] = useState<GameState>("BeforeStart");
    const [targetCell, setTargetCell] = useState<{ x: number; y: number } | undefined>();
    const [gameMessage, setGameMessage] = useState<string>();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const ContinueButton = (
        <Button
            colorScheme="blue"
            mr={3}
            sx={{ height: "100px", width: "100%", margin: "0", fontSize: "40px" }}
            onClick={() => {
                setGameState("Playing");
                connectFourInstance.initialize(props.boardWidth, props.boardHeight);
                setBoard(connectFourInstance.getBoard());
                setGameMessage(`${connectFourInstance.getTurnPlayer() === 1 ? "Yellow" : "Red"} Turn`);

                onClose();
            }}
        >
            {" "}
            Continue?
        </Button>
    );
    const ContinueModal = (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {ContinueButton}
            </ModalContent>
        </Modal>
    );
    const toast = useToast();
    const GameComponent = (
        <div>
            <div className="board">
                {board.map((e, y) => (
                    <div className="row">
                        {e.map((ee, x) => (
                            <div
                                className={`cell ${
                                    targetCell?.x === x && targetCell.y === y
                                        ? "target_cell"
                                        : ConnectFour.Empty === ee
                                        ? "empty"
                                        : ee === ConnectFour.Red
                                        ? "red"
                                        : "yellow"
                                }`}
                                onMouseEnter={() => {
                                    const y = [...board].reverse().findIndex((row) => row[x] === ConnectFour.Empty);
                                    setTargetCell(y !== undefined ? { x, y: props.boardHeight - 1 - y } : undefined);
                                }}
                                onMouseLeave={() => {
                                    setTargetCell(undefined);
                                }}
                                onClick={() => {
                                    if (gameState !== "Playing") {
                                        return;
                                    }
                                    const res = connectFourInstance.placeStone(connectFourInstance.getTurnPlayer(), x);
                                    connectFourInstance.printBoard();
                                    if (res === false) {
                                        toast({
                                            title: "Invaild Action",
                                            description: "Please place valiable space.",
                                            status: "error",
                                            duration: 1000,
                                            isClosable: true,
                                        });
                                        return;
                                    }
                                    setBoard(connectFourInstance.getBoard().reverse());
                                    setTargetCell(undefined);

                                    if (res === 2) {
                                        setGameState("Finish");
                                        setGameMessage("Won By Red !");
                                        onOpen();
                                    } else if (res === 1) {
                                        setGameState("Finish");
                                        setGameMessage("Won By Yellow !");
                                        onOpen();
                                    } else if (res === 3) {
                                        setGameState("Finish");
                                        setGameMessage("Draw !");
                                        onOpen();
                                    } else {
                                        connectFourInstance.changeTurn();
                                        setGameMessage(
                                            `${connectFourInstance.getTurnPlayer() === 1 ? "Yellow" : "Red"} Turn`
                                        );
                                    }
                                }}
                            >
                                <div className="cell_content"></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="text_content">
                <Text fontSize={"3xl"}>{gameMessage}</Text>
            </div>
        </div>
    );

    return gameState === "BeforeStart" ? (
        <div>
            <Button onClick={() => setGameState("Playing")}>{"Start Game!"}</Button>
        </div>
    ) : gameState === "Playing" ? (
        GameComponent
    ) : (
        <>
            {GameComponent}
            {ContinueButton}
            {ContinueModal}
        </>
    );
};

type ContinueModalProps = { open: boolean };

function App() {
    return (
        <div className="App">
            <ConnectFourBoards boardWidth={7} boardHeight={6}></ConnectFourBoards>
        </div>
    );
}

export default App;
