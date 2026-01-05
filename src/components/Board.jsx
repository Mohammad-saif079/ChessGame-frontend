import { useState,useEffect } from "react";
import Square from "./Square";
import Piece from "./Piece";

const Board = (props) => {
    const files = "abcdefgh";




    const chesspieces = [
        // -------- BLACK PIECES --------
        { id: 1, type: "r", color: "b", square: "a8" },
        { id: 2, type: "n", color: "b", square: "b8" },
        { id: 3, type: "b", color: "b", square: "c8" },
        { id: 4, type: "q", color: "b", square: "d8" },
        { id: 5, type: "k", color: "b", square: "e8" },
        { id: 6, type: "b", color: "b", square: "f8" },
        { id: 7, type: "n", color: "b", square: "g8" },
        { id: 8, type: "r", color: "b", square: "h8" },

        { id: 9, type: "p", color: "b", square: "a7" },
        { id: 10, type: "p", color: "b", square: "b7" },
        { id: 11, type: "p", color: "b", square: "c7" },
        { id: 12, type: "p", color: "b", square: "d7" },
        { id: 13, type: "p", color: "b", square: "e7" },
        { id: 14, type: "p", color: "b", square: "f7" },
        { id: 15, type: "p", color: "b", square: "g7" },
        { id: 16, type: "p", color: "b", square: "h7" },

        // -------- WHITE PIECES --------
        { id: 17, type: "p", color: "w", square: "a2" },
        { id: 18, type: "p", color: "w", square: "b2" },
        { id: 19, type: "p", color: "w", square: "c2" },
        { id: 20, type: "p", color: "w", square: "d2" },
        { id: 21, type: "p", color: "w", square: "e2" },
        { id: 22, type: "p", color: "w", square: "f2" },
        { id: 23, type: "p", color: "w", square: "g2" },
        { id: 24, type: "p", color: "w", square: "h2" },

        { id: 25, type: "r", color: "w", square: "a1" },
        { id: 26, type: "n", color: "w", square: "b1" },
        { id: 27, type: "b", color: "w", square: "c1" },
        { id: 28, type: "q", color: "w", square: "d1" },
        { id: 29, type: "k", color: "w", square: "e1" },
        { id: 30, type: "b", color: "w", square: "f1" },
        { id: 31, type: "n", color: "w", square: "g1" },
        { id: 32, type: "r", color: "w", square: "h1" },
    ];




    function createBoard() {
        return Array.from({ length: 64 }).map((_, index) => {
            const row = Math.floor(index / 8);
            const col = index % 8;

            const square = files[col] + (8 - row);
            const color = (row + col) % 2 === 1 ? "b" : "w";

            return {
                id: index,
                square,
                color,
                piece: null,
                isValid: false,
                isCapture: false,
                isSelected: false,
                isLastMove: false,
            };
        });
    }



    const [board, setBoard] = useState(createBoard)
    const [pieces, setpieces] = useState(chesspieces)
    
   

    return (
        <div className="w-[600px] h-[600px] relative flex flex-wrap">
            {board.map(square => (
                <Square
                    key={square.id}
                    data={square}

                />
            ))}

            {pieces.map(piece => (
                <Piece
                    key={piece.id}
                    piece={piece}
                    player={props.player}

                />
            ))}




        </div>
    );
};

export default Board;
