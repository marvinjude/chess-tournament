import { describe, it, expect } from "vitest";

import {
  isValidFENotation,
  applyChangesToFEN,
  flateenFenRow,
  areSameCasing,
} from "./chess-utils";

describe("chess-utils", () => {
  describe("isValidFenNotation", () => {
    it("should be able to validate an empty board", () => {
      const fen = "8/8/8/8/8/8/8/8";
      const result = isValidFENotation(fen);
      expect(result).toBe(true);
    });

    it("should be able to validate a board with pieces", () => {
      const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
      const result = isValidFENotation(fen);
      expect(result).toBe(true);
    });

    it("should be able to dectect an invalid FEN notation", () => {
      const inlalidFENs = [
        "",
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN",
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/",
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/1",
      ];
      for (const fen of inlalidFENs) {
        const result = isValidFENotation(fen);
        expect(result).toBe(false);
      }
    });
  });

  describe("applyChangesToFEN", () => {
    it("should be able to add a piece to an empty board ", () => {
      const fen = "8/8/8/8/8/8/8/8";
      const result = applyChangesToFEN({
        fen,
        changes: [
          {
            row: 0,
            col: 0,
            value: "r",
          },
        ],
      });
      expect(result).toBe("r7/8/8/8/8/8/8/8");
    });

    it("should be able to remove the last piece on a board", () => {
      const fen = "r7/8/8/8/8/8/8/8";
      const result = applyChangesToFEN({
        fen,
        changes: [
          {
            row: 0,
            col: 0,
            value: "",
          },
        ],
      });
      expect(result).toBe("8/8/8/8/8/8/8/8");
    });

    it("should result in the right Fen Notation after a list of changes", () => {
      const correctResult =
        "2bk3r/p2pBpNp/n3bn2/1p1NP1pP/4r1P1/3P4/P1P1K3/q5br";

      const result = applyChangesToFEN({
        fen: "r1bk3r/p2pBpNp/n3bn2/1p1NP1pP/6P1/3P4/P1P1K3/q5b1",
        changes: [
          {
            row: 0,
            col: 0,
            value: "",
          },
          {
            row: 7,
            col: 7,
            value: "r",
          },
          {
            row: 4,
            col: 4,
            value: "r",
          },
        ],
      });

      expect(result).toBe(correctResult);
    });
  });

  describe("flateenFenRow", () => {
    it("should be able same value for a row that is already flat", () => {
      const fenRow = "rnbqkbnr";
      const result = flateenFenRow(fenRow);
      expect(result).toBe(fenRow);
    });

    it("should be able to flaten a row with numbers", () => {
      const fenRow = "r1bk3r";
      const result = flateenFenRow(fenRow);
      expect(result).toBe("r1bk111r");
    });
  });
  describe("areSameCasing", () => {
    it("should be able to detect same casing of same letters", () => {
      const result = areSameCasing("a", "a");
      expect(result).toBe(true);
    });

    it("should be able to detect different casing of same letter", () => {
      const result = areSameCasing("a", "A");
      expect(result).toBe(false);
    });

    it("should be able to dectect same casing of different letters", () => {
      const result = areSameCasing("a", "B");
      expect(result).toBe(false);
    });
  });
});
