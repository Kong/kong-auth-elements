# kong-auth-elements

## Project setup

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

## Compiles components and hot-reloads for development

### Serve Components

Import elements as Vue components and utilize Vue Dev Tools during development (may require additional imports in `/dev/serve-components/ComponentsApp.vue`).

_**Note**: This will not allow testing embedded styles and other Custom Element features._

```sh
yarn serve:components
```

### Serve Elements

Import elements as HTML Custom Elements (may require additional imports in `/dev/serve-elements/index.ts`).

_**Note**: This will not allow you to utilize Vue Dev Tools in the browser (custom elements are not currently supported)._

```sh
yarn serve:elements
```

## Compiles and minifies for demo, and serves up fully-built demo on local server (without hot-reload)

```sh
yarn demo
```

## Compiles and minifies for production

```sh
yarn build
```

## Styles

Styles are auto-injected into the shadow DOM for any internal components and child components.

Requirements:

1. All custom elements must follow the naming convention `{PascalCaseName}.ce.vue`
2. All custom elements must utilize the `<BaseCustomElement/>` as the first child of their `<template/>` tag (this enables style injection for child components).

In order for the styles to be injected, you need to place the exact comment (shown below) in **ALL** `<style>` elements that are located inside components within the `/src/` directory

```css
/*! KONG_AUTH_INJECT_STYLES */
```

The exclamation point at the beginning of the comment flags the comment as important to PurgeCSS and prevents it from being removed during the build. Here's an example

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
