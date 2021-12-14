# @kong/kong-auth-elements

> **NOTE**: Docs are still a work in progress

## Local development

```sh
yarn install
```

### Local Dev Against Non-Local API

Create a file `.env.development.local` change `VUE_APP_AUTH_URL` to the environment you wish to hit. See `.env.development.local.example` for values.

Caveat: We gate internal only environments like dev and stage with Pomerium. Pomerium sets a cookie automatically, so we will need to manually set that cookie.

In your browser, go the the environment you wish to use, ie. https://kauth.konnect-dev.konghq.com. In the dev tools find the cookie named `_pomerium` and copy it's value. In your browser go to your local dev environment, ie. http://localhost:3000 and set a `_pomerium` cookie with that value. You can do this in the console like:

```js
document.cookie = '_pomerium={your copied value here}'
```

How it works: Vue cli has a built in proxy. We use it to forward all requests that go to /api/\* to the specified URL running on port 3000. You can see the configuration in vue.config.js file.

### Compile components and hot-reload for development

Import elements as Vue components and utilize Vue Dev Tools during development (may require additional imports in `/dev/serve-components/ComponentsApp.vue`).

_**Note**: This will not allow testing embedded styles and other Custom Element features._

```sh
yarn serve:components
```

### Compile Custom Elements and hot-reload for development

Import elements as HTML Custom Elements (may require additional imports in `/dev/serve-elements/index.ts`).

_**Note**: This will not allow you to utilize Vue Dev Tools in the browser (custom elements are not currently supported)._

```sh
yarn serve:elements
```

### Compile and minify for demo

Serve production versions of Custom Elements (referenced from the compiled `umd` file) within a static HTML page on a local server (hot-reload not available).

```sh
yarn demo
```

### Compile and minify for production

```sh
yarn build
```

### Link the local, `@kong/kong-auth-elements` package into another local project for testing

Inside `@kong/kong-auth-elements` run

```sh
yarn link
```

Next, inside of the local consuming project, run

```sh
yarn link "@kong/kong-auth-elements"
```

## Custom Element Styles and the shadow DOM

Styles are auto-injected into the shadow DOM for any internal components and child components.

Requirements:

1. All custom elements must follow the naming convention `{PascalCaseName}.ce.vue`
2. All custom elements must utilize the `<BaseCustomElement />` component as the first child of their `<template/>` tag which will wrap any other structure/components (this enables style injection for child components).

In order for the styles to be injected, you need to place the exact comment (shown below) in **ALL** `<style>` blocks that are located inside a component within the `/src/` directory.

```css
/*! KONG_AUTH_INJECT_STYLES */
```

The exclamation point at the beginning of the comment flags the comment as important to PurgeCSS and prevents it from being removed during the build. Here's an example

> **Note**: No styles should be placed in the `<style>` blocks within the `src/elements/**/{CustomElement}.ce.vue` files.

```html
<template>
  <div class="component-name">
    <h1>This is my component template</h1>
  </div>
</template>

<style lang="scss" scoped>
  /*! KONG_AUTH_INJECT_STYLES */
  h1 {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: teal;
  }
</style>
```

