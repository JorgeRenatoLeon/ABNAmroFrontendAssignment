import { createI18n } from 'vue-i18n'
import type { MessageSchema } from '@/types/i18n'
import en from '@/locales/en'

// Locale type — only 'en' and 'nl' are valid
export type AppLocale = 'en' | 'nl'

export const i18n = createI18n<[MessageSchema], AppLocale>({
	legacy: false,          // Composition API mode
	locale: 'en',
	fallbackLocale: 'en',   // Fallback
	messages: {
		en,
		// Use english as the base and then lazy load any differences for Dutch.
		nl: en,
	},
})