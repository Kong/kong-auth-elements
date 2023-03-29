/**
 * Transform a given string into a title-case version of the string.
 * @param {string} str - The string to title-case.
 * @returns {string} Title-case version of the input string.
 */
const convertToTitleCase = (str: string): string => {
  if (!str) {
    return ''
  }

  return str.split(' ').map(i => i.charAt(0).toUpperCase() + i.substring(1)).join(' ')
}

export default convertToTitleCase
