# kauth-ui-poc

## Project setup

```
yarn install
```

### Compiles components and hot-reloads for development

```
yarn serve:components
```

### Compiles custom elements and hot-reloads for development

```
yarn serve:elements
```

### Compiles and minifies for demo, and serves (without hot-reload)

```
yarn demo
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test:unit
```

### Run your end-to-end tests

```
yarn test:e2e
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Styles

Styles are auto-injected into the shadow DOM for any internal components and child components.

Requirements:

1. All custom elements must follow the naming convention `{PascalCaseName}.ce.vue`
2. All custom elements must utilize the `<BaseCustomElement/>` as the first child of their `<template/>` tag (this enables style injection for child components).

In order for the styles to be injected, you need to place the exact comment (shown below) in **ALL** `<style>` elements that are in components in the `/src/` directory, regardless of where in the directory structure they live:

```css
/*! KONG_AUTH_INJECT_STYLES */
```

The exclamation point at the beginning of the comment flags the comment as important to PurgeCSS and prevents it from being removed during the build.

Example:

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
