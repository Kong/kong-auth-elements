declare global {
  /**
   * Note that all environment variable identifiers and values are (and must be) typed as string because environment variables are always strings according to the {@link https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap08.html|POSIX Standards}, even if the string only contains numbers.
   *
   * Node respects this and every value from properties of `process.env` will be a string (or undefined if the identifier is not set).
   *
   * Envs should begin with VUE_APP to be available on process.env in the bundle see: https://cli.vuejs.org/guide/mode-and-env.html#environment-variables
   */
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
  }
}
