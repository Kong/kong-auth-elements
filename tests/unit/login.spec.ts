import { mount, config } from '@vue/test-utils'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import Login from '@/components/Login.vue'
import KongAuthLogin from '@/elements/kong-auth-login/KongAuthLogin.ce.vue'

// Suppress @vue/compat warnings just for tests
config.global.config.warnHandler = (msg) => {
  if (msg.includes('compatConfig')) {
    return null
  }
}

describe('KongAuthLogin.ce.vue', () => {
  // Ensure class is wrapped so that syles will be applied correctly
  it('renders correctly and wraps all child elements in .kong-auth-element class', async () => {
    const wrapper = await mount(KongAuthLogin)
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
    const wrapper = await mount(KongAuthLogin)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-login-form"]')
    const emailInput = wrapper.find('[data-testid="kong-auth-login-email"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-login-password"]')
    const submitBtn = wrapper.find('[data-testid="kong-auth-login-submit"]')
    // Elements that should not exist
    const forgotPasswordLink = wrapper.find('[data-testid="kong-auth-login-forgot-password-link"]')
    const registerLink = wrapper.find('[data-testid="kong-auth-login-register-link"]')
    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')

    // Form should exist
    expect(form.exists()).toBe(true)
    // Elements should exist
    expect(emailInput.exists()).toBe(true)
    expect(passwordInput.exists()).toBe(true)
    expect(submitBtn.exists()).toBe(true)
    // Elements should not exist
    expect(forgotPasswordLink.exists()).toBe(false)
    expect(registerLink.exists()).toBe(false)
    expect(errorMessage.exists()).toBe(false)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if email field is empty', async () => {
    const wrapper = await mount(KongAuthLogin)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-login-form"]')
    const emailInput = wrapper.find('[data-testid="kong-auth-login-email"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-login-password"]')

    emailInput.setValue('')
    passwordInput.setValue('not-a-real-password')
    await form.trigger('submit.prevent')

    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')
    expect(errorMessage.exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if password field is empty', async () => {
    const wrapper = await mount(KongAuthLogin)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-login-form"]')
    const emailInput = wrapper.find('[data-testid="kong-auth-login-email"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-login-password"]')

    emailInput.setValue('user1@email.com')
    passwordInput.setValue('')
    await form.trigger('submit.prevent')

    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')
    expect(errorMessage.exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  /* ==============================
   * Forgot password link
   * ============================== */
  it('shows a forgot password link if showForgotPasswordLink prop is true', async () => {
    const wrapper = await mount(KongAuthLogin, {
      props: {
        showForgotPasswordLink: true,
      },
    })
    // Elements
    const forgotPasswordLink = wrapper.find('[data-testid="kong-auth-login-forgot-password-link"]')

    expect(forgotPasswordLink.exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('customizes the forgot password link text if props are set', async () => {
    const customText = 'This is custom link text'
    const wrapper = await mount(KongAuthLogin, {
      props: {
        showForgotPasswordLink: true,
        forgotPasswordLinkText: customText,
      },
    })
    // Elements
    const forgotPasswordLink = wrapper.find('[data-testid="kong-auth-login-forgot-password-link"]')

    expect(forgotPasswordLink.exists()).toBe(true)
    expect(forgotPasswordLink.text()).toEqual(customText)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits an event when user clicks forgot password link', async () => {
    const wrapper = await mount(KongAuthLogin, {
      props: {
        showForgotPasswordLink: true,
      },
    })
    // Elements
    const forgotPasswordLink = wrapper.find('[data-testid="kong-auth-login-forgot-password-link"]')

    await forgotPasswordLink.trigger('click')

    // Expect emitted event (no payload)
    expect(wrapper.emitted()).toHaveProperty('click-forgot-password-link')

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  /* ==============================
   * Register link
   * ============================== */
  it('shows a register link if showRegisterLink prop is true', async () => {
    const wrapper = await mount(KongAuthLogin, {
      props: {
        showRegisterLink: true,
      },
    })
    // Elements
    const registerLink = wrapper.find('[data-testid="kong-auth-login-register-link"]')

    expect(registerLink.exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('customizes the register link text if props are set', async () => {
    const customText = 'This is custom link text'
    const customHelpText = 'This is custom help text'
    const wrapper = await mount(KongAuthLogin, {
      props: {
        showRegisterLink: true,
        registerLinkHelpText: customHelpText,
        registerLinkText: customText,
      },
    })
    // Elements
    const registerLink = wrapper.find('[data-testid="kong-auth-login-register-link"]')
    const registerHelpText = wrapper.find('[data-testid="kong-auth-login-register-help-text"]')

    expect(registerLink.exists()).toBe(true)
    expect(registerLink.text()).toEqual(customText)
    expect(registerHelpText.text()).toEqual(customHelpText)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits an event when user clicks register link', async () => {
    const wrapper = await mount(KongAuthLogin, {
      props: {
        showRegisterLink: true,
      },
    })
    // Elements
    const registerLink = wrapper.find('[data-testid="kong-auth-login-register-link"]')

    await registerLink.trigger('click')

    // Expect emitted event (no payload)
    expect(wrapper.emitted()).toHaveProperty('click-register-link')

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
