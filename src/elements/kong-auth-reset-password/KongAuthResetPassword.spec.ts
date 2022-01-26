// Import types for custom commands
/// <reference types="../../cypress/support" />

import { mount } from '@cypress/vue'
import KongAuthResetPassword from '@/elements/kong-auth-reset-password/KongAuthResetPassword.ce.vue'

// Component data-testid strings
const testids = {
  form: 'kong-auth-reset-password-form',
  password: 'kong-auth-reset-password-new-password',
  confirmPassword: 'kong-auth-reset-password-confirm-new-password',
  submitBtn: 'kong-auth-reset-password-submit',
  errorMessage: 'kong-auth-error-message',
  instructionText: 'kong-auth-reset-password-instruction-text',
  injectedStyles: 'kong-auth-injected-styles',
}

describe('KongAuthResetPassword.ce.vue', () => {
  // Required for all Custom Elements
  it('has proper structure and required classes', () => {
    mount(KongAuthResetPassword)

    // Should have .kong-auth-element as parent class
    const elementDiv = cy.get('.kong-auth-element')
    elementDiv.should('not.be.empty')

    // Should have BaseCustomElement as a child component
    elementDiv.find('.base-custom-element').should('not.be.empty')

    // Should have injected styles
    cy.getTestId(testids.injectedStyles).should('not.be.empty')
  })

  it('renders a reset password form with email and button elements', () => {
    mount(KongAuthResetPassword)

    // Form should exist
    cy.getTestId(testids.form).should('be.visible')
    cy.getTestId(testids.form).within(() => {
      // Elements should exist
      cy.getTestId(testids.password).should('be.visible')
      cy.getTestId(testids.confirmPassword).should('be.visible')
      cy.getTestId(testids.submitBtn).should('be.visible').should('be.disabled')
    })
    // Elements should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
  })

  it('prevents submit and shows error if password field is empty', () => {
    mount(KongAuthResetPassword)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.confirmPassword).type('not-a-real-password')

    cy.getTestId(testids.submitBtn).should('be.visible').should('be.disabled')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it('prevents submit and shows error if confirm password field is empty', () => {
    mount(KongAuthResetPassword)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.password).type('not-a-real-password')

    cy.getTestId(testids.submitBtn).should('be.visible').should('be.disabled')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it('prevents submit and shows error if password and password confirm fields do not match', () => {
    mount(KongAuthResetPassword)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.password).type('not-a-real-password')
    cy.getTestId(testids.confirmPassword).type('a-different-password')

    cy.getTestId(testids.submitBtn).should('be.visible').should('be.disabled')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it("emits a 'reset-password-success' event with payload on successful password reset", () => {
    // Stub 200 response
    cy.intercept('PATCH', '**/password-resets', {
      statusCode: 200,
      body: {
        email: 'user1@email.com',
      },
    }).as('password-reset')

    mount(KongAuthResetPassword)

    cy.getTestId(testids.password).type('TestPassword1!')
    cy.getTestId(testids.confirmPassword).type('TestPassword1!')
    cy.getTestId(testids.form).submit()

    const eventName = 'reset-password-success'

    cy.wait('@password-reset').then(() => {
      // Check for emitted event
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', eventName).then(() => {
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'email')
      })
    })
  })

  /* ==============================
   * Instruction Text
   * ============================== */
  it('shows instruction text if instructionText prop is set', () => {
    const customText = 'This is custom instruction text'
    mount(KongAuthResetPassword, {
      props: {
        instructionText: customText,
      },
    })

    cy.getTestId(testids.instructionText).should('be.visible').should('have.text', customText)
  })
})
