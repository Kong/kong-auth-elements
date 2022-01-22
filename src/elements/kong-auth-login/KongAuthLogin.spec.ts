import { mount } from '@cypress/vue'
import KongAuthLogin from '@/elements/kong-auth-login/KongAuthLogin.ce.vue'

/**
   * @description Find an element based on the 'data-testid' attribute
   * @param {string} selector Value of 'data-testid' attribute
   * @return {*}  {HTMLElement}
   */
const findByTestId = (selector: string) => {
  const dataSelector = `[data-testid='${selector}']`
  return cy.get(dataSelector)
}

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

describe('KongAuthLogin.ce.vue', () => {
  // Required for all Custom Elements
  it('has proper structure with required classes', () => {
    mount(KongAuthLogin)

    // Should have .kong-auth-element as parent class
    const elementDiv = cy.get('.kong-auth-element')
    elementDiv.should('not.be.empty')

    // Should have BaseCustomElement as a child component
    elementDiv.find('base-custom-element').should('not.be.empty')

    // Should have injected styles
    findByTestId(testids.injectedStyles).should('not.be.empty')
  })

  it('renders a login form with email, password, and button elements', () => {
    mount(KongAuthLogin)

    // Form should exist
    findByTestId(testids.form).should('be.visible')
    findByTestId(testids.form).within(() => {
      // Elements should exist
      findByTestId(testids.email).should('be.visible')
      findByTestId(testids.password).should('be.visible')
      findByTestId(testids.submitBtn).should('be.visible')
    })
    // Elements should not exist
    findByTestId(testids.errorMessage).should('not.exist')
    findByTestId(testids.instructionText).should('not.exist')
    findByTestId(testids.forgotPasswordLink).should('not.exist')
    findByTestId(testids.registerHelpText).should('not.exist')
    findByTestId(testids.registerLink).should('not.exist')
  })

  it('prevents submit and shows error if email field is empty', () => {
    mount(KongAuthLogin)

    // Error should not exist
    findByTestId(testids.errorMessage).should('not.exist')

    // Only type a password
    findByTestId(testids.password).type('not-a-real-password')
    findByTestId(testids.form).submit()

    // Error should exist
    findByTestId(testids.errorMessage).should('be.visible')
  })

  it('prevents submit and shows error if password field is empty', () => {
    mount(KongAuthLogin)

    // Error should not exist
    findByTestId(testids.errorMessage).should('not.exist')

    // Only type an email
    findByTestId(testids.email).type('user1@email.com')
    findByTestId(testids.form).submit()

    // Error should exist
    findByTestId(testids.errorMessage).should('be.visible')
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

    findByTestId(testids.instructionText).should('be.visible').should('have.text', customText)
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

    findByTestId(testids.forgotPasswordLink).should('be.visible')
  })

  it('customizes the forgot password link text if props are set', () => {
    const customText = 'This is custom link text'
    mount(KongAuthLogin, {
      props: {
        showForgotPasswordLink: true,
        forgotPasswordLinkText: customText,
      },
    })

    findByTestId(testids.forgotPasswordLink).should('be.visible').should('have.text', customText)
  })

  it('emits an event when user clicks forgot password link', () => {
    mount(KongAuthLogin, {
      props: {
        showForgotPasswordLink: true,
      },
    })

    findByTestId(testids.forgotPasswordLink).click().then(() => {
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

    findByTestId(testids.registerHelpText).should('be.visible')
    findByTestId(testids.registerLink).should('be.visible')
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

    findByTestId(testids.registerHelpText).should('be.visible').should('have.text', customHelpText)
    findByTestId(testids.registerLink).should('be.visible').should('have.text', customText)
  })

  it('emits an event when user clicks register link', () => {
    mount(KongAuthLogin, {
      props: {
        showRegisterLink: true,
      },
    })

    findByTestId(testids.registerLink).click().then(() => {
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', 'click-register-link')
    })
  })
})
