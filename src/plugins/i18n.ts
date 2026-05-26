import { createI18n } from 'vue-i18n'
import type { MessageSchema } from '@/types/i18n'
import en from '@/locales/en'

// Locale type — only 'en' and 'nl' are valid
export type AppLocale = 'en' | 'nl'

export const i18n = createI18n<[MessageSchema], AppLocale>({
	legacy: false,
	locale: 'en',
	fallbackLocale: 'en',   // English fallback for any missing NL key
	messages: {
		en,
		// `nl` starts as the English bundle as a typed placeholder, the translations replace this object on the first switch
		nl: en,
	},
})
