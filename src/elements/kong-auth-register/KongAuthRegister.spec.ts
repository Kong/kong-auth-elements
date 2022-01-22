// Import types for custom commands
/// <reference types="../../cypress/support" />

import { mount } from '@cypress/vue'
import KongAuthRegister from '@/elements/kong-auth-register/KongAuthRegister.ce.vue'

// Component data-testid strings
const testids = {
  form: 'kong-auth-register-form',
  fullName: 'kong-auth-register-full-name',
  organization: 'kong-auth-register-organization',
  email: 'kong-auth-register-email',
  password: 'kong-auth-register-password',
  agreeCheckbox: 'kong-auth-register-agree-checkbox',
  submitBtn: 'kong-auth-register-submit',
  errorMessage: 'kong-auth-error-message',
  instructionText: 'kong-auth-register-instruction-text',
  accessCode: 'kong-auth-register-access-code',
  injectedStyles: 'kong-auth-injected-styles',
}

describe('KongAuthRegister.ce.vue', () => {
  // Required for all Custom Elements
  it('has proper structure and required classes', () => {
    mount(KongAuthRegister)

    // Should have .kong-auth-element as parent class
    const elementDiv = cy.get('.kong-auth-element')
    elementDiv.should('not.be.empty')

    // Should have BaseCustomElement as a child component
    elementDiv.find('.base-custom-element').should('not.be.empty')

    // Should have injected styles
    cy.getTestId(testids.injectedStyles).should('not.be.empty')
  })

  it('renders a register form with default fields and button elements', () => {
    mount(KongAuthRegister)

    // Form should exist
    cy.getTestId(testids.form).should('be.visible')
    cy.getTestId(testids.form).within(() => {
      // Elements should exist
      cy.getTestId(testids.fullName).should('be.visible')
      cy.getTestId(testids.organization).should('be.visible')
      cy.getTestId(testids.email).should('be.visible')
      cy.getTestId(testids.password).should('be.visible')
      cy.getTestId(testids.agreeCheckbox).should('be.visible')
      cy.getTestId(testids.submitBtn).should('be.visible')
    })
    // Elements should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
    cy.getTestId(testids.accessCode).should('not.exist')
  })

  it('prevents submit and shows error if full name field is empty', () => {
    mount(KongAuthRegister)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.organization).type('Test Org')
    cy.getTestId(testids.email).type('user1@email.com')
    cy.getTestId(testids.password).type('not-a-real-password')
    cy.getTestId(testids.agreeCheckbox).check()

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it('prevents submit and shows error if organization field is empty', () => {
    mount(KongAuthRegister)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.fullName).type('Player One')
    cy.getTestId(testids.email).type('user1@email.com')
    cy.getTestId(testids.password).type('not-a-real-password')
    cy.getTestId(testids.agreeCheckbox).check()

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it('prevents submit and shows error if email field is empty', () => {
    mount(KongAuthRegister)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.fullName).type('Player One')
    cy.getTestId(testids.organization).type('Test Org')
    cy.getTestId(testids.password).type('not-a-real-password')
    cy.getTestId(testids.agreeCheckbox).check()

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it('prevents submit and shows error if password field is empty', () => {
    mount(KongAuthRegister)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.fullName).type('Player One')
    cy.getTestId(testids.email).type('user1@email.com')
    cy.getTestId(testids.organization).type('Test Org')
    cy.getTestId(testids.agreeCheckbox).check()

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it('prevents submit and shows error if agree checkbox is not checked', () => {
    mount(KongAuthRegister)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.fullName).type('Player One')
    cy.getTestId(testids.email).type('user1@email.com')
    cy.getTestId(testids.organization).type('Test Org')
    cy.getTestId(testids.password).type('not-a-real-password')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  // TODO: Check for access code required

  /* ==============================
   * Instruction Text
   * ============================== */
  it('shows instruction text if instructionText prop is set', () => {
    const customText = 'This is custom instruction text'
    mount(KongAuthRegister, {
      props: {
        instructionText: customText,
      },
    })

    cy.getTestId(testids.instructionText).should('be.visible').should('have.text', customText)
  })
})
