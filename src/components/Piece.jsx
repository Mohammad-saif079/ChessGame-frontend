import { useRef, useEffect, useLayoutEffect, useMemo } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const BOARD_SIZE = 600;
const SQUARE_SIZE = BOARD_SIZE / 8;
const FILES = "abcdefgh";

const Piece = ({ piece, setRef, selected, player, boundsRef, chess, setboard, setpiece, setselected }) => {
    const boxRef = useRef(null);

    // refs to avoid stale closures
    const squareRef = useRef(piece.square);
    const startPosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        squareRef.current = piece.square;
    }, [piece.square]);

    useEffect(() => {
        setRef?.(boxRef.current);
    }, [setRef]);


    // 🔑 compute position BEFORE paint
    const initialPos = useMemo(() => {
        const file = piece.square[0];
        const rank = Number(piece.square[1]);

        const x =
            player === "white"
                ? FILES.indexOf(file) * SQUARE_SIZE
                : (7 - FILES.indexOf(file)) * SQUARE_SIZE;

        const y =
            player === "white"
                ? (8 - rank) * SQUARE_SIZE
                : (rank - 1) * SQUARE_SIZE;

        return { x, y };
    }, [piece.square, player]);

    // sync GSAP before paint (no blink)
    useLayoutEffect(() => {
        if (!boxRef.current) return;
        gsap.set(boxRef.current, initialPos);
    }, [initialPos]);

    // Draggable (created once)
    useEffect(() => {
        if (!boxRef.current || !boundsRef?.current) return;

        const draggable = Draggable.create(boxRef.current, {
            type: "x,y",
            bounds: boundsRef.current,
            inertia: false,
            cursor: "grab",
            activeCursor: "grabbing",

            onPress() {
                const currentSquare = squareRef.current;

                // ✅ ALWAYS save start position FIRST (prevents 0,0 bug)
                startPosRef.current = { x: this.x, y: this.y };

                // 🔁 RE-CLICK SAME PIECE → TOGGLE OFF
                if (selected.current === currentSquare) {
                    selected.current = null;

                    setboard(prev =>
                        prev.map(sq => ({
                            ...sq,
                            isSelected: false,
                            isValid: false,
                            isCapture: false,
                        }))
                    );

                    return;
                }

                // 🔴 ANOTHER PIECE CLICKED WHILE ONE IS SELECTED
                if (selected.current && selected.current !== currentSquare) {





                    console.log("a move is defined");
                    return; // do NOT disturb GSAP state
                }

                // 🟦 FIRST SELECTION
                selected.current = currentSquare;

                const moves = chess.current.moves({
                    square: currentSquare,
                    verbose: true,
                });

                console.log(moves)

                setboard(prev =>
                    prev.map(sq => {
                        const move = moves.find(m => m.to === sq.square);
                        return {
                            ...sq,
                            isSelected: sq.square === currentSquare,
                            isValid: !!move,
                            isCapture: move
                                ? move.flags.includes("c") || move.flags.includes("e")
                                : false,
                        };
                    })
                );
            },




            onRelease() {
                const snappedX = Math.round(this.x / SQUARE_SIZE) * SQUARE_SIZE;
                const snappedY = Math.round(this.y / SQUARE_SIZE) * SQUARE_SIZE;

                const fileIndex = snappedX / SQUARE_SIZE;
                const rankIndex = snappedY / SQUARE_SIZE;

                let file, rank;

                if (player === "white") {
                    file = FILES[fileIndex];
                    rank = 8 - rankIndex;
                } else {
                    file = FILES[7 - fileIndex];
                    rank = rankIndex + 1;
                }

                const to = `${file}${rank}`;
                const from = squareRef.current;

                const moves = chess.current.moves({
                    square: from,
                    verbose: true,
                });

                const move = moves.find(m => m.to === to);

                // ❌ ILLEGAL → SNAP BACK
                if (!move) {
                    gsap.to(this.target, {
                        x: startPosRef.current.x,
                        y: startPosRef.current.y,
                        duration: 0.25,
                        ease: "power2.out",
                    });
                    return;
                }

                // ✅ EXECUTE MOVE
                const executedMove = chess.current.move({
                    from,
                    to,
                    promotion: "q",
                });

                // ─────────────────────────────
                // 🔥 SPECIAL MOVE DETECTION
                // ─────────────────────────────
                const isEnPassant = executedMove.flags.includes("e");
                const isKingSideCastle = executedMove.flags.includes("k");
                const isQueenSideCastle = executedMove.flags.includes("q");

                // ─────────────────────────────
                // 🔥 EN-PASSANT CAPTURED PAWN
                // ─────────────────────────────
                let enPassantCapturedSquare = null;

                if (isEnPassant) {
                    const toFile = to[0];
                    const toRank = Number(to[1]);

                    const capturedRank =
                        executedMove.color === "w"
                            ? toRank - 1
                            : toRank + 1;

                    enPassantCapturedSquare = `${toFile}${capturedRank}`;
                }

                // ─────────────────────────────
                // 🔥 CASTLING ROOK SQUARES
                // ─────────────────────────────
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

                // ─────────────────────────────
                // 🔥 ANIMATION TIMELINE
                // ─────────────────────────────
                const tl = gsap.timeline({
                    onComplete: () => {
                        selected.current = null;

                        // ✅ UPDATE PIECES STATE
                        setpiece(prev => {
                            let next = prev
                                // remove captured piece
                                .filter(p => {
                                    if (isEnPassant) {
                                        return p.square !== enPassantCapturedSquare;
                                    }
                                    return p.square !== to;
                                })
                                // move king / normal piece
                                .map(p =>
                                    p.square === from ? { ...p, square: to } : p
                                );

                            // move rook if castling
                            if (rookFrom && rookTo) {
                                next = next.map(p =>
                                    p.square === rookFrom
                                        ? { ...p, square: rookTo }
                                        : p
                                );
                            }

                            return next;
                        });

                        // ✅ UPDATE BOARD FLAGS
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
                    },
                });

                // 🟦 KING / MOVING PIECE
                tl.to(this.target, {
                    x: snappedX,
                    y: snappedY,
                    duration: 0.25,
                    ease: "power2.out",
                });

                // 🟨 ROOK (CASTLING)
                if (rookFrom && rookTo) {
                    const rookEl = document.querySelector(`.${rookFrom}`);

                    if (rookEl) {
                        const rookFile = rookTo[0];
                        const rookRank = Number(rookTo[1]);

                        const rookX =
                            player === "white"
                                ? FILES.indexOf(rookFile) * SQUARE_SIZE
                                : (7 - FILES.indexOf(rookFile)) * SQUARE_SIZE;

                        const rookY =
                            player === "white"
                                ? (8 - rookRank) * SQUARE_SIZE
                                : (rookRank - 1) * SQUARE_SIZE;

                        tl.to(
                            rookEl,
                            {
                                x: rookX,
                                y: rookY,
                                duration: 0.25,
                                ease: "power2.out",
                            },
                            "<"
                        );
                    }
                }
            }




        });

        return () => draggable[0].kill();
    }, [boundsRef, chess, setboard, setpiece]);

    const PIECE_UNICODE = {
        w: { p: "♙", r: "♖", n: "♘", b: "♗", q: "♕", k: "♔" },
        b: { p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚" },
    };

    return (
        <div
            ref={boxRef}
            className={`${piece.square} pieces text-7xl absolute select-none`}
            style={{
                width: "12.5%",
                height: "12.5%",
                transform: `translate3d(${initialPos.x}px, ${initialPos.y}px, 0)`,
                willChange: "transform",
            }}
        >
            {PIECE_UNICODE[piece.color][piece.type]}
        </div>
    );
};

export default Piece;