All styles from the [Kongponents component library](https://kongponents.konghq.com/guide/theming.html) will be automatically injected and available.

## Custom Elements

### `kong-auth-login`

Provides a login UI along with corresponding `kauth` authentication.

Provides email confirmation, given a valid [`token` in the query string](#token-confirm-email).

Also sets the `userStatus` cookie, along with other `kauth` cookies and localStorage entries.

#### Props

| Prop                     | Type    | Default                  |
| :----------------------- | :------ | :----------------------- |
| `showForgotPasswordLink` | Boolean | `false`                  |
| `forgotPasswordLinkText` | String  | `Forgot your password?`  |
| `showRegisterLink`       | Boolean | `false`                  |
| `registerLinkHelpText`   | String  | `Don't have an account?` |
| `registerLinkText`       | String  | `Sign Up →`              |

#### Emits Events

- `login-success`
- `confirm-email-success({ email: String })`
- `click-forgot-password-link`
- `click-register-link`

To respond to any of the emitted events in your app, simply provide a callback for any of the events listed above. See the [Events reference](#events) for more details.

#### Query String Parameters

##### `token` (Confirm Email)

Pass a valid `token` entry in the URL query string to confirm the user's email address.

##### `passwordReset`

To show the Reset Password Confirmation, the consuming app URL must include `passwordReset=true` in the query string. You can choose to include the [`email`](#email) parameter as well.

##### `email`

Pass the user's encoded email address (e.g. `email=user%40foo.com` via `encodeURIComponent()`) in the query string to prepopulate the login form's email input.

---

### `kong-auth-forgot-password`

Provides a forgot password UI along with corresponding `kauth` functionality to allow the user to request a reset password email.

#### Props

| Prop              | Type    | Default                                                                                                                  |
| :---------------- | :------ | :----------------------------------------------------------------------------------------------------------------------- |
| `showLoginLink`   | Boolean | `false`                                                                                                                  |
| `loginLinkText`   | String  | `Return to log in →`                                                                                                     |
| `instructionText` | String  | `''`                                                                                                                     |
| `successText`     | String  | `Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.` |

#### Emits Events

- `forgot-password-success({ email: String })`
- `click-login-link`

To respond to any of the emitted events in your app, simply provide a callback for any of the events listed above. See the [Events reference](#events) for more details.

## Usage

### Installation

Install the package as a dependency in your app

```sh
yarn add @kong/kong-auth-elements
```

Next, import the package inside of your App's entry file (e.g. for Vue, `main.ts`).

```js
// main.ts

import '@kong/kong-auth-elements'
```

Alternatively, you may import the package in the component where you wish to utilize one of the custom elements.

Once the package is imported, it will automatically register all custom components for usage.

Wherever you want to utilze a custom element, simply include it just like you would any other HTML component, utilizing any props as needed

```html
<kong-auth-login
  show-forgot-password-link
  @login-success="onLoginSuccess"
  @click-forgot-password-link="onUserClickForgotPassword"
  @click-register-link="onUserClickRegister"></kong-auth-login>
```

#### `KongAuthApi`

If you would also like to utilize the `KongAuthApi` class and methods, just update your import to include the API. You can also create a global API instance and handle unauthorized/unauthenticated errors.

```js
// main.ts

import KongAuthApi from '@kong/kong-auth-elements'

// Create API instance, and handle unauthorized/unauthenticated errors
const kongAuthApi = new KongAuthApi((err) => {
  if (err.message.includes('code 403')) {
    return
  }

  // Example from KHCP of using custom Vue Router function to redirect
  if (err && !router.isAuthRoute(router.currentRoute.name)) {
    globalStore.dispatch('auth/logout')
    router.push({ name: 'login' })
  }
})

// Vue 2
// ==============================================================================
// Allow using api via `this.$kongAuthApi`, or within setup, context.$kongAuthApi
Vue.prototype.$kongAuthApi = kongAuthApi

// -- OR

// Vue 3
// =========================================
// Allow using api via `this.$kongAuthApi`, or within setup, context.$kongAuthApi
const app = createApp({})
app.config.globalProperties.$kongAuthApi = kongAuthApi
```

You should also declare the module in an `src/api.d.ts` file (or similar) like the following (you can add this to existing shim files)

```js
import KongAuthApi from '@kong/kong-auth-elements/dist/types/services/KongAuthApi'

declare module 'vue/types/vue' {
  interface Vue {
    $kongAuthApi: KongAuthApi
  }
}
```

### Events

Any events that are emitted from custom elements follow the [CustomEvent() Web API](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent). An example of consuming the events and `CustomEvent.details` (emitted data) in your app can be seen here

```html
<kong-auth-forgot-password
  instruction-text="Enter your verified email address and we will send you a password reset link."
  @click-login-link="onUserClickLogin"
  @forgot-password-success="onForgotPasswordSuccess"
/></kong-auth-forgot-password>

<script lang="ts">
// ... only showing a function example, this would typically belong in your setup() function, etc.
const onForgotPasswordSuccess = (successEvent: CustomEvent): void => {
  const eventData: Record<string, any> = Array.isArray(successEvent.detail) ? successEvent.detail[0] : successEvent.detail

  console.log(`The user's email address is: ${eventData.email}`)
}
</script>
```

### CSS Variables

Several custom CSS variables are available to impact the styling of custom elements, shown below

| Variable               | Purpose                                        |
| :--------------------- | :--------------------------------------------- |
| `--KongAuthFontFamily` | Default font family                            |
| `--KongAuthFontWeight` | Default font weight when not set by Kongponent |

You may also utilize any CSS variables included in the [Kongponents component library](https://kongponents.konghq.com/guide/theming.html).

Simply define values for the variables in your consuming application to make them available to the custom elements

```css
<style>
:root {
  --KongAuthFontFamily: 'Roboto';
  --KongAuthFontWeight: 400;
}
</style>
```

### Webpack

You may need to inform your consuming app (e.g. Vue) to recognize custom elements defined outside of the framework (e.g. using the Web Components APIs). If a component matches this condition, it won't need local or global registration and Vue won't throw a warning about an `Unknown custom element`.

Regardless of whether your consuming application is a Vue app, you will also need to add an entry to `transpileDependencies`.

If your consuming application is a Vue app, add the following code in `vue.config.js`

```js
// vue.config.js

module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('kong-auth'), // Tags with this prefix will be recognized as custom elements
          },
        }
      })
  },
  transpileDependencies: ['@kong/kong-auth-elements'],
}
```

If your consuming app does not utilize `vue.config.js` file, you can transpile dependencies in your project's webpack config. As an example, if using `babel-loader`, you can include something like this in your `webpack.config.js` file

```js
// webpack.config.js

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: /(node_modules)\/(@kong/kong-auth-elements)/,
        loader: 'babel-loader'
      }
    ]
  }
}
```

### Testing in your app

The custom elements have test attributes already placed with a standard format of `data-testid="kong-auth-{identifier}"`. If these test selectors are not sufficient, you should be able to create your tests by targeting a parent element and then searching downward through its child elements as needed.

If you have a specific use-case, submit a PR for a new attribute to be added and please add an example use-case as to why the existing attributes are not sufficient.

#### Cypress

If your app utilizes [Cypress](https://www.cypress.io) for testing, you will need to add an entry to your `cypress.json` configuration file to allow it to traverse the shadow DOM.

```json
{
  "includeShadowDom": true
}
```

Alternatively, [you can provide an options object](https://docs.cypress.io/api/commands/get#Arguments) to the `.get()` method with a `includeShadowDom` property set to `true`; however, you would have to replicate in every `.get()` reference, so it's easier to add to your `cypress.json` config file, if possible. Cypress also has a [`.shadow()` command](https://docs.cypress.io/api/commands/shadow), but again, the config setting is the easier way to go.
