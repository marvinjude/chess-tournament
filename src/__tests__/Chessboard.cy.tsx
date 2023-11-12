import { ChessBoard } from "@components/ChessBoard";
import { SoundContextProvider } from "@/contexts/Sound";
import { ThemeContextProvider } from "@/contexts/Theme";
import { mount } from "cypress/react18";
import { useState } from "react";
import { areSameCasing } from "@/lib/utils/chess-utils";

const FEN = "r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1";

const ChessBoardWithState = () => {
  const [fen, setFen] = useState(FEN);

  return (
    <SoundContextProvider>
      <ThemeContextProvider>
        <ChessBoard fen={fen} onChange={setFen} />
      </ThemeContextProvider>
    </SoundContextProvider>
  );
};

describe("<Cell />", () => {
  it("renders", () => {
    mount(<ChessBoardWithState />);
  });

  it("Double clicking a cell changes the piece to a different piece of same color", async () => {
    mount(<ChessBoardWithState />);

    const cellQuery = `[data-testid='cell-0-0']`;
    const cellAttributeWithPieceSymbol = "data-symbol";

    cy.get(cellQuery)
      .invoke("attr", cellAttributeWithPieceSymbol)
      .then((initialCellValue) => {
        cy.get(cellQuery).dblclick();

        cy.get(cellQuery)
          .invoke("attr", cellAttributeWithPieceSymbol)
          .then((newCellValue) => {
            // Value has changed
            expect(initialCellValue).to.not.equal(newCellValue);

            // The new symbol is of the same casing as the old one
            if (initialCellValue && newCellValue) {
              expect(areSameCasing(initialCellValue, newCellValue)).to.be.true;
            }
          });
      });
  });

  it("Clicking on a cell with a value and clicking on an empty cell swaps the values", () => {
    mount(<ChessBoardWithState />);

    const sourceCellQuery = `[data-testid='cell-0-0']`;
    const targetCellQuery = `[data-testid='cell-0-1']`;

    const cellAttributeWithPieceSymbol = "data-symbol";

    cy.get(sourceCellQuery).click();
    cy.get(targetCellQuery).click();

    cy.get(sourceCellQuery).should(
      "have.attr",
      cellAttributeWithPieceSymbol,
      "1"
    );

    cy.get(targetCellQuery).should(
      "have.attr",
      cellAttributeWithPieceSymbol,
      "r"
    );
  });
});
