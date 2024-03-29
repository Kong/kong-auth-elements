/* eslint-disable @typescript-eslint/ban-ts-comment */

// Import types for custom commands
/// <reference types="../../cypress/support" />

import { mount } from '@cypress/vue'
import KongAuthRegister from './KongAuthRegister.ce.vue'
import { win } from '../../utils'
import { getConfigOptions } from '../../composables/useConfigOptions'
import useI18n from '../../composables/useI18n'

const { messages } = useI18n('en')

// Component data-testid strings
const testids = {
  form: 'kong-auth-register-form',
  fullName: 'kong-auth-register-full-name',
  region: 'kong-auth-register-region',
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

const user = {
  name: 'Player One',
  email: 'user1@email.com',
  org: 'Test Organization',
  password: 'TestPassword1!',
}

const requiredFields = [testids.fullName, testids.organization, testids.email, testids.password, testids.agreeCheckbox]

describe('KongAuthRegister.ce.vue', () => {
  // Required for all Custom Elements
  it('has proper structure and required classes', () => {
    mount(KongAuthRegister)

    // Should have .kong-auth-element as parent class
    cy.get('.kong-auth-element').should('be.visible').and('not.be.empty')
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
      cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')
    })
    // Elements should not exist
    cy.getTestId(testids.region).should('not.exist')
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
    cy.getTestId(testids.accessCode).should('not.exist')
  })

  it("renders a register form with hidden fields if userEntity is 'developer'", () => {
    // Stub userEntity
    cy.stub(getConfigOptions, 'userEntity').returns('developer')

    mount(KongAuthRegister)

    // Form should exist
    cy.getTestId(testids.form).should('be.visible')
    cy.getTestId(testids.form).within(() => {
      // Elements should exist
      cy.getTestId(testids.fullName).should('be.visible')
      cy.getTestId(testids.email).should('be.visible')
      cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')
    })
    // Elements should not exist
    cy.getTestId(testids.organization).should('not.exist')
    cy.getTestId(testids.region).should('not.exist')
    cy.getTestId(testids.password).should('not.exist')
    cy.getTestId(testids.agreeCheckbox).should('not.exist')
    cy.getTestId(testids.errorMessage).should('not.exist')
    cy.getTestId(testids.instructionText).should('not.exist')
    cy.getTestId(testids.accessCode).should('not.exist')
  })

  // Loop through required fields and ensure form cannot be submitted if any are blank/unchecked
  requiredFields.forEach((requiredField) => {
    const requiredFieldName = requiredField.replace(/kong-auth-register-/gi, '')

    it(`prevents submit and shows error if ${requiredFieldName} field is ${requiredField === testids.agreeCheckbox ? 'unchecked' : 'blank'}`, () => {
      mount(KongAuthRegister)

      // Error should not exist
      cy.getTestId(testids.errorMessage).should('not.exist')

      requiredFields.filter(field => field !== requiredField).forEach(field => {
        if (field === testids.agreeCheckbox) {
          cy.getTestId(field).check()
        } else {
          cy.getTestId(field).type('This is fake field text')
        }
      })

      cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')

      // Submit
      cy.getTestId(testids.form).submit()

      // Error should exist
      cy.getTestId(testids.errorMessage).should('be.visible').and('contain.text', messages.general.missingInfo)
    })
  })

  it("shows and requires an access code if set by the 'accessCodeRequired' prop", () => {
    mount(KongAuthRegister, {
      props: {
        accessCodeRequired: true,
      },
    })

    // Access code field should be visible
    cy.getTestId(testids.accessCode).should('be.visible')

    // Fill out all fields other than access code
    requiredFields.forEach(field => {
      if (field === testids.agreeCheckbox) {
        cy.getTestId(field).check()
      } else {
        cy.getTestId(field).type('This is fake field text')
      }
    })

    cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('be.visible').and('contain.text', messages.general.missingInfo)
  })

  it("emits a 'register-success' event with a payload on successful registration", () => {
    cy.intercept('POST', '**/register', {
      statusCode: 200,
      body: {
        organizationID: '187e2b65-ec69-421c-a7ba-3e946c4e5077',
      },
    }).as('register-request')

    mount(KongAuthRegister)

    cy.getTestId(testids.fullName).type(user.name)
    cy.getTestId(testids.organization).type(user.org)
    cy.getTestId(testids.email).type(user.email)
    cy.getTestId(testids.password).type(user.password)
    cy.getTestId(testids.agreeCheckbox).check()
    cy.getTestId(testids.form).submit()

    const eventName = 'register-success'

    cy.wait('@register-request').its('response.body').should('have.property', 'organizationID').then(() => {
      // Check for emitted event
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', eventName).then(() => {
        // Verify emit payload
        // @ts-ignore
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'email')
        // @ts-ignore
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'organization')
        // @ts-ignore
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).its('organization').should('have.property', 'id')
        // @ts-ignore
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).its('organization').should('have.property', 'name')
      })
    })
  })

  it("emits a 'register-success' event with a payload on successful developer registration from a custom endpoint", () => {
    // Stub userEntity
    cy.stub(getConfigOptions, 'userEntity').returns('developer')

    const customEndpoint = '/custom-register-request'

    cy.intercept('POST', `**${customEndpoint}`, {
      statusCode: 200,
      body: {
        organizationID: '187e2b65-ec69-421c-a7ba-3e946c4e5077',
      },
    }).as('register-request')

    mount(KongAuthRegister, {
      props: {
        registerRequestEndpoint: customEndpoint,
      },
    })

    cy.getTestId(testids.fullName).type(user.name)
    cy.getTestId(testids.email).type(user.email)
    cy.getTestId(testids.form).submit()

    const eventName = 'register-success'

    cy.wait('@register-request').its('response.body').should('have.property', 'organizationID').then(() => {
      // Check for emitted event
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', eventName).then(() => {
        // Verify emit payload
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'email')
      })
    })
  })

  it('utilizes a provided custom error handler for a register request', () => {
    const customEndpoint = '/custom-register-request'
    const customErrorMessage = 'A custom error message.'

    // Stub userEntity
    cy.stub(getConfigOptions, 'userEntity').returns('developer')
    // Stub customErrorHandler
    cy.stub(getConfigOptions, 'customErrorHandler').returns(() => customErrorMessage)

    cy.intercept('POST', `**${customEndpoint}`, {
      statusCode: 400,
    }).as('register-request')

    mount(KongAuthRegister, {
      props: {
        registerRequestEndpoint: customEndpoint,
      },
    })

    cy.getTestId(testids.fullName).type(user.name)
    cy.getTestId(testids.email).type(user.email)
    cy.getTestId(testids.form).submit()

    cy.wait('@register-request').then(() => {
      // Custom error messsage should exist
      cy.getTestId(testids.errorMessage).should('be.visible').and('contain.text', customErrorMessage)
    })
  })

  /* ==============================
   * Register Button Text
   * ============================== */
  it('customizes the register button text if registerButtonText prop is set', () => {
    const customText = 'This is custom button text'
    mount(KongAuthRegister, {
      props: {
        registerButtonText: customText,
      },
    })

    cy.getTestId(testids.submitBtn).should('be.visible').and('contain.text', customText)
  })

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

    cy.getTestId(testids.instructionText).should('be.visible').and('have.text', customText)
  })

  describe('Responding to URL Parameters', () => {
    it('shows the region if the URL parameter has selectRegion = true', () => {
      // Stub search params
      cy.stub(win, 'getLocationSearch').returns('?selectRegion=true')

      mount(KongAuthRegister)

      // Form should exist
      cy.getTestId(testids.form).should('be.visible')
      cy.getTestId(testids.form).within(() => {
      // Elements should exist
        cy.getTestId(testids.fullName).should('be.visible')
        cy.getTestId(testids.region).should('be.visible')
        cy.getTestId(testids.organization).should('be.visible')
        cy.getTestId(testids.email).should('be.visible')
        cy.getTestId(testids.password).should('be.visible')
        cy.getTestId(testids.agreeCheckbox).should('be.visible')
        cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')
      })
      // Elements should not exist
      cy.getTestId(testids.errorMessage).should('not.exist')
      cy.getTestId(testids.instructionText).should('not.exist')
      cy.getTestId(testids.accessCode).should('not.exist')
    })
  })
})
