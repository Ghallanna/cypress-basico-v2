/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
  context('Dado que acesse a aplicação Central de Atendimento ao Cliente TAT; Quando Preencher o cadastro', () => {
    beforeEach(() => {
      cy.visit('./src/index.html')
      cy.title().should('be.equal', "Central de Atendimento ao Cliente TAT")
    });
    it('Deve  preencher os campos obrigatórios e enviar corretamente', function() {
      cy.get('#firstName').type('Wandinha')
      cy.get('#lastName').type('Adamms')
      cy.get('#email').type('wandinha.adamms@teste.com')
      cy.get('#open-text-area').type('Quero ser uma tester incrível!! UAUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU Demaiiiiiiiiiiiiiiiiiiiiis', {delay: 0})
      cy.contains('Enviar').click()
      cy.get('.success').should('be.visible')
    });
    it('Deve exibir mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
      cy.get('#firstName').type('Wandinha')
      cy.get('#lastName').type('Adamms')
      cy.get('#email').type('wandinha.adammsteste.com')
      cy.get('#open-text-area').type('Quero ser uma tester incrível!! UAUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU Demaiiiiiiiiiiiiiiiiiiiiis', {delay: 0})
      cy.contains('Enviar').click()
      cy.get('.error').should('be.visible')
    });
    it('Deve não exibir valor não-númerico no campo de telefone', () => {
      cy.get('#phone').type('vamosQueVamos').should('be.empty')
      cy.get('#phone').type('!@#$%').should('be.empty')
    });
    it('Deve exibir mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formuário', () => {
      cy.get('#firstName').type('Wandinha')
      cy.get('#lastName').type('Adamms')
      cy.get('#email').type('wandinha.adamms@teste.com')
      cy.get('#phone-checkbox').check()
      cy.get('#open-text-area').type('Quero ser uma tester incrível!!')
      cy.contains('Enviar').click()
      cy.get('.error').should('be.visible')
    });
    it('Deve preencher e limpar os campos nome, sobrenome, email e telefone', () => {
      cy.get('#firstName').type('Wandinha').should('have.value', 'Wandinha')
        .clear().should('have.empty')
      cy.get('#lastName').type('Adamms').should('have.value', 'Adamms')
        .clear().should('have.empty')
      cy.get('#email').type('wandinha.adamms@teste.com').should('have.value', 'wandinha.adamms@teste.com')
        .clear().should('have.empty')
      cy.get('#phone').type('000987654987').should('have.value', '000987654987')
        .clear().should('have.empty')
    });
    it('Deve exibir mensagem de erro ao submeter o formuário sem preencher os campos obrigatórios', () => {
      cy.get('.button').click()
      cy.get('.error').should('be.visible')
    });
    it('Deve enviar o formulário com sucesso usando um comendo customizado', () => {
      cy.fillMandatoryFieldsAndSubmit('Wandinha', 'Adamms', 'wandinha.adamms@teste.com', 'Serei uma tester incrível!')
    });
  })
  context('Dado que selecione a Lista suspensa do Produto', () => {
    beforeEach(() => {
      cy.visit('./src/index.html')
      cy.title().should('be.equal', "Central de Atendimento ao Cliente TAT")
    });
    it('Deve selecionar um produto (YouTube) por seu texto', () => {
      cy.get('#product').select('YouTube').should('have.value', 'youtube')
    });
    it('Deve selecionar um produto (Mentoria) por seu valor (value)', () => {
      cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    });
    it('Deve selecionar um produto (Blog) por seu índice', () => {
      cy.get('#product').select(1).should('have.value', 'blog')
    });
  });
  context('Dado que selecione os tipos de atendimentos', () => {
    beforeEach(() => {
      cy.visit('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      cy.title().should('be.equal', "Central de Atendimento ao Cliente TAT")
    });
    it('Deve marcar o tipo de atendimento "Feedback"', () => {
      cy.get('[type="radio"]').last().check()
        .should('have.value', 'feedback')
    });
     it('Deve marcar cada tipo de atendimento', () => {
       cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function($radio) {
          cy.wrap($radio).check()
          cy.wrap($radio).should('be.checked')
        })
    });
    it('Deve marcar ambos checkboxes, depois desmarca o último', () => {
      cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
    });
  });
  context('Dado que anexe um arquivo', () => {
    beforeEach(() => {
      cy.visit('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      cy.title().should('be.equal', "Central de Atendimento ao Cliente TAT")
    });  
    it('seleciona um arquivo da pasta fixtures', () => {
      cy.get('#file-upload')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json')
        .should(function($input){
          expect($input[0].files[0].name).to.equal('example.json')
        })
        
    });
    it('seleciona um arquivo simulando um drag-and-drop', () => {
      cy.get('#file-upload')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json', { action: 'drag-drop'})
        .should(function($input){
          expect($input[0].files[0].name).to.equal('example.json')
        })
    });
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
      cy.fixture('example.json').as('sampleFile')
      cy.get('#file-upload')
        .selectFile('@sampleFile')
        .should(function($input) {
          expect($input[0].files[0].name).to.equal('example.json')
        })
    });
  });
  context('Quando selecionar um link que direciona para outro navegador', () => {
    beforeEach(() => {
      cy.visit('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      cy.title().should('be.equal', "Central de Atendimento ao Cliente TAT")
    }); 
    it('Deve verificar que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
      cy.get('#privacy a').should('have.attr', 'target', '_blank')
    });
    it('Deve acessar a página da política de privacidade removendo o target e então clicando no link', () => {
      cy.get('#privacy a').invoke('removeAttr', 'target').click()
      cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
      cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
    });
  });
})