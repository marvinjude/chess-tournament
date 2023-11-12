it("Persists FEN Input", () => {
  cy.visit("/");

  const FEN = `2bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1`;

  cy.get("input").clear();
  cy.get("input").type(FEN);

  cy.reload();

  cy.get("input").should("have.value", FEN);
});

it("Persists Theme", () => {
  cy.visit("/");

  cy.get("[data-current-theme]").then(($elem) => {
    const initialTheme = $elem.attr("data-current-theme");

    cy.get("body").type("{Shift}T");

    cy.get("[data-current-theme]")
      .invoke("attr", "data-current-theme")
      .then((newTheme) => {
        expect(newTheme).not.to.equal(initialTheme);

        cy.reload();

        cy.get("[data-current-theme]").should(
          "have.attr",
          "data-current-theme",
          newTheme
        );
      });
  });
});
