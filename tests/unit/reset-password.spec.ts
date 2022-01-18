import { wrapperFactory, initWindowLocation } from './utils'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ResetPassword from '@/components/ResetPassword.vue'
import KongAuthResetPassword from '@/elements/kong-auth-reset-password/KongAuthResetPassword.ce.vue'

// Component data-testid strings
const testids = {
  form: 'kong-auth-reset-password-form',
  password: 'kong-auth-reset-password-new-password',
  confirmPassword: 'kong-auth-reset-password-confirm-new-password',
  submitBtn: 'kong-auth-reset-password-submit',
  errorMessage: 'kong-auth-error-message',
  instructionText: 'kong-auth-reset-password-instruction-text',
}

describe('KongAuthResetPassword.ce.vue', () => {
  // Set the URL where the tests will run
  const mockUrl = new URL('http://localhost/reset-password')
  initWindowLocation(mockUrl)

  // Ensure class is wrapped so that syles will be applied correctly
  it('renders correctly and wraps all child elements in .kong-auth-element class', async () => {
    const { wrapper } = await wrapperFactory(KongAuthResetPassword)
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
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthResetPassword)

    // Form should exist
    expect(findByTestId(testids.form).exists()).toBe(true)
    // Elements should exist
    expect(findByTestId(testids.password).exists()).toBe(true)
    expect(findByTestId(testids.confirmPassword).exists()).toBe(true)
    expect(findByTestId(testids.submitBtn).exists()).toBe(true)
    // Elements should not exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(false)
    expect(findByTestId(testids.instructionText).exists()).toBe(false)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if password field is empty', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthResetPassword)

    findByTestId(testids.password).setValue('')
    findByTestId(testids.confirmPassword).setValue('not-a-real-password')
    await findByTestId(testids.form).trigger('submit.prevent')

    // Error message should exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if password confirm field is empty', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthResetPassword)

    findByTestId(testids.password).setValue('not-a-real-password')
    findByTestId(testids.confirmPassword).setValue('')
    await findByTestId(testids.form).trigger('submit.prevent')

    // Error message should exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if password and password confirm fields do not match', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthResetPassword)

    findByTestId(testids.password).setValue('not-a-real-password')
    findByTestId(testids.confirmPassword).setValue('a-different-password')
    await findByTestId(testids.form).trigger('submit.prevent')

    // Error message should exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  /* ==============================
   * Instruction Text
   * ============================== */
  it('shows instruction text if instructionText prop is set', async () => {
    const customText = 'This is custom instruction text'
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthResetPassword, {
      props: {
        instructionText: customText,
      },
    })

    expect(findByTestId(testids.instructionText).exists()).toBe(true)
    expect(findByTestId(testids.instructionText).text()).toEqual(customText)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
