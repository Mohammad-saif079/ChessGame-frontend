import React from 'react'

const Piece = (props) => {
    const files = "abcdefgh";
    function squareToPosition(square,player) {
        const file = square[0]; // "e"
        const rank = square[1]; // "4"
        let x,y;
        if (player === "white") {
            x = files.indexOf(file) * (600/8);
            y = (8 - rank) * (600/8);
        } else {
            x = (7 - files.indexOf(file)) * (600/8);
            y = (rank - 1) * (600/8);
        }

        return { x, y };
    }
    const { color, type, square } = props.piece

    const position = squareToPosition(square,props.player)


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
        <div style={{
            width: "12.5%",
            height: "12.5%",
            transform: `translate(${position.x}px, ${position.y}px)`,
        }} className={` text-7xl absolute  text-white `} >{PIECE_UNICODE[color][type]}</div>
    )
}

export default Piece