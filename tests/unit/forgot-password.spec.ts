import { wrapperFactory, initWindowLocation } from './utils'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import KongAuthForgotPassword from '@/elements/kong-auth-forgot-password/KongAuthForgotPassword.ce.vue'

// Component data-testid strings
const testids = {
  form: 'kong-auth-forgot-password-form',
  email: 'kong-auth-forgot-password-email',
  submitBtn: 'kong-auth-forgot-password-submit',
  errorMessage: 'kong-auth-error-message',
  instructionText: 'kong-auth-forgot-password-instruction-text',
  loginLink: 'kong-auth-forgot-password-return-to-login-link',
}

describe('KongAuthForgotPassword.ce.vue', () => {
  // Set the URL where the tests will run
  const mockUrl = new URL('http://localhost/forgot-password')
  initWindowLocation(mockUrl)

  // Ensure class is wrapped so that syles will be applied correctly
  it('renders correctly and wraps all child elements in .kong-auth-element class', async () => {
    const { wrapper } = await wrapperFactory(KongAuthForgotPassword)
    // Elements
    const parentDiv = wrapper.find('.kong-auth-element')

    // Components exist
    expect(wrapper.findComponent(BaseCustomElement).exists()).toBe(true)
    expect(wrapper.findComponent(ForgotPassword).exists()).toBe(true)

    // Ensure custom element contains .kong-auth-element, and it is the parent of the BaseCustomElement
    expect(parentDiv.exists()).toBe(true)
    expect(parentDiv.findComponent(BaseCustomElement).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders a forgot password form with email and button elements', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthForgotPassword)

    // Form should exist
    expect(findByTestId(testids.form).exists()).toBe(true)
    // Elements should exist
    expect(findByTestId(testids.email).exists()).toBe(true)
    expect(findByTestId(testids.submitBtn).exists()).toBe(true)
    // Elements should not exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(false)
    expect(findByTestId(testids.instructionText).exists()).toBe(false)
    expect(findByTestId(testids.loginLink).exists()).toBe(false)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if email field is empty', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthForgotPassword)

    findByTestId(testids.email).setValue('')
    await findByTestId(testids.form).trigger('submit.prevent')

    // Error should exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  /* ==============================
   * Instruction Text
   * ============================== */
  it('shows instruction text if instructionText prop is set', async () => {
    const customText = 'This is custom instruction text'
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthForgotPassword, {
      props: {
        instructionText: customText,
      },
    })

    expect(findByTestId(testids.instructionText).exists()).toBe(true)
    expect(findByTestId(testids.instructionText).text()).toEqual(customText)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  /* ==============================
   * Login link
   * ============================== */
  it('shows a login link if showLoginLink prop is true', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthForgotPassword, {
      props: {
        showLoginLink: true,
      },
    })

    expect(findByTestId(testids.loginLink).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('customizes the login link text if props are set', async () => {
    const customText = 'This is custom link text'
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthForgotPassword, {
      props: {
        showLoginLink: true,
        loginLinkText: customText,
      },
    })

    expect(findByTestId(testids.loginLink).exists()).toBe(true)
    expect(findByTestId(testids.loginLink).text()).toEqual(customText)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits an event when user clicks login link', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthForgotPassword, {
      props: {
        showLoginLink: true,
      },
    })

    await findByTestId(testids.loginLink).trigger('click')

    // Expect emitted event (no payload)
    expect(wrapper.emitted()).toHaveProperty('click-login-link')

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
