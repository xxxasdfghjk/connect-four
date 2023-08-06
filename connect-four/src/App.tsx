import { useRef, useState } from "react";
import "./App.css";
import ConnectFour, { Board, Empty, Red, Yellow } from "./lib/connectFour";
import { Button, Modal, ModalContent, ModalOverlay, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";
import ConnectFourComputer from "./lib/ConnectFourComputer";
type ConnectFourProps = {
    boardWidth: number;
    boardHeight: number;
};
type GameState = "Playing" | "BeforeStart" | "Finish";

const ConnectFourBoards = (props: ConnectFourProps) => {
    const [connectFourInstance] = useState(new ConnectFour(props.boardWidth, props.boardHeight));
    const [board, setBoard] = useState<Board>(
        new Array(props.boardHeight * props.boardWidth).fill(ConnectFour.Empty) as Array<Empty>
    );
    const [gameState, setGameState] = useState<GameState>("BeforeStart");
    const [targetCell, setTargetCell] = useState<{ x: number; y: number } | undefined>();
    const [gameMessage, setGameMessage] = useState<string>("Red Turn");
    const { isOpen: continueModalIsOpen, onOpen: continueModalOnOpen, onClose: continueModalOnClose } = useDisclosure();
    const {
        isOpen: orderSelectModalIsOpen,
        onOpen: orderSelectModalOnOpen,
        onClose: orderSelectModalOnClose,
    } = useDisclosure();
    const [cpuThinking, setCpuThinking] = useState<boolean>(false);

    const playerColorRef = useRef(-1);
    const [playerColor, setPlayerColor] = useState<Red | Yellow | -1>(-1);
    const initAndStartGame = () => {
        setGameState("Playing");
        connectFourInstance.initialize(props.boardWidth, props.boardHeight);
        setBoard(connectFourInstance.getBoard());
        setGameMessage(`${connectFourInstance.getTurnPlayer() === 1 ? "Yellow" : "Red"} Turn`);
    };

    const ContinueButton = (buttonMessage: string) => (
        <Button
            colorScheme="blue"
            mr={3}
            sx={{ height: "100px", width: "100%", margin: "0", fontSize: "40px" }}
            onClick={() => {
                continueModalOnClose();
                orderSelectModalOnOpen();
            }}
        >
            {buttonMessage}
        </Button>
    );
    const ContinueModal = (
        <Modal isOpen={continueModalIsOpen} onClose={continueModalOnClose}>
            <ModalOverlay />
            <ModalContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {ContinueButton(gameState === "BeforeStart" ? "Game Start!" : "Continue?")}
            </ModalContent>
        </Modal>
    );

    const placeCPU = () => {
        if (connectFourInstance.getTurnPlayer() === playerColorRef.current) {
            return;
        }
        setCpuThinking(true);
        setTimeout(() => {
            const nextPlace = ConnectFourComputer.calcNext(
                JSON.parse(JSON.stringify(connectFourInstance.getBoard())),
                playerColorRef.current === 1 ? 2 : 1,
                props.boardWidth,
                props.boardHeight
            );
            setCpuThinking(false);
            placeStone(nextPlace);
        }, 0);
    };
    const OrderSelectModal = (
        <Modal isOpen={orderSelectModalIsOpen} onClose={orderSelectModalOnClose}>
            <ModalOverlay />
            <ModalContent
                sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}
            >
                <Button
                    sx={{ height: "100px", width: "200px" }}
                    onClick={() => {
                        setPlayerColor(1);
                        playerColorRef.current = 1;
                        initAndStartGame();
                        orderSelectModalOnClose();
                    }}
                >
                    {"Play First"}
                </Button>
                <Button
                    sx={{ height: "100px", width: "200px" }}
                    onClick={() => {
                        setPlayerColor(2);
                        playerColorRef.current = 2;
                        initAndStartGame();
                        orderSelectModalOnClose();
                        placeCPU();
                    }}
                >
                    {"Play Draw"}
                </Button>
            </ModalContent>
        </Modal>
    );

    const toast = useToast();

    const placeStone = (x: number) => {
        const res = connectFourInstance.placeStone(connectFourInstance.getTurnPlayer(), x);
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
        setBoard(connectFourInstance.getBoard());
        setTargetCell(undefined);
        if (res === 1 || res === 2 || res === 3) {
            setGameState("Finish");
            setGameMessage(res === 1 ? "Won By Yellow !!" : res === 2 ? "Won By Red !!" : "Draw !!");
            continueModalOnOpen();
        } else {
            connectFourInstance.changeTurn();
            setGameMessage(`${connectFourInstance.getTurnPlayer() === 1 ? "Yellow" : "Red"} Turn`);
            placeCPU();
        }
    };
    const GameComponent = (
        <div>
            <div className="board">
                {board
                    .flatMap((_, i, a) => (i % props.boardWidth ? [] : [a.slice(i, i + props.boardWidth)]))
                    .reverse()
                    .map((e, y) => (
                        <div className="row" key={y}>
                            {e.map((ee, x) => (
                                <div
                                    key={x}
                                    className={`cell ${
                                        targetCell?.x === x && targetCell.y === y
                                            ? `target_cell_${
                                                  connectFourInstance.getTurnPlayer() === 2 ? "red" : "yellow"
                                              }`
                                            : ConnectFour.Empty === ee
                                            ? "empty"
                                            : ee === ConnectFour.Red
                                            ? "red"
                                            : "yellow"
                                    }`}
                                    onMouseEnter={() => {
                                        if (connectFourInstance.getTurnPlayer() !== playerColorRef.current) {
                                            return;
                                        }
                                        const y = [...board]
                                            .filter((_, i) => i % props.boardWidth === x)
                                            .findIndex((v) => v === ConnectFour.Empty);
                                        setTargetCell(
                                            y !== undefined ? { x, y: props.boardHeight - 1 - y } : undefined
                                        );
                                    }}
                                    onMouseLeave={() => {
                                        setTargetCell(undefined);
                                    }}
                                    onClick={() => {
                                        if (
                                            gameState !== "Playing" ||
                                            playerColorRef.current !== connectFourInstance.getTurnPlayer()
                                        ) {
                                            return;
                                        }
                                        placeStone(x);
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
                {cpuThinking && (
                    <>
                        <Text fontSize={"3xl"}>{"CPU thinking..."}</Text>
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="xl"
                        ></Spinner>
                    </>
                )}
            </div>
        </div>
    );

    return gameState === "BeforeStart" ? (
        <>
            <div className="start_button_wrapper">
                <Button
                    sx={{ height: "300px", width: "80%", fontSize: "50px" }}
                    onClick={() => {
                        orderSelectModalOnOpen();
                    }}
                >
                    {"Start Game!"}
                </Button>
            </div>
            {ContinueModal}
            {OrderSelectModal}
        </>
    ) : gameState === "Playing" ? (
        GameComponent
    ) : (
        <>
            {GameComponent}
            {ContinueButton("Continue")}
            {ContinueModal}
            {OrderSelectModal}
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
