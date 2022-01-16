import { mount, config } from '@vue/test-utils'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import KongAuthForgotPassword from '@/elements/kong-auth-forgot-password/KongAuthForgotPassword.ce.vue'

// Supress @vue/compat warnings just for tests
config.global.config.warnHandler = (msg) => {
  if (msg.includes('compatConfig')) {
    return null
  }
}

describe('KongAuthForgotPassword.ce.vue', () => {
  // Ensure class is wrapped so that syles will be applied correctly
  it('renders correctly and wraps all child elements in .kong-auth-element class', async () => {
    const wrapper = await mount(KongAuthForgotPassword)
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
    const wrapper = await mount(KongAuthForgotPassword)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-forgot-password-form"]')
    const emailInput = wrapper.find('[data-testid="kong-auth-forgot-password-email"]')
    const submitBtn = wrapper.find('[data-testid="kong-auth-forgot-password-submit"]')
    // Elements that should not exist
    const instructionText = wrapper.find('[data-testid="kong-auth-forgot-password-instruction-text"]')
    const loginLink = wrapper.find('[data-testid="kong-auth-forgot-password-return-to-login-link"]')
    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')

    // Form should exist
    expect(form.exists()).toBe(true)
    // Elements should exist
    expect(emailInput.exists()).toBe(true)
    expect(submitBtn.exists()).toBe(true)
    // Elements should not exist
    expect(instructionText.exists()).toBe(false)
    expect(loginLink.exists()).toBe(false)
    expect(errorMessage.exists()).toBe(false)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if email field is empty', async () => {
    const wrapper = await mount(KongAuthForgotPassword)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-forgot-password-form"]')
    const emailInput = wrapper.find('[data-testid="kong-auth-forgot-password-email"]')

    emailInput.setValue('')
    await form.trigger('submit.prevent')

    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')
    expect(errorMessage.exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  /* ==============================
   * Instruction Text
   * ============================== */
  it('shows instruction text if instructionText prop is set', async () => {
    const customText = 'This is custom instruction text'
    const wrapper = await mount(KongAuthForgotPassword, {
      props: {
        instructionText: customText,
      },
    })
    // Elements
    const instructionText = wrapper.find('[data-testid="kong-auth-forgot-password-instruction-text"]')

    expect(instructionText.exists()).toBe(true)
    expect(instructionText.text()).toEqual(customText)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  /* ==============================
   * Login link
   * ============================== */
  it('shows a login link if showLoginLink prop is true', async () => {
    const wrapper = await mount(KongAuthForgotPassword, {
      props: {
        showLoginLink: true,
      },
    })
    // Elements
    const loginLink = wrapper.find('[data-testid="kong-auth-forgot-password-return-to-login-link"]')

    expect(loginLink.exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('customizes the login link text if props are set', async () => {
    const customText = 'This is custom link text'
    const wrapper = await mount(KongAuthForgotPassword, {
      props: {
        showLoginLink: true,
        loginLinkText: customText,
      },
    })
    // Elements
    const loginLink = wrapper.find('[data-testid="kong-auth-forgot-password-return-to-login-link"]')

    expect(loginLink.exists()).toBe(true)
    expect(loginLink.text()).toEqual(customText)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits an event when user clicks login link', async () => {
    const wrapper = await mount(KongAuthForgotPassword, {
      props: {
        showLoginLink: true,
      },
    })
    // Elements
    const loginLink = wrapper.find('[data-testid="kong-auth-forgot-password-return-to-login-link"]')

    await loginLink.trigger('click')

    // Expect emitted event (no payload)
    expect(wrapper.emitted()).toHaveProperty('click-login-link')

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
