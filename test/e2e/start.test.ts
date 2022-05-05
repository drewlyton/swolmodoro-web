describe("Create Timer", () => {
  beforeEach(() => {
    cy.resetDB();
    // cy.login();
  });

  it("can access home page", () => {
    cy.request("GET", `/start`, {}).then((resp) => {
      expect(resp.status).to.eq(200);
    });
  });
});
