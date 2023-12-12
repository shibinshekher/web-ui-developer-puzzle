describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', async() => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to undo my added book', async () => {
    /* search form */
    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();
    /* initial count of reading list item */
    const readingListBeforeAdd = cy.get('[data-testing="reading-list-item"]').its('length');
    /* adding another book to reading list */
    cy.get('[data-testing="add-book-button"]:enabled').type('javascript').first().should('exist').click();
    /* undo action */
    cy.get('.mat-simple-snackbar-action button').click();
    /* final count of reading list */
    cy.get('[data-testing="reading-list-item"]').should('have.length', readingListBeforeAdd);
  });

  it('Then: I should be able to undo my removed book', async () => {
    /* search form */
    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();
    /* add book to reading list */
    cy.get('[data-testing="add-book-button"]:enabled').type('javascript').first().should('exist').click();
    /* open reading list */
    cy.get('[data-testing="toggle-reading-list"]').click();
    /* initial count of reading list item */
    const readingListBeforeRemove = cy.get('[data-testing="reading-list-item"]').its('length');
    /* remove book from reading list */
    cy.get('[data-testing="remove-book-button"]').click();
    /* undo action */
    cy.get('.mat-simple-snackbar-action button').click();
    /* final count of reading list item */
    cy.get('[data-testing="reading-list-item"]').should('have.length', readingListBeforeRemove);
  });
});