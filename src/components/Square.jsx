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
    if (selected.current) {

      const moves = chess.current.moves({
        square: selected.current,
        verbose: true,
      });
      const move = moves.find(m => m.to === data.square);

      if (!move) {
        console.log("invalid move")
        return
      }

      chess.current.move({
        from: selected.current,
        to: data.square,
        promotion: "q",
      });

      const from = selected.current;
      const to = data.square;


      const pieceEl = pieceRefs.current[from];
      if (!pieceEl) return;

      const position = squareToPos(to)

      gsap.to(pieceEl, {
        x: position.x,
        y: position.y,
        duration: 0.25,
        ease: "power2.out",
        onComplete: () => {

          // 1️⃣ update pieces
          setpiece(prev =>
            prev
              .filter(p => p.square !== to) // capture
              .map(p =>
                p.square === from ? { ...p, square: to } : p
              )
          );

          // 2️⃣ update board LAST-MOVE FLAGS
          setboard(prev =>
            prev.map(sq => ({
              ...sq,
              isValid: false,
              isSelected: false,
              isCapture: false,
              isLastFrom: sq.square === from,
              isLastTo: sq.square === to,
            }))
          );

          // 3️⃣ clear selection (AFTER board update)
          selected.current = null;
        },
      });

      console.log(move)

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
