// Import types for custom commands
/// <reference types="../../cypress/support" />

import { mount } from '@cypress/vue'
import KongAuthLogin from './KongAuthLogin.ce.vue'
import { win } from '../../utils'
import { getConfigOptions } from '../../composables/useConfigOptions'
import useI18n from '../../composables/useI18n'

const { messages } = useI18n('en')

// Component data-testid strings
const testids = {
  form: 'kong-auth-login-form',
  email: 'kong-auth-login-email',
  password: 'kong-auth-login-password',
  submitBtn: 'kong-auth-login-submit',
  ssoBtn: 'kong-auth-login-sso',
  basicAuthLink: 'kong-auth-login-basic-auth-link',
  errorMessage: 'kong-auth-error-message',
  instructionText: 'kong-auth-login-instruction-text',
  forgotPasswordLink: 'kong-auth-login-forgot-password-link',
  registerLink: 'kong-auth-login-register-link',
  registerHelpText: 'kong-auth-login-register-help-text',
  injectedStyles: 'kong-auth-injected-styles',
  passwordResetMessage: 'kong-auth-login-password-reset-message',
  confirmedEmailMessage: 'kong-auth-login-confirmed-email-message',
  registerSuccessMessage: 'kong-auth-login-register-success-message',
  loaderContainer: 'kong-auth-login-gruce-loader',
  gruceLoader: 'full-screen-loader',
  genericSpinnerLoader: 'full-screen-spinner-loader',
}

const user = {
  email: 'user1@email.com',
  password: 'TestPassword1!',
}

