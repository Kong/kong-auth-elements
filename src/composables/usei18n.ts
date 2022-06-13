// Important: do not utilize Vue reactive variables in this composable so that it may be used outside the setup() function
import { type SupportedLanguages } from '../utils'
import { en, es } from '../locales'

// Also add supported languages here
interface MessageLanguages {
  en: typeof en
  es: typeof es
}

export default function useI18n(lang: SupportedLanguages = 'en') {
  let messages

  const languages: MessageLanguages = {
    en: en,
    es: es,
  }

  // If lang exists, set to use provided language
  if (lang && Object.keys(languages).includes(lang)) {
    messages = languages[lang]
  } else {
    // Fallback to English
    messages = languages.en
  }

  return {
    messages,
  }
}
