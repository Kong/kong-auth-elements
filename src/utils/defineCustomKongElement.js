import { defineCustomElement as VueDefineCustomElement, h, createApp, getCurrentInstance } from 'vue'

const getNearestElementParent = (el) => {
  while (el && el.nodeType !== 1 /* ELEMENT */) {
    el = el.parentElement
  }
  return el
}

export const defineCustomKongElement = (component, { plugins = [], components = [] }) =>
  VueDefineCustomElement({
    render: () => h(component),
    setup () {
      const app = createApp()

      // install plugins
      plugins.forEach(app.use)

      // install components
      components.forEach(comp => {
        app.component(comp.name, comp)
      })

      app.mixin({
        mounted () {
          const insertStyles = (styles) => {
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
              insertStyles(comp.styles)
            }
          }
        },
        unmounted () {
          this.__style && this.__style.remove()
        }
      })

      const inst = getCurrentInstance()
      Object.assign(inst.appContext, app._context)
      Object.assign(inst.provides, app._context.provides)
    }
  })
