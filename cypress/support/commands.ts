Cypress.Commands.add('getTestId', (dataTestId: string) => {
  return cy.get(`[data-testid=${dataTestId}]`)
})

Cypress.Commands.add('findTestId', (dataTestId: string) => {
  return cy.find(`[data-testid=${dataTestId}]`)
})
