import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { i18n, type AppLocale } from '@/plugins/i18n'
import { useUIStore } from '@/stores/ui'

const loadedLocales = new Set<AppLocale>(['en'])

async function loadLocale(locale: AppLocale) {
	// Check if locale has already been loaded to override the english base
	if (loadedLocales.has(locale) && i18n.global.getLocaleMessage(locale).a11yLoaded?.loaded) {
		return
	}

	// Dynamic import NL for lazy load by overriding the nl existing object with the real translations.
	try {
		const messages = await import(`@/locales/${locale}.ts`)
		i18n.global.setLocaleMessage(locale, messages.default)
		loadedLocales.add(locale)
	} catch (error) {
		console.error(`Failed to load locale ${locale}:`, error)
	}
}

export function useLocale() {
	const { t } = useI18n<{ message: import('@/types/i18n').MessageSchema }, AppLocale>()
	const uiStore = useUIStore()

	const currentLocale = computed<AppLocale>({
		get: () => uiStore.locale,
		set: (value: AppLocale) => {
			void setLocale(value)
		},
	})
	const isEnglish = computed(() => uiStore.locale === 'en')
	const isDutch = computed(() => uiStore.locale === 'nl')

	async function setLocale(newLocale: AppLocale) {
		await loadLocale(newLocale)
		i18n.global.locale = newLocale
		uiStore.setLocale(newLocale)
		// Update <html lang> for screen readers and SEO
		document.documentElement.lang = newLocale
	}

	return { t, currentLocale, isEnglish, isDutch, setLocale }
}