describe('KongAuthLogin.ce.vue', () => {
  // Required for all Custom Elements
  it('has proper structure and required classes', () => {
    mount(KongAuthLogin)

    // Should have .kong-auth-element as parent class
    cy.get('.kong-auth-element').should('be.visible').and('not.be.empty')
  })

  it('renders a login form with email, password, and button elements if only basic auth is enabled', () => {
    mount(KongAuthLogin, {
      props: {
        basicAuthLoginEnabled: true,
        idpLoginEnabled: false,
      },
    })

    // Form should exist
    cy.getTestId(testids.form).should('be.visible')
    cy.getTestId(testids.password).should('be.visible')
    cy.getTestId(testids.form).within(() => {
      // Elements should exist
      cy.getTestId(testids.email).should('be.visible')
      cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')
    })
    // Elements should not exist
    cy.getTestId(testids.ssoBtn).should('not.exist')
    cy.getTestId(testids.basicAuthLink).should('not.exist')
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
    cy.getTestId(testids.forgotPasswordLink).should('not.exist')
    cy.getTestId(testids.registerHelpText).should('not.exist')
    cy.getTestId(testids.registerLink).should('not.exist')
    cy.getTestId(testids.passwordResetMessage).should('not.exist')
    cy.getTestId(testids.confirmedEmailMessage).should('not.exist')
    cy.getTestId(testids.registerSuccessMessage).should('not.exist')
    cy.getTestId(testids.loaderContainer).should('not.exist')
  })

  it('renders a login form with email, password, and button elements and no SSO button if basic auth and IdP login is enabled and userEntity is \'user\'', () => {
    cy.stub(getConfigOptions, 'userEntity').returns('user')
    mount(KongAuthLogin, {
      props: {
        basicAuthLoginEnabled: true,
        idpLoginEnabled: true,
      },
    })

    // Form should exist
    cy.getTestId(testids.form).should('be.visible')
    cy.getTestId(testids.form).within(() => {
      // Elements should exist
      cy.getTestId(testids.email).should('be.visible')
      cy.getTestId(testids.password).should('be.visible')
      cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')
    })
    // Elements should not exist
    cy.getTestId(testids.ssoBtn).should('not.exist')
    cy.getTestId(testids.basicAuthLink).should('not.exist')
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
    cy.getTestId(testids.forgotPasswordLink).should('not.exist')
    cy.getTestId(testids.registerHelpText).should('not.exist')
    cy.getTestId(testids.registerLink).should('not.exist')
    cy.getTestId(testids.passwordResetMessage).should('not.exist')
    cy.getTestId(testids.confirmedEmailMessage).should('not.exist')
    cy.getTestId(testids.registerSuccessMessage).should('not.exist')
    cy.getTestId(testids.loaderContainer).should('not.exist')
  })

  it('renders a login form with email, password, and button elements and a SSO button if basic auth and IdP login is enabled and userEntity is \'developer\'', () => {
    cy.stub(getConfigOptions, 'userEntity').returns('developer')
    mount(KongAuthLogin, {
      props: {
        basicAuthLoginEnabled: true,
        idpLoginEnabled: true,
      },
    })

    // Form should exist
    cy.getTestId(testids.form).should('be.visible')
    cy.getTestId(testids.ssoBtn).should('be.visible')
    cy.getTestId(testids.form).within(() => {
      // Elements should exist
      cy.getTestId(testids.email).should('be.visible')
      cy.getTestId(testids.password).should('be.visible')
      cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')
    })
    // Elements should not exist
    cy.getTestId(testids.basicAuthLink).should('not.exist')
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
    cy.getTestId(testids.forgotPasswordLink).should('not.exist')
    cy.getTestId(testids.registerHelpText).should('not.exist')
    cy.getTestId(testids.registerLink).should('not.exist')
    cy.getTestId(testids.passwordResetMessage).should('not.exist')
    cy.getTestId(testids.confirmedEmailMessage).should('not.exist')
    cy.getTestId(testids.registerSuccessMessage).should('not.exist')
    cy.getTestId(testids.loaderContainer).should('not.exist')
  })

  it('renders a SSO button and no basic auth form if only SSO login is enabled and userEntity = \'user\' and they are at a login path', () => {
    cy.stub(getConfigOptions, 'userEntity').returns('user')
    const loginPath = 'test-login-path'
    // Stub URL path
    cy.stub(win, 'getLocationPathname').returns(`/login/${loginPath}`)
    cy.stub(win, 'setLocationHref').as('set-location')
    mount(KongAuthLogin, {
      props: {
        basicAuthLoginEnabled: false,
        idpLoginEnabled: true,
      },
    })

    // SSO button and basic auth link should exist
    cy.getTestId(testids.ssoBtn).should('be.visible')
    cy.getTestId(testids.basicAuthLink).should('be.visible')
    // Elements should not exist
    cy.getTestId(testids.form).should('not.exist')
    cy.getTestId(testids.submitBtn).should('not.exist')
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
    cy.getTestId(testids.forgotPasswordLink).should('not.exist')
    cy.getTestId(testids.registerHelpText).should('not.exist')
    cy.getTestId(testids.registerLink).should('not.exist')
    cy.getTestId(testids.passwordResetMessage).should('not.exist')
    cy.getTestId(testids.confirmedEmailMessage).should('not.exist')
    cy.getTestId(testids.registerSuccessMessage).should('not.exist')
    cy.getTestId(testids.loaderContainer).should('not.exist')
  })

  it('renders a SSO button and no basic auth form and hides the basic auth link if the `showBasicAuthLoginLink` prop is set to false', () => {
    cy.stub(getConfigOptions, 'userEntity').returns('user')
    const loginPath = 'test-login-path'
    // Stub URL path
    cy.stub(win, 'getLocationPathname').returns(`/login/${loginPath}`)
    cy.stub(win, 'setLocationHref').as('set-location')
    mount(KongAuthLogin, {
      props: {
        basicAuthLoginEnabled: false,
        showBasicAuthLoginLink: false,
        idpLoginEnabled: true,
      },
    })

    // SSO button should exist
    cy.getTestId(testids.ssoBtn).should('be.visible')
    // Basic auth link should not exist
    cy.getTestId(testids.basicAuthLink).should('not.exist')
    // Elements should not exist
    cy.getTestId(testids.form).should('not.exist')
    cy.getTestId(testids.submitBtn).should('not.exist')
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
    cy.getTestId(testids.forgotPasswordLink).should('not.exist')
    cy.getTestId(testids.registerHelpText).should('not.exist')
    cy.getTestId(testids.registerLink).should('not.exist')
    cy.getTestId(testids.passwordResetMessage).should('not.exist')
    cy.getTestId(testids.confirmedEmailMessage).should('not.exist')
    cy.getTestId(testids.registerSuccessMessage).should('not.exist')
    cy.getTestId(testids.loaderContainer).should('not.exist')
  })

  it('renders a SSO button and no basic auth form if only SSO login is enabled and userEntity = \'developer\'', () => {
    cy.stub(getConfigOptions, 'userEntity').returns('developer')
    mount(KongAuthLogin, {
      props: {
        basicAuthLoginEnabled: false,
        idpLoginEnabled: true,
      },
    })

    // SSO button should exist
    cy.getTestId(testids.ssoBtn).should('be.visible')
    // Elements should not exist
    cy.getTestId(testids.form).should('not.exist')
    cy.getTestId(testids.submitBtn).should('not.exist')
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
    cy.getTestId(testids.forgotPasswordLink).should('not.exist')
    cy.getTestId(testids.registerHelpText).should('not.exist')
    cy.getTestId(testids.registerLink).should('not.exist')
    cy.getTestId(testids.passwordResetMessage).should('not.exist')
    cy.getTestId(testids.confirmedEmailMessage).should('not.exist')
    cy.getTestId(testids.registerSuccessMessage).should('not.exist')
    cy.getTestId(testids.loaderContainer).should('not.exist')
  })

  it('renders a SSO button and does not display form or basic auth link if only SSO login is enabled and userEntity is developer', () => {
    cy.stub(getConfigOptions, 'userEntity').returns('developer')

    mount(KongAuthLogin, {
      props: {
        basicAuthLoginEnabled: false,
        idpLoginEnabled: true,
      },
    })

    // SSO button should exist
    cy.getTestId(testids.ssoBtn).should('be.visible')
    // Elements should not exist
    cy.getTestId(testids.form).should('not.exist')
    cy.getTestId(testids.basicAuthLink).should('not.exist')
  })

  it('prevents submit and shows error if email field is empty', () => {
    mount(KongAuthLogin)

    // Error should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')

    // Only type a password
    cy.getTestId(testids.password).type(user.password)

    cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')

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
    cy.getTestId(testids.email).type(user.email)

    cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible')
  })

  it("emits a 'login-success' event on successful user login", () => {
    cy.intercept('POST', '**/authenticate', {
      statusCode: 200,
    }).as('login-request')

    mount(KongAuthLogin)

    cy.getTestId(testids.email).type(user.email)
    cy.getTestId(testids.password).type(user.password)
    cy.getTestId(testids.form).submit()

    cy.wait('@login-request').then(() => {
      // Check for emitted event
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', 'login-success')
    })
  })

  it("emits a 'login-success' event on successful developer login", () => {
    // Stub userEntity
    cy.stub(getConfigOptions, 'userEntity').returns('developer')

    cy.intercept('POST', '**/developer/authenticate', {
      statusCode: 200,
    }).as('login-request')

    mount(KongAuthLogin)

    cy.getTestId(testids.email).type(user.email)
    cy.getTestId(testids.password).type(user.password)
    cy.getTestId(testids.form).submit()

    cy.wait('@login-request').then(() => {
      // Check for emitted event
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', 'login-success')
    })
  })

  it('utilizes a provided custom error handler for a failed authentication request', () => {
    const customErrorMessage = 'A custom error message.'

    // Stub customErrorHandler
    cy.stub(getConfigOptions, 'customErrorHandler').returns(() => customErrorMessage)

    cy.intercept('POST', '**/authenticate', {
      statusCode: 401,
    }).as('login-request')

    mount(KongAuthLogin)

    cy.getTestId(testids.email).type(user.email)
    cy.getTestId(testids.password).type(user.password)
    cy.getTestId(testids.form).submit()

    cy.wait('@login-request').then(() => {
      // Custom error messsage should exist
      cy.getTestId(testids.errorMessage).should('be.visible').and('contain.text', customErrorMessage)
    })
  })

  describe('Respond to URL Parameters', () => {
    it('pre-populates the email input from search params', () => {
      // Stub search params
      cy.stub(win, 'getLocationSearch').returns(`?email=${encodeURIComponent(user.email)}`)

      mount(KongAuthLogin)

      // Email input should be pre-populated
      cy.getTestId(testids.email).should('have.value', user.email)
    })

    it("should verify user email and emit 'verify-email-success' event if query params include 'token'", () => {
      // Stub search params
      cy.stub(win, 'getLocationSearch').returns('?token=12345')

      cy.intercept('PATCH', '**/email-verifications', {
        statusCode: 200,
        body: {
          email: user.email,
        },
      }).as('email-verification-request')

      mount(KongAuthLogin)

      const eventName = 'verify-email-success'

      // Loader should show on load
      cy.getTestId(testids.loaderContainer).should('exist').getTestId(testids.gruceLoader).should('be.visible')

      cy.wait('@email-verification-request').then(() => {
        // Verify UI
        cy.getTestId(testids.loaderContainer).should('not.exist')
        cy.getTestId(testids.confirmedEmailMessage).should('be.visible').and('contain.text', messages.login.confirmedEmailSuccess)
        cy.getTestId(testids.email).should('have.value', user.email)

        // Check for emitted event
        cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', eventName).then(() => {
          // Verify emit payload
          cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'email')
        })
      })
    })

    it('utilizes a provided custom error handler for a failed email verification request', () => {
      const customErrorMessage = 'A custom error message.'

      // Stub customErrorHandler
      cy.stub(getConfigOptions, 'customErrorHandler').returns(() => customErrorMessage)

      // Stub search params
      cy.stub(win, 'getLocationSearch').returns('?token=12345')

      cy.intercept('PATCH', '**/email-verifications', {
        statusCode: 400,
        body: {
          email: user.email,
        },
      }).as('email-verification-request')

      mount(KongAuthLogin)

      cy.wait('@email-verification-request').then(() => {
      // Custom error messsage should exist
        cy.getTestId(testids.errorMessage).should('be.visible').and('contain.text', customErrorMessage)
      })
    })

    it("should verify developer email and emit 'verify-email-success' event if query params include 'token'", () => {
      // Stub userEntity
      cy.stub(getConfigOptions, 'userEntity').returns('developer')

      // Stub search params
      cy.stub(win, 'getLocationSearch').returns('?token=12345')

      cy.intercept('POST', '**/developer/verify-email', {
        statusCode: 200,
        body: {
          email: user.email,
        },
      }).as('email-verification-request')

      mount(KongAuthLogin)

      const eventName = 'verify-email-success'

      // Loader should show on load
      cy.getTestId(testids.loaderContainer).should('exist').getTestId(testids.genericSpinnerLoader).should('be.visible')

      cy.wait('@email-verification-request').then(() => {
        // Verify UI
        cy.getTestId(testids.loaderContainer).should('not.exist')
        cy.getTestId(testids.confirmedEmailMessage).should('be.visible').and('contain.text', messages.login.confirmedEmailSuccess)
        cy.getTestId(testids.email).should('have.value', user.email)

        // Check for emitted event
        cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', eventName).then(() => {
          // Verify emit payload
          cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'email')
        })
      })
    })

    it("should show password reset message if query params include 'passwordReset'", () => {
      // Stub search params
      cy.stub(win, 'getLocationSearch').returns('?passwordReset=true')

      mount(KongAuthLogin)

      cy.getTestId(testids.passwordResetMessage).should('be.visible').and('contain.text', messages.login.passwordResetSuccess)
    })

    it("should show register success message if query params include 'registered'", () => {
      // Stub search params
      cy.stub(win, 'getLocationSearch').returns('?registered=true')

      mount(KongAuthLogin)

      cy.getTestId(testids.registerSuccessMessage).should('be.visible').and('contain.text', messages.login.registerSuccess)
    })

    it('should customize the register success message if registerSuccessText prop is set', () => {
      // Stub search params
      cy.stub(win, 'getLocationSearch').returns('?registered=true')

      const customSuccessText = 'Successfully registered! Check your email to confirm your account'

      mount(KongAuthLogin, {
        props: {
          registerSuccessText: customSuccessText,
        },
      })

      cy.getTestId(testids.registerSuccessMessage).should('be.visible').and('contain.text', customSuccessText)
    })

    it('should show basic auth form if basicAuth=true is in query string regardless of being enabled', () => {
      // Stub search params
      cy.stub(win, 'getLocationSearch').returns('?basicAuth=true')

      mount(KongAuthLogin, {
        props: {
          basicAuthLoginEnabled: false,
          idpLoginEnabled: true,
        },
      })

      cy.getTestId(testids.form).should('be.visible')
      cy.getTestId(testids.form).within(() => {
      // Elements should exist
        cy.getTestId(testids.email).should('be.visible')
        cy.getTestId(testids.password).should('be.visible')
        cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')
      })
      // Elements should not exist
      cy.getTestId(testids.basicAuthLink).should('not.exist')
    })
  })

  /* ==============================
   * IdP Login Flow
   * ============================== */
  describe('IdP Login', () => {
    it("should initiate user IdP login if props are set and URL is '/login/{login-path}'", () => {
      cy.stub(getConfigOptions, 'userEntity').returns('user')
      const loginPath = 'test-login-path'
      const callbackUrl = 'https://cloud.konghq.tech/login'
      const redirectPath = `/authenticate/${loginPath}?returnTo=${encodeURIComponent(win.getLocationOrigin() + '/')}&callback_url=${encodeURIComponent(callbackUrl)}`
      // Stub URL path
      cy.stub(win, 'getLocationPathname').returns(`/login/${loginPath}`)

      cy.stub(win, 'setLocationHref', args => {
        console.log('args', args)
      }).as('set-location')

      mount(KongAuthLogin, {
        props: {
          idpLoginEnabled: true,
          idpLoginReturnTo: win.getLocationOrigin(),
          idpLoginCallbackUrl: callbackUrl,
        },
      })

      cy.get('@set-location').should('have.been.calledOnce').and('have.been.calledWithMatch', redirectPath)
      cy.getTestId(testids.loaderContainer).should('exist').getTestId(testids.gruceLoader).should('be.visible')
    })

    it('should not show full screen loader during IdP login flow if `idpFullScreenLoader` prop is false', () => {
      cy.stub(getConfigOptions, 'userEntity').returns('user')
      const loginPath = 'test-login-path'
      const callbackUrl = 'https://cloud.konghq.tech/login'
      const redirectPath = `/authenticate/${loginPath}?returnTo=${encodeURIComponent(win.getLocationOrigin() + '/')}&callback_url=${encodeURIComponent(callbackUrl)}`
      // Stub URL path
      cy.stub(win, 'getLocationPathname').returns(`/login/${loginPath}`)

      cy.stub(win, 'setLocationHref', args => {
        console.log('args', args)
      }).as('set-location')

      mount(KongAuthLogin, {
        props: {
          idpLoginEnabled: true,
          idpLoginReturnTo: win.getLocationOrigin(),
          idpLoginCallbackUrl: callbackUrl,
          idpFullScreenLoader: false,
        },
      })

      cy.get('@set-location').should('have.been.calledOnce').and('have.been.calledWithMatch', redirectPath)
      cy.getTestId(testids.loaderContainer).should('not.exist')
      cy.getTestId(testids.gruceLoader).should('not.exist')
    })

    it("should initiate developer IdP login if props are set and URL is '/login/sso'", () => {
      const portalId = '12345-67890'
      cy.stub(getConfigOptions, 'userEntity').returns('developer')
      cy.stub(getConfigOptions, 'developerConfig').returns({
        portalId,
      })
      cy.stub(win, 'getLocationPathname').returns('/login/sso')
      cy.stub(win, 'setLocationHref').as('set-location')
      // Stub URL path
      const redirectPath = `/developer/authenticate/sso?returnTo=${encodeURIComponent(win.getLocationOrigin() + '/')}`

      mount(KongAuthLogin, {
        props: {
          basicAuthLoginEnabled: false,
          idpLoginEnabled: true,
          idpLoginReturnTo: win.getLocationOrigin(),
        },
      })

      cy.get('@set-location').should('have.been.calledOnce').and('have.been.calledWithMatch', redirectPath)
      cy.getTestId(testids.loaderContainer).should('exist').getTestId(testids.genericSpinnerLoader).should('be.visible')
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

    cy.getTestId(testids.instructionText).should('be.visible').and('have.text', customText)
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

    cy.getTestId(testids.forgotPasswordLink).should('be.visible').and('have.text', customText)
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

    cy.getTestId(testids.registerHelpText).should('be.visible').and('contain.text', customHelpText)
    cy.getTestId(testids.registerLink).should('be.visible').and('contain.text', customText)
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
})
