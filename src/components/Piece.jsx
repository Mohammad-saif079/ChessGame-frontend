import { useRef, useEffect, useLayoutEffect, useMemo } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);


const BOARD_SIZE = 500;
const SQUARE_SIZE = BOARD_SIZE / 8;
const FILES = "abcdefgh";

const Piece = ({ piece, pieceRefs, setRef, selected, player, boundsRef, chess, setboard, setpiece, setselected }) => {
    const boxRef = useRef(null);


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

    function applyCaptureState(from, to, executedMove) {
        setpiece(prev => {
            let next = prev;

            // 🧨 EN PASSANT
            if (executedMove.flags.includes("e")) {
                const file = to[0];
                const rank = Number(to[1]);
                const capturedSquare =
                    executedMove.color === "w"
                        ? `${file}${rank - 1}`
                        : `${file}${rank + 1}`;
                next = next.filter(p => p.square !== capturedSquare);
            } else {
                next = next.filter(p => p.square !== to);
            }

            next = next.map(p =>
                p.square === from ? { ...p, square: to } : p
            );

            return next;
        });

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
                console.log("PRESS:", {
                    clickedSquare: squareRef.current,
                    clickedColor: piece.color,
                    selectedCurrent: selected.current,
                    engineTurn: chess.current.turn(),
                });


                const currentSquare = squareRef.current;
                startPosRef.current = { x: this.x, y: this.y };

                const turn = chess.current.turn(); // 'w' or 'b'

                // 🔁 RE-CLICK SAME PIECE → TOGGLE OFF
                if (selected.current === currentSquare) {
                    selected.current = null;
                    setboard(prev =>
                        prev.map(sq => ({ ...sq, isSelected: false, isValid: false, isCapture: false }))
                    );
                    return;
                }

                // 🔴 ANOTHER PIECE CLICKED WHILE ONE IS SELECTED
                if (selected.current && selected.current !== currentSquare) {
                    const from = selected.current;
                    const to = currentSquare;

                    const selectedPieceOnBoard = chess.current.get(from);
                    const clickedPieceOnBoard = chess.current.get(to);

                    // only proceed if the selected piece actually belongs to the side to move
                    if (!selectedPieceOnBoard || selectedPieceOnBoard.color !== turn) {
                        selected.current = null;
                        return;
                    }

                    // 🟦 SAME COLOR AS SELECTED → SWITCH SELECTION
                    if (clickedPieceOnBoard && clickedPieceOnBoard.color === selectedPieceOnBoard.color) {
                        selected.current = currentSquare;
                        const moves = chess.current.moves({ square: currentSquare, verbose: true });
                        setboard(prev =>
                            prev.map(sq => {
                                const move = moves.find(m => m.to === sq.square);
                                return {
                                    ...sq,
                                    isSelected: sq.square === currentSquare,
                                    isValid: !!move,
                                    isCapture: move ? move.flags.includes("c") || move.flags.includes("e") : false,
                                };
                            })
                        );
                        return;
                    }

                    // 🔴 ENEMY PIECE → ATTEMPT CAPTURE (always allowed to fall through here)
                    const moves = chess.current.moves({ square: from, verbose: true });
                    const move = moves.find(m => m.to === to);

                    if (!move) {
                        console.log("invalid capture attempt");
                        return;
                    }

                    // const executedMove = chess.current.move({ from, to, promotion: "q" });
                    // ...rest of your existing capture animation/state code, unchanged
                    const executedMove = chess.current.move({
                        from,
                        to,
                        promotion: "q",
                    });

                    // ✅ don't trust pieceRefs alone — fall back to a direct DOM query
                    const capturingEl =
                        pieceRefs.current[from] || document.querySelector(`.${CSS.escape(from)}.pieces`);

                    if (!capturingEl) {
                        console.warn("capture animation skipped: no DOM element found for", from);
                        applyCaptureState(from, to, executedMove);
                        return;
                    }

                    const position = squareToPos(to);

                    gsap.to(capturingEl, {
                        x: position.x,
                        y: position.y,
                        duration: 0.25,
                        ease: "power2.out",
                        onComplete: () => {
                            applyCaptureState(from, to, executedMove);
                        },
                    });
                }

                // 🟦 FIRST SELECTION — only allowed for the side to move
                if (piece.color !== turn) return;

                selected.current = currentSquare;
                const moves = chess.current.moves({ square: currentSquare, verbose: true });
                setboard(prev =>
                    prev.map(sq => {
                        const move = moves.find(m => m.to === sq.square);
                        return {
                            ...sq,
                            isSelected: sq.square === currentSquare,
                            isValid: !!move,
                            isCapture: move ? move.flags.includes("c") || move.flags.includes("e") : false,
                        };
                    })
                );
            }

            ,




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
