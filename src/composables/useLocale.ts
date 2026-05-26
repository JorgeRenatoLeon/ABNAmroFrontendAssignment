import { computed } from 'vue'
import { useI18n, type Composer } from 'vue-i18n'
import { i18n, type AppLocale } from '@/plugins/i18n'
import { useUIStore } from '@/stores/ui'

const globalI18n = i18n.global as unknown as Composer

// Track which locale messages have been registered with vue-i18n.
// 'en' is bundled at startup (see plugins/i18n.ts); other locales lazy-load.
const loadedLocales = new Set<AppLocale>(['en'])

async function loadLocale(locale: AppLocale): Promise<void> {
	if (loadedLocales.has(locale)) return

	// Only NL needs dynamic loading
	try {
		if (locale === 'nl') {
			const messages = (await import('@/locales/nl')).default
			globalI18n.setLocaleMessage(locale, messages)
		}
		loadedLocales.add(locale)
	} catch (error) {
		console.error(`Failed to load locale ${locale}:`, error)
	}
}

export function useLocale() {
	const { t } = useI18n()
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
		globalI18n.locale.value = newLocale
		uiStore.setLocale(newLocale)
		// Keep <html lang> in sync for screen readers and SEO.
		document.documentElement.lang = newLocale
	}

	return { t, currentLocale, isEnglish, isDutch, setLocale }
}
