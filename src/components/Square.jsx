import { useRef } from "react";
import gsap from "gsap";

const BOARD_SIZE = 600;
const SQUARE_SIZE = BOARD_SIZE / 8;
const FILES = "abcdefgh";


const Square = ({ data, setboard, setpiece, selected, chess, player, pieceRefs }) => {

  const squareToPos = (data) => {
    const file = data[0];
    const rank = Number(data[1]);

    const x =
      player === "white"
        ? FILES.indexOf(file) * SQUARE_SIZE
        : (7 - FILES.indexOf(file)) * SQUARE_SIZE;

    const y =
      player === "white"
        ? (8 - rank) * SQUARE_SIZE
        : (rank - 1) * SQUARE_SIZE;

    return { x, y };
  }



  const handleClick = () => {
    if (!selected.current) return;

    const from = selected.current;
    const to = data.square;

    const moves = chess.current.moves({
      square: from,
      verbose: true,
    });

    const move = moves.find(m => m.to === to);
    if (!move) return;

    // 🔥 execute move
    const executedMove = chess.current.move({
      from,
      to,
      promotion: "q",
    });

    const movingEl = pieceRefs.current[from];
    if (!movingEl) return;

    const position = squareToPos(to);

    // 🔥 Detect special cases
    const isEnPassant = executedMove.flags.includes("e");
    const isKingSideCastle = executedMove.flags.includes("k");
    const isQueenSideCastle = executedMove.flags.includes("q");

    let rookFrom = null;
    let rookTo = null;

    if (isKingSideCastle) {
      rookFrom = executedMove.color === "w" ? "h1" : "h8";
      rookTo = executedMove.color === "w" ? "f1" : "f8";
    }

    if (isQueenSideCastle) {
      rookFrom = executedMove.color === "w" ? "a1" : "a8";
      rookTo = executedMove.color === "w" ? "d1" : "d8";
    }

    const tl = gsap.timeline({
      onComplete: () => {

        setpiece(prev => {

          let next = prev;

          // 🧨 EN PASSANT removal
          if (isEnPassant) {
            const file = to[0];
            const rank = parseInt(to[1]);

            const capturedSquare =
              executedMove.color === "w"
                ? `${file}${rank - 1}`
                : `${file}${rank + 1}`;

            next = next.filter(p => p.square !== capturedSquare);
          }
          else {
            // normal capture
            next = next.filter(p => p.square !== to);
          }

          // move piece
          next = next.map(p =>
            p.square === from
              ? { ...p, square: to }
              : p
          );

          // 🏰 update rook in state if castling
          if (rookFrom && rookTo) {
            next = next.map(p =>
              p.square === rookFrom
                ? { ...p, square: rookTo }
                : p
            );
          }

          return next;
        });

        // update board flags
        setboard(prev =>
          prev.map(sq => ({
            ...sq,
            isSelected: false,
            isValid: false,
            isCapture: false,
            isLastFrom: sq.square === from,
            isLastTo: sq.square === to,
          }))
        );

        selected.current = null;
      }
    });

    // ♟ animate moving piece
    tl.to(movingEl, {
      x: position.x,
      y: position.y,
      duration: 0.25,
      ease: "power2.out",
    });

    // 🏰 animate rook if castling
    if (rookFrom && rookTo) {
      const rookEl = pieceRefs.current[rookFrom];
      if (rookEl) {
        const rookPos = squareToPos(rookTo);
        tl.to(
          rookEl,
          {
            x: rookPos.x,
            y: rookPos.y,
            duration: 0.25,
            ease: "power2.out",
          },
          "<"
        );
      }
    }
  };







  // 🎨 background color priority
  let bgColor = "";

  // 🔴 HIGHEST priority: last move capture (TO square)
  if (data.isLastTo && data.isCapture) {
    bgColor = "bg-[#E5533D]";
  }
  // 🟨 last move FROM
  else if (data.isLastFrom) {
    bgColor = "bg-[#6B7280]";
  }
  // 🟨 last move TO (non-capture)
  else if (data.isLastTo) {
    bgColor = "bg-[#9AA5B1]";
  }
  // 🔴 capture hint (onPress)
  else if (data.isCapture) {
    bgColor = "bg-[#E5533D]";
  }
  // 🟦 selected square
  else if (data.isSelected) {
    bgColor = "bg-[#9CA3AF]";
  }
  // ⬛ dark square
  else if (data.color === "b") {
    bgColor = "bg-[#242733]";
  }
  // ⬜ light square
  else {
    bgColor = "bg-[#343849]";
  }

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-center justify-center
        w-[12.5%] aspect-square
    
        ${bgColor}
      `}
    >
      {/* 🟢 normal move indicator */}
      {data.isValid && !data.isCapture && (
        <div className="w-[22%] aspect-square rounded-full bg-[#9CA3AF] opacity-80" />
      )}
    </div>
  );
};

export default Square;
