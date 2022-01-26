// Using a function to retrieve window.location properties so it can be stubbed in Cypress component tests
const win = {
  getLocationSearch: (): string => {
    if (typeof window === undefined) return ''
    return window.location.search
  },

  getLocationHostname: (): string => {
    if (typeof window === undefined) return ''
    return window.location.hostname
  },

  getLocationHref: (): string => {
    if (typeof window === undefined) return ''
    return window.location.href
  },

  getLocationPathname: (): string => {
    if (typeof window === undefined) return ''
    return window.location.pathname
  },

  getLocationOrigin: (): string => {
    if (typeof window === undefined) return ''
    return window.location.origin
  },

  setLocationHref: (url: string): void => {
    if (typeof window === undefined) return
    window.location.href = url
  },

}

export default win
