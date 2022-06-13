// Important: do not utilize Vue reactive variables in this composable so that it may be used outside the setup() function
import useConfigOptions from '@/composables/useConfigOptions'
import english from '../locales/en.json'

// List of supported languages, add more like || 'es'
export type SupportedLanguages = 'en'

// Also add supported languages here
interface MessageLanguages {
  en: typeof english
}

export default function useI18n() {
  const { lang } = useConfigOptions()
  let messages

  const languages: MessageLanguages = {
    en: english,
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
