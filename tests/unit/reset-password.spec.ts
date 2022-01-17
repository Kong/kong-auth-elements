import { mount } from '@vue/test-utils'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ResetPassword from '@/components/ResetPassword.vue'
import KongAuthResetPassword from '@/elements/kong-auth-reset-password/KongAuthResetPassword.ce.vue'

describe('KongAuthResetPassword.ce.vue', () => {
  // Ensure class is wrapped so that syles will be applied correctly
  it('renders correctly and wraps all child elements in .kong-auth-element class', async () => {
    const wrapper = await mount(KongAuthResetPassword)
    // Elements
    const parentDiv = wrapper.find('.kong-auth-element')

    // Components exist
    expect(wrapper.findComponent(BaseCustomElement).exists()).toBe(true)
    expect(wrapper.findComponent(ResetPassword).exists()).toBe(true)

    // Ensure custom element contains .kong-auth-element, and it is the parent of the BaseCustomElement
    expect(parentDiv.exists()).toBe(true)
    expect(parentDiv.findComponent(BaseCustomElement).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders a reset password form with email and button elements', async () => {
    const wrapper = await mount(KongAuthResetPassword)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-reset-password-form"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-reset-password-new-password"]')
    const passwordConfirmInput = wrapper.find('[data-testid="kong-auth-reset-password-confirm-new-password"]')
    const submitBtn = wrapper.find('[data-testid="kong-auth-reset-password-submit"]')
    // Elements that should not exist
    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')
    const instructionText = wrapper.find('[data-testid="kong-auth-reset-password-instruction-text"]')

    // Form should exist
    expect(form.exists()).toBe(true)
    // Elements should exist
    expect(passwordInput.exists()).toBe(true)
    expect(passwordConfirmInput.exists()).toBe(true)
    expect(submitBtn.exists()).toBe(true)
    // Elements should not exist
    expect(errorMessage.exists()).toBe(false)
    expect(instructionText.exists()).toBe(false)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if password field is empty', async () => {
    const wrapper = await mount(KongAuthResetPassword)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-reset-password-form"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-reset-password-new-password"]')
    const passwordConfirmInput = wrapper.find('[data-testid="kong-auth-reset-password-confirm-new-password"]')

    passwordInput.setValue('')
    passwordConfirmInput.setValue('not-a-real-password')
    await form.trigger('submit.prevent')

    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')
    expect(errorMessage.exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if password confirm field is empty', async () => {
    const wrapper = await mount(KongAuthResetPassword)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-reset-password-form"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-reset-password-new-password"]')
    const passwordConfirmInput = wrapper.find('[data-testid="kong-auth-reset-password-confirm-new-password"]')

    passwordInput.setValue('not-a-real-password')
    passwordConfirmInput.setValue('')
    await form.trigger('submit.prevent')

    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')
    expect(errorMessage.exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if password and password confirm fields do not match', async () => {
    const wrapper = await mount(KongAuthResetPassword)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-reset-password-form"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-reset-password-new-password"]')
    const passwordConfirmInput = wrapper.find('[data-testid="kong-auth-reset-password-confirm-new-password"]')

    passwordInput.setValue('not-a-real-password')
    passwordConfirmInput.setValue('a-different-password')
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
    const wrapper = await mount(KongAuthResetPassword, {
      props: {
        instructionText: customText,
      },
    })
    // Elements
    const instructionText = wrapper.find('[data-testid="kong-auth-reset-password-instruction-text"]')

    expect(instructionText.exists()).toBe(true)
    expect(instructionText.text()).toEqual(customText)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
