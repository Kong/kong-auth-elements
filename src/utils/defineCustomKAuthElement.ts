/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  defineCustomElement as rootDefineCustomElement,
  h,
  createApp,
  getCurrentInstance,
  provide,
  ref,
} from 'vue'

const getNearestElementParent = (el: HTMLElement | null) => {
  while (el && el.nodeType !== 1) {
    el = el.parentElement
  }
  return el
}

// @ts-ignore
export const defineCustomKAuthElement = (
  // @ts-ignore
  component,
  // @ts-ignore
  { plugins = [], components = [] },
): // @ts-ignore
  Component =>
  rootDefineCustomElement({
    render: () => h(component),
    props: component.props,
    setup (props) {
      const app = createApp({})

      // globally install plugins
      plugins.forEach(app.use)

      // globally install components
      components.forEach((comp) => {
        // @ts-ignore
        app.component(comp.name, comp)
      })

      // Loop through props and 'provide' for consumption with 'inject'
      for (const [propName, propValue] of Object.entries(props)) {
        const propValueRef = ref<typeof propValue>(propValue)
        provide(propName, propValueRef)
      }

      app.mixin({
        mounted () {
          const insertStyles = (styles: []) => {
            if (styles && styles.length) {
              this.__style = document.createElement('style')
              this.__style.innerText = styles.join().replace(/\n/g, '')
              const nearestEl = getNearestElementParent(this.$el)
              if (nearestEl) {
                nearestEl.prepend(this.__style)
              }
            }
          }

          // load own styles
          insertStyles(this.$.type.styles)

          // load styles of child components
          if (this.$options.components) {
            for (const comp of Object.values(this.$options.components)) {
              // @ts-ignore
              insertStyles(comp.styles)
            }
          }
        },
        unmounted () {
          this.__style && this.__style.remove()
        },
      })

      const inst = getCurrentInstance()
      Object.assign(inst?.appContext, app._context)
      // @ts-ignore
      Object.assign(inst?.provides, app._context.provides)
      // TODO: new
      Object.assign(inst?.props, props)
    },
  })
