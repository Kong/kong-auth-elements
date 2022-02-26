// Import types for custom commands
/// <reference types="../../cypress/support" />

import { mount } from '@cypress/vue'
import KongAuthRegister from '@/elements/kong-auth-register/KongAuthRegister.ce.vue'
import { helpText, win } from '@/utils'

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
    const elementDiv = cy.get('.kong-auth-element')
    elementDiv.should('not.be.empty')

    // Should have BaseCustomElement as a child component
    elementDiv.find('.base-custom-element').should('be.visible').and('not.be.empty')
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
      cy.getTestId(testids.errorMessage).should('be.visible').and('contain.text', helpText.general.missingInfo)
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
    cy.getTestId(testids.errorMessage).should('be.visible').and('contain.text', helpText.general.missingInfo)
  })

  it('does not require an access code if the user is accepting an invite', () => {
    // Stub search params
    cy.stub(win, 'getLocationSearch').returns(`?token=12345&fullName=${encodeURIComponent(user.name)}&org=${encodeURIComponent(user.org)}&email=${encodeURIComponent(user.email)}`)

    mount(KongAuthRegister, {
      props: {
        accessCodeRequired: false,
      },
    })

    // Access code field should be not be exist
    cy.getTestId(testids.accessCode).should('not.exist')

    cy.getTestId(testids.password).type(user.password)
    cy.getTestId(testids.agreeCheckbox).check()

    cy.getTestId(testids.submitBtn).should('be.visible').and('not.be.disabled')

    // Submit
    cy.getTestId(testids.form).submit()

    // Error should exist
    cy.getTestId(testids.errorMessage).should('not.exist')
  })

  describe('Invites and Responding to URL Parameters', () => {
    it('pre-populates the form from search params', () => {
      // Stub search params
      cy.stub(win, 'getLocationSearch').returns(`?token=12345&fullName=${encodeURIComponent(user.name)}&org=${encodeURIComponent(user.org)}&email=${encodeURIComponent(user.email)}`)

      mount(KongAuthRegister)

      // Inputs should be pre-populated and disabled
      cy.getTestId(testids.fullName).should('have.value', user.name).and('be.disabled')
      cy.getTestId(testids.organization).should('have.value', user.org).and('be.disabled')
      cy.getTestId(testids.email).should('have.value', user.email).and('be.disabled')

      cy.getTestId(testids.password).should('not.be.disabled').and('be.empty')
      cy.getTestId(testids.agreeCheckbox).should('not.be.disabled').and('not.be.checked')
      cy.getTestId(testids.submitBtn).should('be.disabled')
    })

    it('pre-populates the form and accepts an invitation after entering required fields', () => {
      // Stub search params
      cy.stub(win, 'getLocationSearch').returns(`?token=12345&fullName=${encodeURIComponent(user.name)}&org=${encodeURIComponent(user.org)}&email=${encodeURIComponent(user.email)}`)

      cy.intercept('PATCH', '**/accept-invite', {
        statusCode: 200,
      }).as('accept-invite')

      mount(KongAuthRegister, {
        props: {
          accessCodeRequired: true, // Should still allow submit for invitation
        },
      })

      // Inputs should be pre-populated and disabled
      cy.getTestId(testids.fullName).should('have.value', user.name).and('be.disabled')
      cy.getTestId(testids.organization).should('have.value', user.org).and('be.disabled')
      cy.getTestId(testids.email).should('have.value', user.email).and('be.disabled')

      cy.getTestId(testids.password).should('not.be.disabled').and('be.empty')
      cy.getTestId(testids.agreeCheckbox).should('not.be.disabled').and('not.be.checked')
      cy.getTestId(testids.submitBtn).should('be.disabled')

      // Fill out fields
      cy.getTestId(testids.password).type(user.password)
      cy.getTestId(testids.agreeCheckbox).check()

      cy.getTestId(testids.submitBtn).should('not.be.disabled')
      cy.getTestId(testids.submitBtn).click()

      cy.wait('@accept-invite').its('response.statusCode').should('eq', 200)
    })
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
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'email')
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'fromInvite')
      })
    })
  })

  it("emits a 'register-success' event with a payload on successful registration from a custom endpoint", () => {
    const customEndpoint = '/custom-register-request'

    cy.intercept('GET', '**/client-config', {
      statusCode: 200,
      body: {
        requireRegistrationAccessCode: false,
      },
    }).as('client-config-request')

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

    cy.getTestId(testids.instructionText).should('be.visible').and('have.text', customText)
  })

  /* ==============================
   * Password Strength Meter
   * ============================== */
  it('shows password strength meter if showPasswordStrengthMeter prop is set', () => {
    mount(KongAuthRegister, {
      props: {
        showPasswordStrengthMeter: true,
      },
    })
    /* password strength component does not handle data-testid attributes nicely */
    cy.get('.password-strength-meter').should('be.visible')
  })
})
