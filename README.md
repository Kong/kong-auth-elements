# @kong/kong-auth-elements

Native HTML Web Components used for KAuth UI implementation in Kong apps

[![Tests](https://github.com/Kong/kong-auth-elements/actions/workflows/test.yml/badge.svg)](https://github.com/Kong/kong-auth-elements/actions/workflows/test.yml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Table of contents

- [Table of contents](#table-of-contents)
- [Installation](#installation)
  - [npm](#npm)
  - [CDN](#cdn)
- [Usage](#usage)
  - [Vue 2 or native web components](#vue-2-or-native-web-components)
  - [Options](#options)
  - [Events](#events)
  - [Theming with CSS Variables](#theming-with-css-variables)
  - [Webpack](#webpack)
  - [Testing in your app](#testing-in-your-app)
- [Custom Elements](#custom-elements)
  - [`kong-auth-login`](#kong-auth-login)
  - [`kong-auth-forgot-password`](#kong-auth-forgot-password)
  - [`kong-auth-reset-password`](#kong-auth-reset-password)
  - [`kong-auth-register`](#kong-auth-register)
  - [`kong-auth-accept-invitation`](#kong-auth-accept-invitation)
- [KAuth API](#kauth-api)
- [Contributing](#contributing)
  - [Creating a New Custom Element](#creating-a-new-custom-element)
  - [Custom Element Styles and the shadow DOM](#custom-element-styles-and-the-shadow-dom)
  - [Committing Changes](#committing-changes)
- [Local Development](#local-development)
  - [Configure Environment Variables](#configure-environment-variables)
  - [Install dependencies](#install-dependencies)
  - [Recommended IDE Setup](#recommended-ide-setup)
  - [Local Dev Against Non-Local API](#local-dev-against-non-local-api)
  - [Compile Components and hot-reload for development](#compile-components-and-hot-reload-for-development)
  - [Compile Custom Elements and hot-reload for development](#compile-custom-elements-and-hot-reload-for-development)
  - [Compile static HTML and demo native Web Components](#compile-static-html-and-demo-native-web-components)
  - [Compile and minify for production](#compile-and-minify-for-production)
  - [Link the local, `@kong/kong-auth-elements` package into another local project for testing](#link-the-local-kongkong-auth-elements-package-into-another-local-project-for-testing)
- [Current Issues](#current-issues)
  - [Props](#props)
  - [Axios](#axios)

## Installation

### npm

Install the package as a dependency in your app

```sh
yarn add @kong/kong-auth-elements
```

### CDN

The default exports have a bundle filename of `*.vue.{umd|es}.js` where we internalize Vue for consumption by the plugin (i.e. the bundle includes the Vue core).

We also provide `kong-auth-elements.{umd|es}.js` bundles that do **NOT** internalize (bundle) the Vue core along with it. These bundles can can be imported via `<script>` (`umd` bundle) or `<script type="module">` (`es` bundle) tags into projects where Vue is already available in the global namespace.

To utilize, include the script tag on your page after including Vue, and then call `window.registerKongAuthNativeElements()` with the [options](#options) outlined below.

You will also need to import the styles in the `document.head`

```html
<link rel="stylesheet" href="/{path}/dist/style.css"
```

## Usage

<!--
### Vue 3 Plugin

Import the package (and TypeScript types, if desired) inside of your App's entry file (e.g. for Vue, `main.ts`). Set the plugin options, and tell Vue to use the plugin.

```js
// main.ts

import App from './App.vue'
import { KongAuthElementsPlugin } from '@kong/kong-auth-elements'
import type { KongAuthElementsOptions } from '@kong/kong-auth-elements'
import '@kong/kong-auth-elements/dist/style.css'

const app = createApp(App)

const pluginOptions: KongAuthElementsOptions = {
  // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
  apiBaseUrl: 'https://us.api.konghq.com/kauth',
  userEntity: 'user',
}

// Use the plugin
app.use(KongAuthElementsPlugin, pluginOptions)

app.mount('#app')
```

Now that the plugin is globally registered, simply include a component just like you would any other Vue component, utilizing any props as needed

```html
<KongAuthLogin
  show-forgot-password-link
  @login-success="onLoginSuccess"
  @click-forgot-password-link="onUserClickForgotPassword"
  @click-register-link="onUserClickRegister"></KongAuthLogin>
```

---

-->

### Vue 2 or native web components

Import the package (and TypeScript types, if desired) inside of your App's entry file (e.g. for Vue, `main.ts`), set up the options, and call the provided `registerKongAuthNativeElements` function.

```ts
// main.ts

import registerKongAuthNativeElements from '@kong/kong-auth-elements'
import type { KongAuthElementsOptions } from '@kong/kong-auth-elements'
import '@kong/kong-auth-elements/dist/style.css'

const options: KongAuthElementsOptions = {
  // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
  apiBaseUrl: 'https://us.api.konghq.com/kauth',
  userEntity: 'user',
  shadowDom: true,
  injectCss: ['.kong-auth-login-form .k-input#email { background-color: var(--red-400, #ff0000) }'],
  lang: 'en', // Exclude to default to English
}

// Call the registration function to automatically register all custom elements for usage
registerKongAuthNativeElements(options)
```

The function will register all custom elements for usage as native web components.

Wherever you want to utilze a custom element, [you **must** wrap it with an element](#teleport-wrapper) (e.g. a `div`) with a unique `id` attribute, and then simply include the element in your HTML just like you would any other element, utilizing any props as needed

```html
<div id="kong-auth-login-wrapper">
  <kong-auth-login
    basic-auth-login-enabled
    show-forgot-password-link
    @login-success="onLoginSuccess"
    @click-forgot-password-link="onUserClickForgotPassword"
    @click-register-link="onUserClickRegister"></kong-auth-login>
</div>
```

#### Teleport Wrapper

For the current implementation, it is **REQUIRED** to wrap the element with a tag with a unique `id` attribute so the custom element can be "teleported" out of the shadow DOM to enable password manager support.

The `id` attribute should then be passed to each [Custom Element](#custom-elements) in the `wrapperId` prop so the element can be properly teleported out of the shadow DOM. For more information [refer to the Vue Teleport docs](https://vuejs.org/guide/built-ins/teleport.html). There are default `wrapperId` prop values provided; however to utilize them you still must wrap the custom element in an element with the corresponding `id`.

---

### Options

Regardless if you're using in Vue 3, Vue 2, or the native web components, an idential set of options exist for configuring the `kong-auth-elements`.

| Option | Type | Default | Description |
| :------------- | :--------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiBaseUrl`   | `string`   | `/kauth` | The `basePath` of the internal `axios` instance. <br><br>Unless using an absolute URL, this base path **must** start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users) |
| `userEntity`   | `string`   | `user`   | The user entity for authentication; one of `user` or `developer`. |
| `developerConfig`   | `DeveloperConfig`   | `{ portalId: string }`   | The developer config object. |
| `customErrorHandler`    | `Function`  | `(event: CustomEndpointErrorEvent) => ''`  | Supply a custom error handler to use when utilizing an element that allows providing a custom  request endpoint. [See the example below](#custom-error-handler) |
| `injectCss` | `string[]` | `[]`     | Pass an array of inlined CSS strings that will be injected into the DOM. [See the example below](#inject-css) |
`lang` | `string` | `en` | Set the language to use for the component message strings. See `/src/locales/`

#### TypeScript

You can import the TypeScript interfaces from the package if desired.

```ts
// List of user entities
export type UserEntities = 'user' | 'developer'

// List of custom elements that accept a custom error handler
export type CustomEndpointElement = 'kong-auth-login' | 'kong-auth-forgot-password' | 'kong-auth-register' | 'kong-auth-reset-password'

// List of requests that support custom endpoints
export type CustomEndpointRequest = 'authenticate-request' | 'verify-email-request' | 'reset-password-request' | 'register-request' | 'set-new-password-request'

export interface CustomEndpointErrorEvent = {
  error: AxiosError
  request: CustomEndpointRequest
  element: CustomEndpointElement
}

// Developer config options
export interface DeveloperConfig {
  portalId: string
}

// Supported languages
export type SupportedLanguages = 'en'

export interface KongAuthElementsOptions {
  apiBaseUrl?: string
  userEntity?: UserEntities
  developerConfig?: DeveloperConfig
  customErrorHandler?: (event: CustomEndpointErrorEvent) => string
  shadowDom?: boolean
  injectCss?: string[]
  lang?: SupportedLanguages
}
```

#### Custom Error Handler

You can customize the logic in your error handler to only respond to the requests or elements you wish to target.

If an error message `string` is not returned from the `customErrorHandler` based on the `error/request/element` logic then the default error handler and messaging will be used.

```ts
const pluginOptions: KongAuthElementsOptions = {
  apiBaseUrl: 'https://us.api.konghq.com/kauth',
  userEntity: 'developer',
  customErrorHandler: ({ error, request, element }): string => {
    // Access the original error
    console.log('error', error)

    // ... or the element name that the event was triggered by
    console.log('element', element)

    // Or perform different logic based on the request that errored
    if (request === 'reset-password-request') {
      return 'Custom reset error message.'
    } else if (request === 'register-request') {
      return 'Custom registration error message.'
    }
  },
}
```


#### Inject CSS

```ts
// Pass in inlined CSS strings as needed

const pluginOptions: KongAuthElementsOptions = {
  apiBaseUrl: 'https://us.api.konghq.com/kauth',
  userEntity: 'user',
  injectCss: [
    '.kong-auth-login-form .k-input#email { background-color: var(--red-400, #ff0000) }',
    `
    .kong-auth-register-form .k-input {
      width: 50%;
    }
    `,
  ],
}
```

### Events

Events are emitted for different component/element actions.

If using the Vue Plugin, you can listen to these events just like you would any other emitted event. (e.g. `@login-success="successHandler"`)

If your app uses the native web components, the emitted events follow the [CustomEvent() Web API](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) spec.

An example of consuming the native web component events and `CustomEvent.details` (emitted data) in your Vue app can be seen here

```html
<kong-auth-forgot-password
  instruction-text="Enter your verified email address and we will send you a password reset link."
  @forgot-password-success="onForgotPasswordSuccess"
></kong-auth-forgot-password>

<script lang="ts">
  setup () {

    // Respond to a successful reset password request
    const onForgotPasswordSuccess = (successEvent: CustomEvent): void => {
      const eventData: Record<string, any> = Array.isArray(successEvent.detail) ? successEvent.detail[0] : successEvent.detail

      console.log(`User with email '${eventData.email}' successfully requested a password reset email.`)
    }

    return {
      onForgotPasswordSuccess
    }
  }
</script>
```

If your app does not utilize Vue, you can respond to the custom events just like any other event listener

```js
// Add an appropriate event listener
document.querySelector('kong-auth-login').addEventListener('login-success', function (successEvent) {
  const eventData = Array.isArray(successEvent.detail) ? successEvent.detail[0] : successEvent.detail

  console.log('The user has successfully authenticated!')
})
```

### Theming with CSS Variables

Several custom CSS variables are available to impact the styling of custom elements, shown below

| Variable               | Purpose                                        |
| :--------------------- | :--------------------------------------------- |
| `--KongAuthFontFamily` | Default font family                            |
| `--KongAuthFontWeight` | Default font weight when not set by Kongponent |

Simply define values for the variables in your consuming application to make them available to the custom elements

```css
<style>
:root {
  --KongAuthFontFamily: 'Roboto';
  --KongAuthFontWeight: 400;
}
</style>
```

You may also utilize any CSS variables included in the [Kongponents component library](https://beta.kongponents.konghq.com/guide/theming.html).

In order to override the built-in CSS variables, you will need to scope your custom values to the `.kong-auth-element` selector as shown here

```css
.kong-auth-element {
  --KButtonPrimaryBase: #007ac1; /* set .k-button.primary to a custom color */
}
```

### Webpack

If utilizing the native web components inside of a [Vue app with the register function](#vue-2-or-native-web-components) (which forces use of the native web components), you will need to inform your consuming app (e.g. Vue) to recognize the custom elements defined outside of the framework (e.g. using the Web Components APIs).

If a component matches this condition, it won't need local or global registration and Vue won't throw a warning about an `Unknown custom element`.

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

The custom elements have data attributes in place with a standard format of `data-testid="kong-auth-{identifier}"`. If these test selectors are not sufficient, you should be able to create your tests by targeting a parent element and then searching downward through its child elements as needed.

If you have a specific use-case, submit a PR for a new attribute to be added and please add an example use-case as to why the existing attributes are not sufficient.

#### Cypress

If your app utilizes [Cypress](https://www.cypress.io) for testing, you will need to add an entry to your `cypress.json` configuration file to allow it to traverse the shadow DOM.

```json
{
  "includeShadowDom": true
}
```

Alternatively, [you can provide an options object](https://docs.cypress.io/api/commands/get#Arguments) to the `.get()` method with a `includeShadowDom` property set to `true`; however, you would have to replicate in every `.get()` reference, so it's easier to add to your `cypress.json` config file, if possible. Cypress also has a [`.shadow()` command](https://docs.cypress.io/api/commands/shadow), but again, the config setting is the easier way to go.

## Custom Elements

### `kong-auth-login`

- Provides a login UI along with corresponding `kauth` authentication (for `user` and `developer` entities)
- Provides Identity Provider (IdP) login, if enabled.
- Provides email verification, given a valid `token` in the query string.
- Sets the `kauth` cookies, along with the `userStatus` cookie (possibly unused).
- Consumes the `options.developerConfig.portalId` for `developer` entity authentication.

The login element **must** reside at the `{window.location.origin}/login` path in your application.

#### Props

| Prop | Type | Default | Description |
| :----------------------- | :------ | :------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `wrapperId` | String  | `kong-auth-login-wrapper` | Set the element selector of where the element should be rendered outside of the shadow DOM. This is normally the `id` of the parent HTML element. |
| `instructionText` | String  | `''` | Set the instruction text to display above the inputs. |
| `showForgotPasswordLink` | Boolean | `false` | Show a forgot password link under the password field. |
| `forgotPasswordLinkText` | String  | `Forgot your password?` | Set the text for the forgot password link. |
| `showRegisterLink` | Boolean | `false` | Show a register link under the login button. |
| `registerLinkHelpText` | String  | `Don't have an account?`   | Set the register link help text. |
| `registerLinkText` | String  | `Sign Up` | Set the text for the register link. |
| `registerSuccessText` | String  | `Successfully registered!` | Set the text for the register success message. |
| `basicAuthLoginEnabled` | Boolean | `false` | Enable basic auth login. **To set to false, simply do not add the prop** |
| `idpLoginEnabled` | Boolean | `false` | Enable IdP login detection. |
| `idpLoginReturnTo` | URL | `''` | Set the URL to return to upon successful IdP login. In most cases, this should be set to `window.location.origin` |

> **Note**: When utilizing the props as a native web component, you may need to use dot syntax, as shown here
>
> ```html
> <!-- Use this (notice the `.` before the attribute name) -->
> <kong-auth-login .basic-auth-login-enabled="false">
>
> <!-- Instead of this -->
> <kong-auth-login :basic-auth-login-enabled="false">
> ```


#### Emits Events

| Event                        |         Payload          | Description                                     |
| :--------------------------- | :----------------------: | :---------------------------------------------- |
| `login-success`              |                          | User successfully logged in.                    |
| `verify-email-success`       |   `{ email: String }`    | User successfully verified their email address. |
| `click-forgot-password-link` |                          | User clicked the included forgot password link. |
| `click-register-link`        |                          | User clicked the included register link.        |
| `idp-is-loading`             | `{ isLoading: Boolean }` | IdP authentication is processing.               |

To respond to any of the emitted events in your app, simply provide a callback for any of the events listed above. See the [Events reference](#events) for more details. All events return a [Custom Event](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent).

#### Query String Parameters

| Param | Required | Description |
| :-------------- | :--------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `token` | `true` if email verification | Pass a valid `token` entry in the URL query string to verify the user's email address. |
| `passwordReset` | `true` if password reset | To show the Reset Password Confirmation, the consuming app URL must include `passwordReset=true` in the query string. You can choose to include the `email` parameter as well. |
| `registered`    | `true` if register success (from register or invite) | To show the Register Confirmation, the consuming app URL must include `registered=true` in the query string. You can choose to include the `email` parameter as well. |
| `email` | `false` | Pass the user's URL encoded email address (e.g. `email=user%40foo.com` via `encodeURIComponent()`) in the query string to prepopulate the login form's email input. |
| `basicAuth` | `false` | To force displaying basic authentication (e.g. for organization owners) the URL should include `basicAuth=true` in the query string. |

#### IdP Login

##### Auto-initialization

###### `userEntity = 'user'`

When a user lands on your app on the route `/login/{login-path}` the `<kong-auth-login>` element will automatically initialize IdP login if the `idpLoginEnabled` prop is set to `true`, and the `idpLoginReturnTo` prop contains a valid URL to redirect the user to after successful authentication.

###### `userEntity = 'developer'`

When a developer lands on your app on the route `/login/sso` the `<kong-auth-login>` element will automatically initialize IdP login if the `idpLoginEnabled` prop is set to `true`, and the `idpLoginReturnTo` prop contains a valid URL to redirect the user to after successful authentication.

##### Logging back in

Upon logging out, if the user is sent to `/login/{login-path}?logout=true` (notice the `logout` query param) this will prevent IdP auto-initialization, and will hide the `email` and `password` fields and instead will show a Login button along with a separate link to login with credentials. This allows your app to log out the user, send them back to their organization's login path without actually logging them back in (preventing a loop).

If the user clicks the Login button, they will be sent to `/login/{login-path}` which will start [auto-initialization](#auto-initialization).

If the user clicks the link to login with credentials, they will be sent to `/login`, and will be able to authenticate with an email and password (if they are an Organization Owner, or their organization allows credentialed login).

---

### `kong-auth-forgot-password`

- Provides a forgot password UI along with corresponding `kauth` functionality to allow the user to request a reset password email.

#### Props

| Prop | Type |  Default | Description |
| :----------------------------- | :------ | :----------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `wrapperId` | String  | `kong-auth-forgot-password-wrapper` | Set the element selector of where the element should be rendered outside of the shadow DOM. This is normally the `id` of the parent HTML element. |
| `showLoginLink` | Boolean | `false` | Show a login link under the password fields. |
| `loginLinkText` | String  | `Return to log in` | Set the text for the login link. |
| `instructionText` | String  | `''` | Set the instruction text to display above the inputs. |
| `successText` | String  | `Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.` | Set the text to display upon successful reset password request. |
| `resetPasswordRequestEndpoint` | String  | `''` | Set the URL (relative or absolute) endpoint for the password reset request. |

#### Emits Events

| Event | Payload | Description |
| :------------------------ | :-----------------: | :-------------------------------------------------- |
| `wrapperId` | String  | `kong-auth-reset-password-wrapper` | Set the element selector of where the element should be rendered outside of the shadow DOM. This is normally the `id` of the parent HTML element. |
| `forgot-password-success` | `{ email: String }` | User successfully requested a reset password email. |
| `click-login-link` | | User clicked the included login link. |

To respond to any of the emitted events in your app, simply provide a callback for any of the events listed above. See the [Events reference](#events) for more details. All events return a [Custom Event](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent).

---

### `kong-auth-reset-password`

- Provides a reset password UI along with corresponding `kauth` functionality to allow the user to reset their password when coming from the reset password email, provided a valid `token` is present in the query string.

#### Props

| Prop                        | Type    | Default | Description                                          |
| :-------------------------- | :------ | :------ | :--------------------------------------------------- |
| `instructionText`           | String  | `''`    | Set the instruction text to display above the input. |

#### Emits Events

| Event                    |       Payload       | Description                             |
| :----------------------- | :-----------------: | :-------------------------------------- |
| `reset-password-success` | `{ email: String }` | User successfully reset their password. |

To respond to any of the emitted events in your app, simply provide a callback for any of the events listed above. See the [Events reference](#events) for more details. All events return a [Custom Event](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent).

#### Query String Parameters

| Param | Required | Description |
| :------ | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `token` | `true`   | Pass a valid `token` entry in the URL query string to send to the reset password request. |
| `email` | `false`  | Pass the user's URL encoded email address (e.g. `email=user%40foo.com` via `encodeURIComponent()`) in the query string to prepopulate the login form's email input on redirect. |

---

### `kong-auth-register`

- Provides a registration UI along with corresponding `kauth` functionality to allow the user to register and sending the confirmation email.
- Checks the client config to determine if registration access codes are required.

#### Props

| Prop | Type    | Default | Description |
| :-------------------------- | :------ | :----------------- | :----------------------------------- |
| `wrapperId` | String  | `kong-auth-register-wrapper` | Set the element selector of where the element should be rendered outside of the shadow DOM. This is normally the `id` of the parent HTML element. |
| `accessCodeRequired` | Boolean | `false` | An access code is required for registration. |
| `instructionText` | String  | `''` | Set the instruction text to display above the form inputs. |
| `registerButtonText` | String  | `Sign up for Free` | Set the text for the register button. |
| `registerRequestEndpoint` | String  | `''` | Set the URL (relative or absolute) endpoint for the registration request. |
| `recaptcha` | Boolean | `false` | Should reCAPTCHA be enabled for the register form. This feature is currently only available if the `userEntity` is set to `user`.|

#### Query String Parameters

| Param | Required | Description |
| :--------- | :-------------------- | :-------------------------------------------------- |
| `selectRegion` | `false` | Pass `"selectRegion=true"` in the URL to show the Konnect region selection during registration for `userEntity === 'user'`. |

#### Emits Events

| Event              |                 Payload                  | Description                   |
| :----------------- | :--------------------------------------: | :---------------------------- |
| `register-success` | `{ email: String, { organization: { id: String, name: String } } }` | User successfully registered. |

To respond to any of the emitted events in your app, simply provide a callback for any of the events listed above. See the [Events reference](#events) for more details. All events return a [Custom Event](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent).

### `kong-auth-accept-invitation`

- Provides a UI to allow accepting an invitation. The user should arrive via an invite link with the required query string parameters (outlined below) in the URL. The form will be pre-populated with data and the user will just provide a new password.

#### Props

| Prop | Type    | Default | Description |
| :-------------------------- | :------ | :----------------- | :----------------------------------- |
| `wrapperId` | String  | `kong-auth-accept-invitation-wrapper` | Set the element selector of where the element should be rendered outside of the shadow DOM. This is normally the `id` of the parent HTML element. |
| `subheaderText` | String  | `You've been invited to join ` | Set the subheader text that appears before the organization name above the form. |

#### Emits Events

| Event              |                 Payload                  | Description                   |
| :----------------- | :--------------------------------------: | :---------------------------- |
| `accept-invitation-success` | `{ email: String }` | User successfully accepted the invitation. |

To respond to any of the emitted events in your app, simply provide a callback for any of the events listed above. See the [Events reference](#events) for more details. All events return a [Custom Event](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent).

#### Query String Parameters

| Param | Required | Description |
| :--------- | :-------------------- | :-------------------------------------------------- |
| `token` | `true` | Pass an invite token in the query string. |
| `email` | `true` | Pass the user's URL encoded email address (e.g. `email=user%40foo.com` via `encodeURIComponent()`) in the query string. |
| `fullName` | `true` | Pass the user's URL encoded full name in the query string. |
| `org` | `true` | Pass the user's URL encoded organization in the query string. |

## KAuth API

If you would also like to utilize the `KongAuthApi` class and methods, you will need to utilize the [`@kong/kauth-client-typescript-axios`](https://github.com/Kong/kauth-client-sdks/tree/main/packages/typescript-axios). You can add an interface via a JavaScript class as seen in this repository at `/src/services/KongAuthApi.ts`

Once you create your own wrapper, you can do something like this in your project

```js
import KongAuthApi from './{path-to-your-api-class}'

// Create API instance, and handle unauthorized/unauthenticated errors
const kongAuthApi = new KongAuthApi((err) => {
  if (err.message.includes('code 403')) {
    return
  }

  // Example of using custom Vue Router function to redirect
  if (err && !router.isAuthRoute(router.currentRoute.name)) {
    globalStore.dispatch('auth/logout')
    router.push({ name: 'login' })
  }
})

// Vue 2
// =========================================

// Allow using api via `this.$kongAuthApi`, or within setup, context.$kongAuthApi
Vue.prototype.$kongAuthApi = kongAuthApi

// -- OR

// Vue 3
// =========================================

// Allow using api via `this.$kongAuthApi`, or within setup, context.$kongAuthApi
const app = createApp({})
app.config.globalProperties.$kongAuthApi = kongAuthApi
```

If using TypeScript, you should also declare the module in an `src/api.d.ts` file (or similar) like the following (you can add this to existing shim files)

```js
import KongAuthApi from './{path-to-your-api-class}'

declare module 'vue/types/vue' {
  interface Vue {
    $kongAuthApi: KongAuthApi
  }
}
```

## Contributing

### Creating a New Custom Element

#### Requirements

1. Custom elements must follow the naming convention `{PascalCaseName}.ce.vue`
2. The only root-level tag within the `<template>` of a custom element `src/elements/**/{CustomElement}.ce.vue` file must be the `<TeleportWrapper>` component (located at `/src/components/BaseCustomElement.vue`) and it must wrap a `<BaseCustomElement>` component, which then wraps all other content within the template (this enables style injection for child components).
3. The rest of the element's functionality should live within a child component (see existing examples) located in the `src/components/` directory and should not have any `props` of its own; the `props` from the parent `{PascalCaseName}.ce.vue` are injected with `provide/inject` (required).
4. Custom elements must be added to the following path `/src/elements/{kebab-case-element-name}/{PascalCaseElementName}.ce.vue`
5. Custom elements must have an export function added in the `/src/elements/index.ts` file that exports the registration function for the element. Note the proper names/paths in the file.
6. The registration function (created in Step 5) must be imported and called in `/src/index.ts` (as well as in `/dev/serve-elements/index.ts` for testing).
7. A corresponding `{PascalCaseName}.spec.ts` file must be created in the same directory as the custom element to provide Cypress Component Test Runner code coverage.
8. Custom element templates (the contents of the `{PascalCaseElementName}.ce.vue` file) must utilize the template shown below:

    <details>

    <summary>Click to view the starter Custom Element template</summary>

    ```html
    <template>
      <TeleportWrapper :parent-props="$props"> <!-- required -->
        <BaseCustomElement> <!-- required -->
            <!-- Components from /src/components may be used in this default slot -->
            <ExampleComponent @example-event="(emitData: any) => $emit('example-event', emitData)" />
        </BaseCustomElement>
      </TeleportWrapper>
    </template>

    <script lang="ts">
    import { defineComponent, computed, provide } from 'vue'
    import BaseCustomElement from '@/components/BaseCustomElement.vue'
    import ExampleComponent, { exampleComponentEmits } from '@/components/ExampleComponent.vue'
    import TeleportWrapper from '@/components/TeleportWrapper.vue'

    export default defineComponent({
      name: 'KongAuthExampleElement',

      // Props are defined here for use on the custom element tag, and all elements MUST have at least 1 prop
      props: {
        /* Required */
        wrapperId: {
          type: String,
          required: false,
          default: 'kong-auth-example-element',
        }
      },

      // Import emits from child component with validation, where necessary. See existing components for examples.
      emits: exampleComponentEmits,

      components: {
        TeleportWrapper,
        BaseCustomElement,
      },

      setup(props, { emit }) {
        // Provide custom element props to child components - this allows all props to remain reactive
        provide(
          'example-prop',
          computed((): string => (props.exampleProp ? props.exampleProp : '')),
        )
      },
    })
    </script>

    <style lang="scss" scoped>
    // No styles should be added to this component.
    </style>

    ```

    </details>

### Custom Element Styles and the shadow DOM

Styles are auto-injected into the shadow DOM for any internal components and child components.

In order for the styles to be injected, you need to place the exact comment (shown below) in **ALL** `<style>` blocks that are located inside a component within the `/src/` directory.

```css
/*! KONG_AUTH_INJECT_STYLES */
```

The exclamation point at the beginning of the comment flags the comment as important to PurgeCSS and prevents it from being removed during the build. Here's an example

> **Note**: No styles should be placed in the `<style>` blocks within the `src/elements/**/{CustomElement}.vue` files.

**You must put element/component styles into the `/src/assets/styles/_elements.scss` file.**

### Committing Changes

This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

[Commitizen](https://github.com/commitizen/cz-cli) and [Commitlint](https://github.com/conventional-changelog/commitlint) are used to help build and enforce commit messages.

It is __highly recommended__ to use the following command in order to create your commits:

```sh
yarn commit
```

This will trigger the Commitizen interactive prompt for building your commit message.

#### Enforcing Commit Format

[Lefthook](https://github.com/evilmartians/lefthook) is used to manage Git Hooks within the repo. A `commit-msg` hook is automatically setup that enforces commit message stands with `commitlint`, see [`lefthook.yml`](./lefthook.yml).

## Local Development

### Configure Environment Variables

By default, the UI runs against a local backend ([Kong/kauth](https://github.com/Kong/kauth)) running on `localhost:8080`; however, **most development can be done by utlizing a remote backend** (e.g. the DEV environment) and is _**strongly**_ recommended.

To utilize a remote backend, first duplicate the `.env.development.local.example` file and rename it to `.env.development.local`

```sh
# Execute from the project root
cp .env.development.local.example .env.development.local
```

After adding this new `env` file, your local frontend will utilize the **DEV** environment APIs.

### Install dependencies

```sh
yarn install --frozen-lockfile
```

### Recommended IDE Setup

We recommend using [VSCode](https://code.visualstudio.com/) along with the [Volar extension](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

#### Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.

### Local Dev Against Non-Local API

Create a file `.env.development.local` change `VUE_APP_AUTH_URL` to the environment you wish to hit. See `.env.development.local.example` for values.

How it works: Vue cli has a built in proxy. We use it to forward all requests that go to /api/\* to the specified URL running on port 3000. You can see the configuration in vue.config.js file.

### Compile Components and hot-reload for development

Import elements as Vue components and utilize Vue Dev Tools during development (may require additional imports in `/dev/serve-components/ComponentsApp.vue`).

_**Note**: This will not allow testing embedded styles and other Custom Element features._

```sh
yarn serve:components
```

### Compile Custom Elements and hot-reload for development

Import elements as native HTML Web Components (may require additional imports in `/dev/serve-elements/index.ts`).

_**Note**: This will not allow you to utilize Vue Dev Tools in the browser (custom elements are not currently supported)._

```sh
yarn serve:elements
```

### Compile static HTML and demo native Web Components

Import elements as native HTML Web Components (may require changes in `/demo/index.html`).

_**Note**: This will not allow you to utilize Vue Dev Tools in the browser (custom elements are not currently supported)._

```sh
yarn serve:demo
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

Next, inside of the local consuming project (i.e. `khcp-ui`), run this from the project root

```sh
yarn link "@kong/kong-auth-elements"
```

---

## Current Issues

### Props

There is currently an issue in Vue 3 custom elements (which we are using here) whereby with our setup, all `src/elements/**/{CustomElement}.ce.vue` files within the `/src/elements/` directory **MUST** have at least one `prop` defined. I'm still looking into why.

**This in no way impacts production or using `kong-auth-elements` within your application; all elements have at least one `prop` defined.**

### Axios

This package depends on [axios](https://github.com/axios/axios); specifically a minimum version of `0.24.0`. If your project is pinned to a version of **axios** less than `0.24.0` you will need to upgrade to prevent type interface conflicts.
