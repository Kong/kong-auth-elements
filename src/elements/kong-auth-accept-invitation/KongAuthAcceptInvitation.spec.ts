// Import types for custom commands
/// <reference types="../../cypress/support" />

import { mount } from '@cypress/vue'
import KongAuthAcceptInvitation from './KongAuthAcceptInvitation.ce.vue'
import { win } from '../../utils'
import { getConfigOptions } from '../../composables/useConfigOptions'
import useI18n from '../../composables/useI18n'

const { messages } = useI18n('en')

// Component data-testid strings
const testids = {
  form: 'kong-auth-accept-invitation-form',
  subheaderText: 'kong-auth-accept-invitation-subheader-text',
  fullName: 'kong-auth-accept-invitation-full-name',
  organization: 'kong-auth-accept-invitation-org-name',
  email: 'kong-auth-accept-invitation-email',
  password: 'kong-auth-accept-invitation-password',
  submitBtn: 'kong-auth-accept-invitation-submit',
  errorMessage: 'kong-auth-error-message',
  injectedStyles: 'kong-auth-injected-styles',
}

const user = {
  name: 'Player One',
  email: 'user1@email.com',
  org: 'Test Organization',
  password: 'TestPassword1!',
}

const requiredFields = [testids.fullName, testids.email, testids.password]

describe('KongAuthAcceptInvitation.ce.vue', () => {
  // Required for all Custom Elements
  it('has proper structure and required classes', () => {
    mount(KongAuthAcceptInvitation)

    // Should have .kong-auth-element as parent class
    cy.get('.kong-auth-element').should('be.visible').and('not.be.empty')
  })

  it('renders an accept invitation form with default fields and button elements', () => {
    mount(KongAuthAcceptInvitation)

    // Form should exist
    cy.getTestId(testids.form).should('be.visible')
    cy.getTestId(testids.form).within(() => {
      // Elements should exist
      cy.getTestId(testids.fullName).should('be.visible')
      cy.getTestId(testids.email).should('be.visible')
      cy.getTestId(testids.password).should('be.visible')
      cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')
    })
    // Elements should not exist
    cy.getTestId(testids.errorMessage).should('not.exist')
  })

  // Loop through required fields and ensure form cannot be submitted if any are blank/unchecked
  requiredFields.forEach((requiredField) => {
    const requiredFieldName = requiredField.replace(/kong-auth-accept-invitation-/gi, '')

    it(`prevents submit and shows error if ${requiredFieldName} field is blank`, () => {
      mount(KongAuthAcceptInvitation)

      // Error should not exist
      cy.getTestId(testids.errorMessage).should('not.exist')

      requiredFields.filter(field => field !== requiredField).forEach(field => {
        cy.getTestId(field).type('This is fake field text')
      })

      cy.getTestId(testids.submitBtn).should('be.visible').and('be.disabled')

      // Submit
      cy.getTestId(testids.form).submit()

      // Error should exist
      cy.getTestId(testids.errorMessage).should('be.visible').and('contain.text', messages.general.missingInfo)
    })
  })

  describe('Invites and Responding to URL Parameters', () => {
    it('pre-populates the form from search params', () => {
      // Stub search params
      cy.stub(win, 'getLocationSearch').returns(`?token=12345&org=${encodeURIComponent(user.org)}&email=${encodeURIComponent(user.email)}`)

      mount(KongAuthAcceptInvitation)

      // Inputs should be pre-populated and readonly
      cy.getTestId(testids.email).should('have.value', user.email).invoke('attr', 'readonly').should('eq', 'readonly')

      // Organization text should be visible
      cy.getTestId(testids.organization).should('contain.text', user.org)

      cy.getTestId(testids.password).should('not.be.disabled').and('be.empty')
      cy.getTestId(testids.submitBtn).should('be.disabled')
    })

    it('pre-populates the form and accepts an invitation after entering required fields', () => {
      // Stub search params
      cy.stub(win, 'getLocationSearch').returns(`?token=12345&org=${encodeURIComponent(user.org)}&email=${encodeURIComponent(user.email)}`)

      cy.intercept('PATCH', '**/v2/accept-invite', {
        statusCode: 200,
      }).as('accept-invite')

      mount(KongAuthAcceptInvitation)

      // Inputs should be pre-populated and readonly
      cy.getTestId(testids.email).should('have.value', user.email).invoke('attr', 'readonly').should('eq', 'readonly')

      // Organization text should be visible
      cy.getTestId(testids.organization).should('contain.text', user.org)

      cy.getTestId(testids.password).should('not.be.disabled').and('be.empty')
      cy.getTestId(testids.submitBtn).should('be.disabled')

      // Fill out fields
      cy.getTestId(testids.fullName).type(user.name)
      cy.getTestId(testids.password).type(user.password)

      cy.getTestId(testids.submitBtn).should('not.be.disabled')
      cy.getTestId(testids.submitBtn).click()

      cy.wait('@accept-invite').its('response.statusCode').should('eq', 200)
    })

    it('customizes the invite subheader text if inviteSubheaderText prop is set', () => {
      // Stub search params
      cy.stub(win, 'getLocationSearch').returns(`?token=12345&fullName=${encodeURIComponent(user.name)}&org=${encodeURIComponent(user.org)}&email=${encodeURIComponent(user.email)}`)

      const customText = 'This is custom subheader text'
      mount(KongAuthAcceptInvitation, {
        props: {
          subheaderText: customText,
        },
      })

      cy.getTestId(testids.subheaderText).should('be.visible').and('contain.text', customText)
    })
  })

  it("emits a 'accept-invitation-success' event with a payload on successful invitation acceptance", () => {
    cy.intercept('PATCH', '**/v2/accept-invite', {
      statusCode: 200,
      body: {
        email: user.email,
      },
    }).as('accept-invite-request')

    mount(KongAuthAcceptInvitation)

    cy.getTestId(testids.fullName).type(user.name)
    cy.getTestId(testids.email).type(user.email)
    cy.getTestId(testids.password).type(user.password)
    cy.getTestId(testids.form).submit()

    const eventName = 'accept-invitation-success'

    cy.wait('@accept-invite-request').then(() => {
      // Check for emitted event
      cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', eventName).then(() => {
        // Verify emit payload
        cy.wrap(Cypress.vueWrapper.emitted(eventName)[0][0]).should('have.property', 'email')
      })
    })
  })

  it('utilizes a provided custom error handler for an accept invitation request', () => {
    const customErrorMessage = 'A custom error message.'

    // Stub userEntity
    cy.stub(getConfigOptions, 'userEntity').returns('developer')
    // Stub customErrorHandler
    cy.stub(getConfigOptions, 'customErrorHandler').returns(() => customErrorMessage)

    cy.intercept('PATCH', '**/v2/accept-invite', {
      statusCode: 400,
    }).as('accept-invitation-request')

    mount(KongAuthAcceptInvitation)

    cy.getTestId(testids.fullName).type(user.name)
    cy.getTestId(testids.email).type(user.email)
    cy.getTestId(testids.password).type(user.password)
    cy.getTestId(testids.form).submit()

    cy.wait('@accept-invitation-request').then(() => {
      // Custom error messsage should exist
      cy.getTestId(testids.errorMessage).should('be.visible').and('contain.text', customErrorMessage)
    })
  })
})
