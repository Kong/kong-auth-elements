# kong-auth-elements

## Project setup

```sh
yarn install
```

### Compiles components and hot-reloads for development

```sh
yarn serve:components
```

### Compiles custom elements and hot-reloads for development

```sh
yarn serve:elements
```

### Get info on the two serve commands

```sh
yarn serve:help
```

### Compiles and minifies for demo, and serves (without hot-reload)

```sh
yarn demo
```

### Compiles and minifies for production

```sh
yarn build
```

### Run your unit tests

```sh
yarn test:unit
```

### Run your end-to-end tests

```sh
yarn test:e2e
```

### Lints and fixes files

```sh
yarn lint
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
