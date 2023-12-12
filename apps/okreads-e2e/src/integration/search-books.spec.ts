describe('When: Use the search feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see search results as I am typing', () => {
    /* search form */
    cy.get('input[type="search"]').type('javascript');
    cy.wait(5000);
    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);
  });
});
