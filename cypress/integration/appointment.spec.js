describe("appointment", () => {
  beforeEach(() => {
    cy.request("GET", "api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
  });
  it("should book an interview", () => {
    cy.get("[alt=Add]")
      .first()
      .click();

    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");

    cy.get("[alt='Sylvia Palmer']").click();

    cy.contains("Save").click({ force: true });

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });
  it("should edit an interview", () => {
    cy.get(".appointment__card").trigger("mouseover");
    cy.get("[alt=Edit]").click({ force: true });
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Lydia Miller-Jones");
    cy.contains("Save").click({ force: true });
  });
  it("should cancel an interview", () => {
    cy.get(".appointment__card").trigger("mouseover");
    cy.get("[alt=Delete]").click({ force: true });
    cy.contains('Confirm').click();
    cy.contains(".appointment__card--show", "Archie Cohen")
    .should("not.exist");
  })
});
