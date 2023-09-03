/// <reference types="Cypress" />
describe('Politica de Privacidade', () => {
    it('Deve testar a página da política de privacidade de forma independente', () => {
        cy.visit('./src/privacy.html')
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
        cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
      });
});
