import { useRef, useEffect, useState } from 'react'
import Draggable from 'gsap/Draggable';
import gsap from 'gsap';

gsap.registerPlugin(Draggable)


const Piece = (props) => {


    const boxRef = useRef(null);

    useEffect(() => {
        // if (!props.boundsRef?.current) return;

        const draggable = Draggable.create(boxRef.current, {
            type: "x,y",
            bounds: props.boundsRef.current,
            inertia: false,
            cursor: "grab",
            activeCursor: "grabbing",
            onPress: () => {

                const chess = props.chess.current

                const moves = chess.moves({
                    square: props.piece.square,
                    verbose: true,
                });

                const validSquares = moves.map(m => m.to);
                console.log(validSquares)

                props.setboard(prev =>
                    prev.map(sq => ({
                        ...sq,
                        isSelected: sq.square === props.piece.square,
                        isValid: validSquares.includes(sq.square),
                    }))
                );




                // console.log("piece clicked", props.piece.square)
            }
        });

        return () => draggable[0].kill();
    }, [props.boundsRef]);


    const files = "abcdefgh";
    function squareToPosition(square, player) {
        const file = square[0]; // "e"
        const rank = square[1]; // "4"
        let x, y;
        if (player === "white") {
            x = files.indexOf(file) * (600 / 8);
            y = (8 - rank) * (600 / 8);
        } else {
            x = (7 - files.indexOf(file)) * (600 / 8);
            y = (rank - 1) * (600 / 8);
        }

        return { x, y };
    }
    const { color, type, square } = props.piece

    const position = squareToPosition(square, props.player)


    const PIECE_UNICODE = {
        w: {
            p: "♙",
            r: "♖",
            n: "♘",
            b: "♗",
            q: "♕",
            k: "♔",
        },
        b: {
            p: "♟",
            r: "♜",
            n: "♞",
            b: "♝",
            q: "♛",
            k: "♚",
        },
    };
    return (
        <div ref={boxRef} style={{
            width: "12.5%",
            height: "12.5%",
            transform: `translate(${position.x}px, ${position.y}px)`,
        }} className={`pieces text-7xl absolute  text-white `} >{PIECE_UNICODE[color][type]}</div>
    )
}

export default Piece