// Import types for custom commands
/// <reference types="../../cypress/support" />

import { mount } from '@cypress/vue'
import KongAuthLogin from '@/elements/kong-auth-login/KongAuthLogin.ce.vue'
import { win } from '@/utils'

// Component data-testid strings
const testids = {
  form: 'kong-auth-login-form',
  email: 'kong-auth-login-email',
  password: 'kong-auth-login-password',
  submitBtn: 'kong-auth-login-submit',
  errorMessage: 'kong-auth-error-message',
  instructionText: 'kong-auth-login-instruction-text',
  forgotPasswordLink: 'kong-auth-login-forgot-password-link',
  registerLink: 'kong-auth-login-register-link',
  registerHelpText: 'kong-auth-login-register-help-text',
  injectedStyles: 'kong-auth-injected-styles',
}

const userEmail = 'user1@email.com'
const userPassword = 'TestPassword1!'

describe('KongAuthLogin.ce.vue', () => {
  // Required for all Custom Elements
  it('has proper structure and required classes', () => {
    mount(KongAuthLogin)

    // Should have .kong-auth-element as parent class
    const elementDiv = cy.get('.kong-auth-element')
    elementDiv.should('not.be.empty')

    // Should have BaseCustomElement as a child component
    elementDiv.find('.base-custom-element').should('not.be.empty')

    // Should have injected styles
    cy.getTestId(testids.injectedStyles).should('not.be.empty')
  })

  it('renders a login form with email, password, and button elements', () => {
    mount(KongAuthLogin)

    // Form should exist
    cy.getTestId(testids.form).should('be.visible')
    cy.getTestId(testids.form).within(() => {
      // Elements should exist
      cy.getTestId(testids.email).should('be.visible')
      cy.getTestId(testids.password).should('be.visible')
      cy.getTestId(testids.submitBtn).should('be.visible').should('be.disabled')
    })
    // Elements should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
    cy.getTestId(testids.forgotPasswordLink).should('not.exist')
    cy.getTestId(testids.registerHelpText).should('not.exist')
    cy.getTestId(testids.registerLink).should('not.exist')
  })

  it('prevents submit and shows error if email field is empty', () => {
    mount(KongAuthLogin)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    // Only type a password
    cy.getTestId(testids.password).type('not-a-real-password')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it('prevents submit and shows error if password field is empty', () => {
    mount(KongAuthLogin)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    // Only type an email
    cy.getTestId(testids.email).type(userEmail)

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it("emits a 'login-success' event on successful login", () => {
    mount(KongAuthLogin)

    cy.intercept('POST', '**/authenticate', {
      statusCode: 200,
    }).as('login-request')

    cy.getTestId(testids.email).type(userEmail)
    cy.getTestId(testids.password).type(userPassword)
    cy.getTestId(testids.form).submit()

    cy.wait('@login-request').then(() => {
      // Check for emitted event
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', 'login-success')
    })
  })

  /* ==============================
   * Instruction Text
   * ============================== */
  it('shows instruction text if instructionText prop is set', () => {
    const customText = 'This is custom instruction text'
    mount(KongAuthLogin, {
      props: {
        instructionText: customText,
      },
    })

    cy.getTestId(testids.instructionText).should('be.visible').should('have.text', customText)
  })

  /* ==============================
  * Forgot password link
  * ============================== */
  it('shows a forgot password link if showForgotPasswordLink prop is true', () => {
    mount(KongAuthLogin, {
      props: {
        showForgotPasswordLink: true,
      },
    })

    cy.getTestId(testids.forgotPasswordLink).should('be.visible')
  })

  it('customizes the forgot password link text if props are set', () => {
    const customText = 'This is custom link text'
    mount(KongAuthLogin, {
      props: {
        showForgotPasswordLink: true,
        forgotPasswordLinkText: customText,
      },
    })

    cy.getTestId(testids.forgotPasswordLink).should('be.visible').should('have.text', customText)
  })

  it('emits an event when user clicks forgot password link', () => {
    mount(KongAuthLogin, {
      props: {
        showForgotPasswordLink: true,
      },
    })

    cy.getTestId(testids.forgotPasswordLink).click().then(() => {
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', 'click-forgot-password-link')
    })
  })

  /* ==============================
   * Register link
   * ============================== */
  it('shows a register link if showRegisterLink prop is true', () => {
    mount(KongAuthLogin, {
      props: {
        showRegisterLink: true,
      },
    })

    cy.getTestId(testids.registerHelpText).should('be.visible')
    cy.getTestId(testids.registerLink).should('be.visible')
  })

  it('customizes the register link text if props are set', () => {
    const customText = 'This is custom link text'
    const customHelpText = 'This is custom help text'
    mount(KongAuthLogin, {
      props: {
        showRegisterLink: true,
        registerLinkHelpText: customHelpText,
        registerLinkText: customText,
      },
    })

    cy.getTestId(testids.registerHelpText).should('be.visible').should('have.text', customHelpText)
    cy.getTestId(testids.registerLink).should('be.visible').should('have.text', customText)
  })

  it('emits an event when user clicks register link', () => {
    mount(KongAuthLogin, {
      props: {
        showRegisterLink: true,
      },
    })

    cy.getTestId(testids.registerLink).click().then(() => {
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', 'click-register-link')
    })
  })

  it('fills the email input using search params', () => {
    cy.stub(win, 'getLocationSearch').returns(`?email=${userEmail}`)

    mount(KongAuthLogin)

    cy.getTestId(testids.email).should('have.value', userEmail)
  })
})
