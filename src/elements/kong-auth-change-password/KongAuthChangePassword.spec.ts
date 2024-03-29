// Import types for custom commands
/// <reference types="../../cypress/support" />

import { mount } from '@cypress/vue'
import KongAuthChangePassword from './KongAuthChangePassword.ce.vue'

// Component data-testid strings
const testids = {
  form: 'kong-auth-change-password-form',
  currentPassword: 'kong-auth-change-password-current-password',
  newPassword: 'kong-auth-change-password-new-password',
  confirmPassword: 'kong-auth-change-password-confirm-new-password',
  submitBtn: 'kong-auth-change-password-submit',
  errorMessage: 'kong-auth-error-message',
  instructionText: 'kong-auth-change-password-instruction-text',
  injectedStyles: 'kong-auth-injected-styles',
}

const user = {
  currentPassword: 'TestPassword0+',
  newPassword: 'TestPassword1!',
  confirmPassword: 'TestPassword1!',
}

describe('KongAuthChangePassword.ce.vue', () => {
  // Required for all Custom Elements
  it('has proper structure and required classes', () => {
    mount(KongAuthChangePassword)

    // Should have .kong-auth-element as parent class
    cy.get('.kong-auth-element').should('be.visible').and('not.be.empty')
  })

  it('renders a change password form with button elements', () => {
    mount(KongAuthChangePassword)

    // Form should exist
    cy.getTestId(testids.form).should('be.visible')
    cy.getTestId(testids.form).within(() => {
      // Elements should exist
      cy.getTestId(testids.currentPassword).should('be.visible')
      cy.getTestId(testids.newPassword).should('be.visible')
      cy.getTestId(testids.confirmPassword).should('be.visible')
      cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')
    })
    // Elements should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
  })

  it('prevents submit and shows error if current password field is empty', () => {
    mount(KongAuthChangePassword)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.confirmPassword).type(user.currentPassword)

    cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it('prevents submit and shows error if new password field is empty', () => {
    mount(KongAuthChangePassword)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.confirmPassword).type(user.newPassword)

    cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it('prevents submit and shows error if confirm password field is empty', () => {
    mount(KongAuthChangePassword)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.confirmPassword).type(user.confirmPassword)

    cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it('prevents submit and shows error if password and password confirm fields do not match', () => {
    mount(KongAuthChangePassword)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.newPassword).type(user.newPassword)
    cy.getTestId(testids.confirmPassword).type('a-different-password')

    cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  /* ==============================
   * Change Password Button Text
   * ============================== */
  it('customizes the change password button text if changePasswordButtonText prop is set', () => {
    const customText = 'This is custom button text'
    mount(KongAuthChangePassword, {
      props: {
        changePasswordButtonText: customText,
      },
    })

    cy.getTestId(testids.submitBtn).should('be.visible').and('contain.text', customText)
  })

  /* ==============================
   * Instruction Text
   * ============================== */
  it('shows instruction text if instructionText prop is set', () => {
    const customText = 'This is custom instruction text'
    mount(KongAuthChangePassword, {
      props: {
        instructionText: customText,
      },
    })

    cy.getTestId(testids.instructionText).should('be.visible').and('have.text', customText)
  })
})
