import { createWrapperError, DOMWrapper, mount, VueWrapper } from '@vue/test-utils'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const wrapperFactory = async (component: any, options = {}) => {
  const wrapper = await mount(component, {
    ...options,
  })

  /**
   * @description Find an element based on the 'data-testid' attribute
   * @param {string} selector Value of 'data-testid' attribute
   * @return {*}  {(DOMWrapper<Node> | VueWrapper)}
   */
  const findByTestId = (selector: string): DOMWrapper<Node> | VueWrapper => {
    const dataSelector = `[data-testid='${selector}']`
    const element = wrapper.element.querySelector(dataSelector)
    if (element) {
      return new DOMWrapper(element)
    }

    return createWrapperError('DOMWrapper')
  }

  return {
    wrapper,
    findByTestId,
  }
}

export const initWindowLocation = (mockUrl: URL): void => {
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
