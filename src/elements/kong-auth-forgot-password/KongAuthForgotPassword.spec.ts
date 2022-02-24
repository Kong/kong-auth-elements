// Import types for custom commands
/// <reference types="../../cypress/support" />

import { mount } from '@cypress/vue'
import KongAuthForgotPassword from '@/elements/kong-auth-forgot-password/KongAuthForgotPassword.ce.vue'
import { helpText } from '@/utils'

// Component data-testid strings
const testids = {
  form: 'kong-auth-forgot-password-form',
  email: 'kong-auth-forgot-password-email',
  submitBtn: 'kong-auth-forgot-password-submit',
  errorMessage: 'kong-auth-error-message',
  successMessage: 'kong-auth-forgot-password-success-message',
  instructionText: 'kong-auth-forgot-password-instruction-text',
  loginLink: 'kong-auth-forgot-password-return-to-login-link',
  injectedStyles: 'kong-auth-injected-styles',
}

const user = {
  email: 'user1@email.com',
}

describe('KongAuthForgotPassword.ce.vue', () => {
  // Required for all Custom Elements
  it('has proper structure and required classes', () => {
    mount(KongAuthForgotPassword)

    // Should have .kong-auth-element as parent class
    const elementDiv = cy.get('.kong-auth-element')
    elementDiv.should('not.be.empty')

    // Should have BaseCustomElement as a child component
    elementDiv.find('.base-custom-element').should('be.visible').and('not.be.empty')
  })

  it('renders a forgot password form with email and button elements', () => {
    mount(KongAuthForgotPassword)

    // Form should exist
    cy.getTestId(testids.form).should('be.visible')
    cy.getTestId(testids.form).within(() => {
      // Elements should exist
      cy.getTestId(testids.email).should('be.visible')
      cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')
    })
    // Elements should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.successMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
    cy.getTestId(testids.loginLink).should('not.exist')
  })

  it('prevents submit and shows error if email field is empty', () => {
    mount(KongAuthForgotPassword)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it("emits a 'click-login-link' event when user clicks login link", () => {
    mount(KongAuthForgotPassword, {
      props: {
        showLoginLink: true,
      },
    })

    cy.getTestId(testids.loginLink).click().then(() => {
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', 'click-login-link')
    })
  })

  it("shows success message and emits a 'forgot-password-success' event with payload on successful password reset request", () => {
    cy.intercept('POST', '**/password-resets', {
      statusCode: 200,
    }).as('password-reset-request')

    mount(KongAuthForgotPassword)

    cy.getTestId(testids.email).type(user.email)
    cy.getTestId(testids.form).submit()

    const eventName = 'forgot-password-success'

    cy.wait('@password-reset-request').then(() => {
      // Check for emitted event
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', eventName).then(() => {
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'email')
      })

      // Success messsage should exist
      cy.getTestId(testids.successMessage).should('be.visible').and('contain.text', helpText.forgotPassword.success)
    })
  })

  it("shows success message and emits a 'forgot-password-success' event with payload on successful password reset request from a custom endpoint", () => {
    const customEndpoint = '/custom-forgot-password-request'

    cy.intercept('POST', `**${customEndpoint}`, {
      statusCode: 200,
    }).as('password-reset-request')

    mount(KongAuthForgotPassword, {
      props: {
        resetPasswordRequestEndpoint: customEndpoint,
      },
    })

    cy.getTestId(testids.email).type(user.email)
    cy.getTestId(testids.form).submit()

    const eventName = 'forgot-password-success'

    cy.wait('@password-reset-request').then(() => {
      // Check for emitted event
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', eventName).then(() => {
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'email')
      })

      // Success messsage should exist
      cy.getTestId(testids.successMessage).should('be.visible').and('contain.text', helpText.forgotPassword.success)
    })
  })

  /* ==============================
   * Instruction Text
   * ============================== */
  it('shows instruction text if instructionText prop is set', () => {
    const customText = 'This is custom instruction text'
    mount(KongAuthForgotPassword, {
      props: {
        instructionText: customText,
      },
    })

    cy.getTestId(testids.instructionText).should('be.visible').and('have.text', customText)
  })

  /* ==============================
  * Login link
  * ============================== */
  it('shows a login link if showLoginLink prop is true', () => {
    mount(KongAuthForgotPassword, {
      props: {
        showLoginLink: true,
      },
    })

    cy.getTestId(testids.loginLink).should('be.visible')
  })

  it('customizes the login link link text if props are set', () => {
    const customText = 'This is custom link text'
    mount(KongAuthForgotPassword, {
      props: {
        showLoginLink: true,
        loginLinkText: customText,
      },
    })

    cy.getTestId(testids.loginLink).should('be.visible').and('have.text', customText)
  })
})
