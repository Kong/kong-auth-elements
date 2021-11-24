import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

// define your typings for the store state
export interface State {
  test: string
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol('Vuex Store')

export const store = createStore<State>({
  state: {
    test: ''
  },
  mutations: {},
  actions: {},
  getters: {}
})

// define your own `useStore` composition function
// eslint-disable-next-line
export function useStore () {
  return baseUseStore(key)
}
