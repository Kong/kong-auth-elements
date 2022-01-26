// Import types for custom commands
/// <reference types="../../cypress/support" />

import { mount } from '@cypress/vue'
import KongAuthRegister from '@/elements/kong-auth-register/KongAuthRegister.ce.vue'
import helpText from '@/utils/helpText'

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

const requiredFields = [testids.fullName, testids.organization, testids.email, testids.password, testids.agreeCheckbox]

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
      cy.getTestId(testids.submitBtn).should('be.visible').should('be.disabled')
    })
    // Elements should not exist
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

      cy.getTestId(testids.submitBtn).should('be.visible').should('be.disabled')

      // Submit
      cy.getTestId(testids.form).submit()

      // Error should exist
      cy.getTestId(testids.errorMessage).should('be.visible').should('contain.text', helpText.general.missingInfo)
    })
  })

  it('requires an access code if set by the client config API endpoint')

  it('prevents submit and shows error if an access code is required and the user did not provide one')

  it("emits a 'register-success' event with a payload on successful registration", () => {
    cy.intercept('POST', '**/register', {
      body: {
        organizationID: '187e2b65-ec69-421c-a7ba-3e946c4e5077',
      },
    }).as('register-request')

    mount(KongAuthRegister)

    cy.getTestId(testids.fullName).type('Player One')
    cy.getTestId(testids.organization).type('Test Organization')
    cy.getTestId(testids.email).type('user1@email.com')
    cy.getTestId(testids.password).type('TestPassword1!')
    cy.getTestId(testids.agreeCheckbox).check()
    cy.getTestId(testids.form).submit()

    const eventName = 'register-success'

    cy.wait('@register-request').its('response.body').should('have.property', 'organizationID').then(() => {
      // Check for emitted event
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', eventName).then(() => {
        // Verify emit payload
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'email')
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'fromInvite')
      })
    })
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

    cy.getTestId(testids.instructionText).should('be.visible').should('have.text', customText)
  })
})
