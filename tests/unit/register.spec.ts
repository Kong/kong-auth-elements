import { mount } from '@vue/test-utils'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import Register from '@/components/Register.vue'
import KongAuthRegister from '@/elements/kong-auth-register/KongAuthRegister.ce.vue'

const initWindowLocation = (mockUrl: URL): void => {
  const { location } = window

  beforeEach(() => {
    // Delete and recreate window.location to prevent URLSearchParams errors in components
    delete (window as any).location
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.location = mockUrl
  })

  afterEach((): void => {
    // Reset window.location to original value
    window.location = location
  })
}

// Create a new URL where the tests will run
const mockUrl = new URL('http://localhost/register')
initWindowLocation(mockUrl)

describe('KongAuthRegister.ce.vue', () => {
  // Ensure class is wrapped so that syles will be applied correctly
  it('renders correctly and wraps all child elements in .kong-auth-element class', async () => {
    const wrapper = await mount(KongAuthRegister)
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

  it('renders a register form with default field and button elements', async () => {
    const wrapper = await mount(KongAuthRegister)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-register-form"]')
    const fullNameInput = wrapper.find('[data-testid="kong-auth-register-full-name"]')
    const organizationInput = wrapper.find('[data-testid="kong-auth-register-organization"]')
    const emailInput = wrapper.find('[data-testid="kong-auth-register-email"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-register-password"]')
    const agreeCheckbox = wrapper.find('[data-testid="kong-auth-register-check-agreement"]')
    const submitBtn = wrapper.find('[data-testid="kong-auth-register-submit"]')
    // Elements that should not exist
    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')
    const instructionText = wrapper.find('[data-testid="kong-auth-register-instruction-text"]')
    const accessCodeInput = wrapper.find('[data-testid="kong-auth-register-access-code"]')

    // Form should exist
    expect(form.exists()).toBe(true)
    // Elements should exist
    expect(fullNameInput.exists()).toBe(true)
    expect(organizationInput.exists()).toBe(true)
    expect(emailInput.exists()).toBe(true)
    expect(passwordInput.exists()).toBe(true)
    expect(agreeCheckbox.exists()).toBe(true)
    expect(submitBtn.exists()).toBe(true)
    // Elements should not exist
    expect(errorMessage.exists()).toBe(false)
    expect(instructionText.exists()).toBe(false)
    expect(accessCodeInput.exists()).toBe(false)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if full name field is empty', async () => {
    const wrapper = await mount(KongAuthRegister)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-register-form"]')
    const fullNameInput = wrapper.find('[data-testid="kong-auth-register-full-name"]')
    const organizationInput = wrapper.find('[data-testid="kong-auth-register-organization"]')
    const emailInput = wrapper.find('[data-testid="kong-auth-register-email"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-register-password"]')
    const agreeCheckbox = wrapper.find('[data-testid="kong-auth-register-check-agreement"]')

    fullNameInput.setValue('')
    organizationInput.setValue('Test Org')
    emailInput.setValue('user1@email.com')
    passwordInput.setValue('not-a-real-password')
    agreeCheckbox.setValue(true)
    await form.trigger('submit.prevent')

    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')
    expect(errorMessage.exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if organization field is empty', async () => {
    const wrapper = await mount(KongAuthRegister)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-register-form"]')
    const fullNameInput = wrapper.find('[data-testid="kong-auth-register-full-name"]')
    const organizationInput = wrapper.find('[data-testid="kong-auth-register-organization"]')
    const emailInput = wrapper.find('[data-testid="kong-auth-register-email"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-register-password"]')
    const agreeCheckbox = wrapper.find('[data-testid="kong-auth-register-check-agreement"]')

    fullNameInput.setValue('Player One')
    organizationInput.setValue('')
    emailInput.setValue('user1@email.com')
    passwordInput.setValue('not-a-real-password')
    agreeCheckbox.setValue(true)
    await form.trigger('submit.prevent')

    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')
    expect(errorMessage.exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if email field is empty', async () => {
    const wrapper = await mount(KongAuthRegister)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-register-form"]')
    const fullNameInput = wrapper.find('[data-testid="kong-auth-register-full-name"]')
    const organizationInput = wrapper.find('[data-testid="kong-auth-register-organization"]')
    const emailInput = wrapper.find('[data-testid="kong-auth-register-email"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-register-password"]')
    const agreeCheckbox = wrapper.find('[data-testid="kong-auth-register-check-agreement"]')

    fullNameInput.setValue('Marty McFly')
    organizationInput.setValue('Test Org')
    emailInput.setValue('')
    passwordInput.setValue('not-a-real-password')
    agreeCheckbox.setValue(true)
    await form.trigger('submit.prevent')

    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')
    expect(errorMessage.exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if password field is empty', async () => {
    const wrapper = await mount(KongAuthRegister)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-register-form"]')
    const fullNameInput = wrapper.find('[data-testid="kong-auth-register-full-name"]')
    const organizationInput = wrapper.find('[data-testid="kong-auth-register-organization"]')
    const emailInput = wrapper.find('[data-testid="kong-auth-register-email"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-register-password"]')
    const agreeCheckbox = wrapper.find('[data-testid="kong-auth-register-check-agreement"]')

    fullNameInput.setValue('Marty McFly')
    organizationInput.setValue('Test Org')
    emailInput.setValue('user1@email.com')
    passwordInput.setValue('')
    agreeCheckbox.setValue(true)
    await form.trigger('submit.prevent')

    const errorMessage = wrapper.find('[data-testid="kong-auth-error-message"]')
    expect(errorMessage.exists()).toBe(true)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevents submit and shows error if agree checkbox is not checked', async () => {
    const wrapper = await mount(KongAuthRegister)
    // Elements
    const form = wrapper.find('[data-testid="kong-auth-register-form"]')
    const fullNameInput = wrapper.find('[data-testid="kong-auth-register-full-name"]')
    const organizationInput = wrapper.find('[data-testid="kong-auth-register-organization"]')
    const emailInput = wrapper.find('[data-testid="kong-auth-register-email"]')
    const passwordInput = wrapper.find('[data-testid="kong-auth-register-password"]')
    const agreeCheckbox = wrapper.find('[data-testid="kong-auth-register-check-agreement"]')

    fullNameInput.setValue('Marty McFly')
    organizationInput.setValue('Test Org')
    emailInput.setValue('user1@email.com')
    passwordInput.setValue('not-a-real-password')
    agreeCheckbox.setValue(false)
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
    const wrapper = await mount(KongAuthRegister, {
      props: {
        instructionText: customText,
      },
    })
    // Elements
    const instructionText = wrapper.find('[data-testid="kong-auth-register-instruction-text"]')

    expect(instructionText.exists()).toBe(true)
    expect(instructionText.text()).toEqual(customText)

    // Ensure it matches the snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
