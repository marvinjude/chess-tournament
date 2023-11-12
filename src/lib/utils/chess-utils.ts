import { ArrowKeyType } from "@/components/ChessBoard/ChessBoard";

export type CellPosition = {
  row: number;
  col: number;
};

/**
 * @description Validates a row in a Fen notation
 * @param row A row in a Fen notation
 */
const isValidChessRow = (row: string) => {
  const VALID_LETTERS = "rnbqkpRNBQKP";
  const VALID_NUMBERS = "12345678";

  const MAX_PIECES = 8;
  let piecesCount = 0;

  for (const char of row) {
    const isValidLetter = VALID_LETTERS.includes(char);
    const isValidNumber = VALID_NUMBERS.includes(char);

    if (isValidLetter || isValidNumber) {
      if (isValidLetter) piecesCount++;
      if (isValidNumber) piecesCount += Number(char);
    } else {
      return false;
    }

    if (piecesCount > MAX_PIECES) {
      return false;
    }
  }

  return MAX_PIECES === piecesCount;
};

/**
 * @description Validates a Fen notation
 * @param fen A Fen notation
 */
const isValidFENotation = (fen: string) => {
  const rows = fen.trim().split("/");

  if (rows.length !== 8) {
    return false;
  }

  for (const row of rows) {
    if (!isValidChessRow(row)) {
      return false;
    }
  }

  return true;
};

type ApplyChangesToFENParam = {
  fen: string;
  changes: {
    row: number;
    col: number;
    value: string;
  }[];
};

const applyChangesToFEN = ({ fen, changes }: ApplyChangesToFENParam) => {
  const rows = fen.split("/");

  /**
   * When a list a of chnages to be made is provided, we don't need to flatten all the rows
   * We can just flatten the rows that are being changed
   */
  for (const change of changes) {
    const flatFenRow = flateenFenRow(rows[change.row]).split("");

    flatFenRow[change.col] = change.value === "" ? "1" : change.value;

    const newFenRow = unFlateenFenRow(flatFenRow.join(""));

    rows[change.row] = newFenRow;
  }

  return rows.join("/");
};

/**
 * Given a FEN it will replace all the numbers with the number of 1s
 * @example
 * flateenFenRow("2bqkbnr") // "11bqkbnr"
 */
const flateenFenRow = (fenRow: string): string => {
  return fenRow.replace(/[2-9]/g, (match) => "1".repeat(parseInt(match)));
};

const unFlateenFenRow = (flateenedFenRow: string): string => {
  let count = 0;
  let result = "";

  for (let i = 0; i < flateenedFenRow.length; i++) {
    if (flateenedFenRow[i] === "1") {
      count++;
    } else {
      if (count > 0) {
        result += count.toString();
        count = 0;
      }
      result += flateenedFenRow[i];
    }
  }

  if (count > 0) {
    result += count.toString();
  }

  return result;
};

/**
 * Checks if two strings are the same casing
 * Two strings are the same casing if both are lower case or Both are upper case
 *
 * @param a First string
 * @param b Second string
 */
const areSameCasing = (a: string, b: string) => {
  const aIsLowerCase = a === a.toLowerCase();
  const bIsLowerCase = b === b.toLowerCase();

  const aIsUpperCase = a === a.toUpperCase();
  const bIsUpperCase = b === b.toUpperCase();

  return (aIsLowerCase && bIsLowerCase) || (aIsUpperCase && bIsUpperCase);
};

const derieveNewPositionBaseOnArrowKey = (
  key: ArrowKeyType,
  { row, col }: CellPosition
) => {
  switch (key) {
    case "ArrowUp":
      return {
        row: row - 1 < 0 ? 0 : row - 1,
        col,
      };
    case "ArrowDown":
      return {
        row: row + 1 > 7 ? 7 : row + 1,
        col,
      };
    case "ArrowLeft":
      return {
        row,
        col: col - 1 < 0 ? 0 : col - 1,
      };
    case "ArrowRight":
      return {
        col: col + 1 > 7 ? 0 : col + 1,
        // if we reach the last column of a row, move to the first column of the next row
        row: col + 1 > 7 ? (row + 1 > 7 ? 7 : row + 1) : row,
      };
  }
};

export {
  isValidFENotation,
  applyChangesToFEN,
  flateenFenRow,
  areSameCasing,
  derieveNewPositionBaseOnArrowKey,
};
