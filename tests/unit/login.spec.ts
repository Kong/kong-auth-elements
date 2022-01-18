import { wrapperFactory, initWindowLocation } from './utils'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import Login from '@/components/Login.vue'
import KongAuthLogin from '@/elements/kong-auth-login/KongAuthLogin.ce.vue'

// Component data-testid strings
const testids = {
  form: 'kong-auth-login-form',
  email: 'kong-auth-login-email',
  password: 'kong-auth-login-password',
  submitBtn: 'kong-auth-login-submit',
  errorMessage: 'kong-auth-error-message',
  forgotPasswordLink: 'kong-auth-login-forgot-password-link',
  registerLink: 'kong-auth-login-register-link',
  registerHelpText: 'kong-auth-login-register-help-text',
}

describe('KongAuthLogin.ce.vue', () => {
  // Set the URL where the tests will run
  const mockUrl = new URL('http://localhost/login')
  initWindowLocation(mockUrl)

  // Ensure class is wrapped so that syles will be applied correctly
  it('renders correctly and wraps all child elements in .kong-auth-element class', async () => {
    const { wrapper } = await wrapperFactory(KongAuthLogin)
    // Elements
    const parentDiv = wrapper.find('.kong-auth-element')

    // Components exist
    expect(wrapper.findComponent(BaseCustomElement).exists()).toBe(true)
    expect(wrapper.findComponent(Login).exists()).toBe(true)

    // Ensure custom element contains .kong-auth-element, and it is the parent of the BaseCustomElement
    expect(parentDiv.exists()).toBe(true)
    expect(parentDiv.findComponent(BaseCustomElement).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders a login form with email, password, and button elements', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthLogin)

    // Form should exist
    expect(findByTestId(testids.form).exists()).toBe(true)
    // Elements should exist
    expect(findByTestId(testids.email).exists()).toBe(true)
    expect(findByTestId(testids.password).exists()).toBe(true)
    expect(findByTestId(testids.submitBtn).exists()).toBe(true)
    // Elements should not exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(false)
    expect(findByTestId(testids.forgotPasswordLink).exists()).toBe(false)
    expect(findByTestId(testids.registerHelpText).exists()).toBe(false)
    expect(findByTestId(testids.registerLink).exists()).toBe(false)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if email field is empty', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthLogin)

    findByTestId(testids.email).setValue('')
    findByTestId(testids.password).setValue('not-a-real-password')
    await findByTestId(testids.form).trigger('submit.prevent')

    // Error should exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if password field is empty', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthLogin)

    findByTestId(testids.email).setValue('user1@email.com')
    findByTestId(testids.password).setValue('')
    await findByTestId(testids.form).trigger('submit.prevent')

    // Error should exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  /* ==============================
   * Forgot password link
   * ============================== */
  it('shows a forgot password link if showForgotPasswordLink prop is true', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthLogin, {
      props: {
        showForgotPasswordLink: true,
      },
    })

    expect(findByTestId(testids.forgotPasswordLink).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('customizes the forgot password link text if props are set', async () => {
    const customText = 'This is custom link text'
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthLogin, {
      props: {
        showForgotPasswordLink: true,
        forgotPasswordLinkText: customText,
      },
    })

    expect(findByTestId(testids.forgotPasswordLink).exists()).toBe(true)
    expect(findByTestId(testids.forgotPasswordLink).text()).toEqual(customText)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits an event when user clicks forgot password link', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthLogin, {
      props: {
        showForgotPasswordLink: true,
      },
    })

    await findByTestId(testids.forgotPasswordLink).trigger('click')

    // Expect emitted event (no payload)
    expect(wrapper.emitted()).toHaveProperty('click-forgot-password-link')

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  /* ==============================
   * Register link
   * ============================== */
  it('shows a register link if showRegisterLink prop is true', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthLogin, {
      props: {
        showRegisterLink: true,
      },
    })

    expect(findByTestId(testids.registerLink).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('customizes the register link text if props are set', async () => {
    const customText = 'This is custom link text'
    const customHelpText = 'This is custom help text'
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthLogin, {
      props: {
        showRegisterLink: true,
        registerLinkHelpText: customHelpText,
        registerLinkText: customText,
      },
    })

    expect(findByTestId(testids.registerLink).exists()).toBe(true)
    expect(findByTestId(testids.registerLink).text()).toEqual(customText)
    expect(findByTestId(testids.registerHelpText).text()).toEqual(customHelpText)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits an event when user clicks register link', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthLogin, {
      props: {
        showRegisterLink: true,
      },
    })

    await findByTestId(testids.registerLink).trigger('click')

    // Expect emitted event (no payload)
    expect(wrapper.emitted()).toHaveProperty('click-register-link')

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
