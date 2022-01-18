import BaseCustomElement from '@/components/BaseCustomElement.vue'
import Register from '@/components/Register.vue'
import KongAuthRegister from '@/elements/kong-auth-register/KongAuthRegister.ce.vue'
import { wrapperFactory, initWindowLocation } from './utils'

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
}

describe('KongAuthRegister.ce.vue', () => {
  // Set the URL where the tests will run
  const mockUrl = new URL('http://localhost/register')
  initWindowLocation(mockUrl)

  // Ensure class is wrapped so that syles will be applied correctly
  it('renders correctly and wraps all child elements in .kong-auth-element class', async () => {
    const { wrapper } = await wrapperFactory(KongAuthRegister)
    // Elements
    const parentDiv = wrapper.find('.kong-auth-element')

    // Components exist
    expect(wrapper.findComponent(BaseCustomElement).exists()).toBe(true)
    expect(wrapper.findComponent(Register).exists()).toBe(true)

    // Ensure custom element contains .kong-auth-element, and it is the parent of the BaseCustomElement
    expect(parentDiv.exists()).toBe(true)
    expect(parentDiv.findComponent(BaseCustomElement).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders a register form with default fields and button elements', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthRegister)

    // Form should exist
    expect(findByTestId(testids.form).exists()).toBe(true)
    // Elements should exist
    expect(findByTestId(testids.fullName).exists()).toBe(true)
    expect(findByTestId(testids.organization).exists()).toBe(true)
    expect(findByTestId(testids.email).exists()).toBe(true)
    expect(findByTestId(testids.password).exists()).toBe(true)
    expect(findByTestId(testids.agreeCheckbox).exists()).toBe(true)
    expect(findByTestId(testids.submitBtn).exists()).toBe(true)
    // Elements should not exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(false)
    expect(findByTestId(testids.instructionText).exists()).toBe(false)
    expect(findByTestId(testids.accessCode).exists()).toBe(false)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if full name field is empty', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthRegister)

    findByTestId('kong-auth-register-full-name').setValue('')
    findByTestId(testids.organization).setValue('Test Org')
    findByTestId(testids.email).setValue('user1@email.com')
    findByTestId(testids.password).setValue('not-a-real-password')
    findByTestId(testids.agreeCheckbox).setValue(true)
    await findByTestId('kong-auth-register-form').trigger('submit.prevent')

    // Error message should exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if organization field is empty', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthRegister)

    findByTestId('kong-auth-register-full-name').setValue('Player One')
    findByTestId(testids.organization).setValue('')
    findByTestId(testids.email).setValue('user1@email.com')
    findByTestId(testids.password).setValue('not-a-real-password')
    findByTestId(testids.agreeCheckbox).setValue(true)
    await findByTestId('kong-auth-register-form').trigger('submit.prevent')

    // Error message should exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if email field is empty', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthRegister)

    findByTestId('kong-auth-register-full-name').setValue('Marty McFly')
    findByTestId(testids.organization).setValue('Test Org')
    findByTestId(testids.email).setValue('')
    findByTestId(testids.password).setValue('not-a-real-password')
    findByTestId(testids.agreeCheckbox).setValue(true)
    await findByTestId('kong-auth-register-form').trigger('submit.prevent')

    // Error message should exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if password field is empty', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthRegister)

    findByTestId('kong-auth-register-full-name').setValue('Marty McFly')
    findByTestId(testids.organization).setValue('Test Org')
    findByTestId(testids.email).setValue('user1@email.com')
    findByTestId(testids.password).setValue('')
    findByTestId(testids.agreeCheckbox).setValue(true)
    await findByTestId('kong-auth-register-form').trigger('submit.prevent')

    // Error message should exist
    expect(findByTestId(testids.errorMessage).exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if agree checkbox is not checked', async () => {
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthRegister)

    findByTestId('kong-auth-register-full-name').setValue('Marty McFly')
    findByTestId(testids.organization).setValue('Test Org')
    findByTestId(testids.email).setValue('user1@email.com')
    findByTestId(testids.password).setValue('not-a-real-password')
    findByTestId(testids.agreeCheckbox).setValue(false)
    await findByTestId('kong-auth-register-form').trigger('submit.prevent')

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
    const { wrapper, findByTestId } = await wrapperFactory(KongAuthRegister, {
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
