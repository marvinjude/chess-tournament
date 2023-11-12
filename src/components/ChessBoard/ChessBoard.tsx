import { useState, useEffect, useRef } from "react";
import { Cell } from "./Cell";
import {
  flateenFenRow,
  CellPosition,
  areSameCasing,
  applyChangesToFEN,
  derieveNewPositionBaseOnArrowKey,
} from "@lib/utils/chess-utils";
import { useSound } from "@/contexts/Sound";
import { useTheme } from "@/contexts/Theme";
import { PIECE_SYMBOLS, LETTERS } from "./constants";

type ChessBoardProps = {
  fen: string;
  onChange?: (e: string) => void;
  disabled?: boolean;
};

const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"] as const;

export type ArrowKeyType = (typeof arrowKeys)[number];

const ChessBoard = ({ fen, onChange: setFen, disabled }: ChessBoardProps) => {
  const [currentCell, setCurrentCell] = useState({ row: -1, col: -1 });
  const [cellInFocus, setCellInFocus] = useState({ row: -1, col: -1 });
  const cellRefs = useRef<{
    [key: string]: HTMLButtonElement | null;
  }>({});

  const { theme } = useTheme();
  const { playSound } = useSound();

  const squares = [];
  const rows = fen.trim().split("/");

  /**
   * Focus on cell when `cellInFocus` changes
   */
  useEffect(() => {
    if (cellInFocus.row === -1 && cellInFocus.col === -1) return;

    const cellRef = cellRefs.current[`${cellInFocus.row}-${cellInFocus.col}`];

    if (cellRef) {
      cellRef.focus();
    }
  }, [cellInFocus]);

  const onCellClick = ({ col: newCol, row: newRow }: CellPosition) => {
    if (disabled) return;

    playSound("CELL_CLICK");

    const sameCellWasClicked =
      newCol == currentCell.col && newRow == currentCell.row;

    if (sameCellWasClicked) {
      setCurrentCell({ row: -1, col: -1 });
      return;
    } else {
      setCurrentCell({ row: newRow, col: newCol });
    }

    const noCellIsSelcted = currentCell.row == -1 && currentCell.col == -1;

    if (noCellIsSelcted) return;

    const sourceCellValue = flateenFenRow(fen.split("/")[currentCell.row])[
      currentCell.col
    ];

    const targetCellValue = flateenFenRow(fen.split("/")[newRow])[newCol];

    const sourceCellIsNotEmpty = sourceCellValue !== "1";

    const tagetCellIsNotSourceCell = !(
      newCol == currentCell.col && newRow == currentCell.row
    );

    const isOppenentsPiece = !areSameCasing(sourceCellValue, targetCellValue);

    /**
     * Move Piece from Source Cell -> Target Cell if:
     * - The Source Cell is not Empty
     * - The Target Cell is not the Source Cell
     * - The Target Cell has an opponeent's piece
     */

    // Soure and target are not empty but and are the same case
    if (sourceCellValue !== "1" && targetCellValue !== "1" && !isOppenentsPiece)
      return;

    if (sourceCellIsNotEmpty && tagetCellIsNotSourceCell) {
      const fenAfterMove = applyChangesToFEN({
        fen,
        changes: [
          {
            row: currentCell.row,
            col: currentCell.col,
            value: "1",
          },
          {
            row: newRow,
            col: newCol,
            value: sourceCellValue,
          },
        ],
      });

      playSound("MOVE");

      if (setFen) setFen(fenAfterMove);

      setCurrentCell({ row: newRow, col: newCol });
    }
  };

  const onCellDoubleClick = ({ row, col }: CellPosition) => {
    if (disabled) return;

    const flateenedRow = flateenFenRow(fen.split("/")[row]);
    const cellIsNotEmpty = flateenedRow[col] !== "1";

    let newCellValue = ``;

    if (cellIsNotEmpty) {
      const newIndex =
        (LETTERS.indexOf(flateenedRow[col].toLowerCase()) + 1) % LETTERS.length;

      const letterIsLowerCase =
        flateenedRow[col] === flateenedRow[col].toLowerCase();

      newCellValue = letterIsLowerCase
        ? LETTERS[newIndex]
        : LETTERS[newIndex].toUpperCase();
    }

    const resultingFen = applyChangesToFEN({
      fen: fen,
      changes: [
        {
          row,
          col,
          value: newCellValue,
        },
      ],
    });

    if (setFen) setFen(resultingFen);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = event;

    const arrowKeyWasPressed = arrowKeys.includes(key as ArrowKeyType);

    if (arrowKeyWasPressed) {
      event.preventDefault();
      const newPosition = derieveNewPositionBaseOnArrowKey(
        key as ArrowKeyType,
        {
          row: cellInFocus.row,
          col: cellInFocus.col,
        }
      );
      setCellInFocus(newPosition);
    }
  };

  for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
    const row = rows[rowIndex];
    const flatRow = flateenFenRow(row);

    for (let rowCharIndex = 0; rowCharIndex < flatRow.length; rowCharIndex++) {
      const char = flatRow.charAt(rowCharIndex) as keyof typeof PIECE_SYMBOLS;
      const charIsNumber = !isNaN(+char);

      const isLightSquare = (rowIndex + rowCharIndex) % 2 === 0;

      const cellVariant =
        rowIndex == currentCell.row && rowCharIndex == currentCell.col
          ? "selected"
          : "default";

      squares.push(
        <Cell
          data-testid={`cell-${rowIndex}-${rowCharIndex}`}
          data-symbol={char}
          ref={(ref) => {
            cellRefs.current[`${rowIndex}-${rowCharIndex}`] = ref;
          }}
          onFocus={() => {
            setCellInFocus({
              row: rowIndex,
              col: rowCharIndex,
            });
          }}
          onKeyDown={onKeyDown}
          className={isLightSquare ? theme.secondary : theme.primary}
          col={rowCharIndex}
          row={rowIndex}
          key={`${rowIndex}-${rowCharIndex}`}
          onClick={onCellClick}
          variant={disabled ? "disabled" : cellVariant}
          onDoubleClick={onCellDoubleClick}
        >
          {charIsNumber ? (
            // This should be null but adding this as a workaround to get the test to pass
            // Cypress has some issues clicking on the cell if its empty
            <div style={{ height: "50px", width: "50px", display: "none" }} />
          ) : (
            <img
              src={`/chess-pieces/${PIECE_SYMBOLS[char].src}`}
              alt={PIECE_SYMBOLS[char].name}
              className="object-contain p-2"
            />
          )}
        </Cell>
      );
    }
  }

  return (
    <div
      data-testid="chessboard"
      className="w-full md:w-[550px] gap-1 grid chess-board-grid-template-cols grid-rows-8 border"
    >
      {squares}
    </div>
  );
};

export { ChessBoard };
