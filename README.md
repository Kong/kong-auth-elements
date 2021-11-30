# kauth-ui-poc

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
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

Styles are auto-injected into the shadow DOM for any internal components and views. In order for the styles to be injected, you need to place this exact comment in **ALL** `<style>` elements inside of the `/src/` directory:

``` css
/* KONG_AUTH_INJECT_STYLES */
```

For example:

``` html
<style lang="scss" scoped>
/* KONG_AUTH_INJECT_STYLES */
h1 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: red;
}
</style>
```
