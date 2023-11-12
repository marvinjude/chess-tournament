describe("Browser loads", () => {
  it("loads with no page errors", () => {
    cy.visit("/");
    cy.get("body").should("contain", "FEN NOTATION");
  });

  it("loads with no console errors", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win.console, "log").as("consoleLog");
        cy.stub(win.console, "error").as("consoleError");
      },
    });

    cy.get("@consoleError").should("have.not.been.called");
  });
});
