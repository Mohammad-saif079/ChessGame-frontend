import {useState} from "react";
import Square from "./Square";

const Board = () => {
    const files = "abcdefgh";

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
                isValid: true,
                isCapture: false,
                isSelected: false,
                isLastMove: false,
            };
        });
    }

    const [board, setboard] = useState(createBoard)
    console.log(board)

    return (
        <div className="w-[600px] h-[600px] flex flex-wrap">
            {board.map(square => (
                <Square
                    key={square.id}
                    data={square}
                />
            ))}
        </div>
    );
};

export default Board;
