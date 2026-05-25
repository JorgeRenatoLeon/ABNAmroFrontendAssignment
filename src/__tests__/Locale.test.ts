import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { i18n } from '@/plugins/i18n'
import { useLocale } from '@/composables/useLocale'

// Reset html lang before each test
beforeEach(() => {
	setActivePinia(createPinia())
	document.documentElement.lang = 'en'
	i18n.global.locale = 'en'
})

describe('useLocale', () => {
	function mountLocaleComponent() {
		return mount(
			{
				template: '<div />',
				setup() {
					const locale = useLocale()
					return { locale }
				},
			},
			{
				global: {
					plugins: [i18n, createPinia()],
				},
			},
		)
	}

	it('default locale is en', async () => {
		const wrapper = mountLocaleComponent()
		await nextTick()
		const locale = wrapper.vm.locale as ReturnType<typeof useLocale>
		expect(locale.currentLocale.value).toBe('en')
	})

	it('setLocale updates document.documentElement.lang', async () => {
		const wrapper = mountLocaleComponent()
		await nextTick()
		const locale = wrapper.vm.locale as ReturnType<typeof useLocale>
		await locale.setLocale('nl')
		await nextTick()
		expect(document.documentElement.lang).toBe('nl')
	})

	it('t returns English string by default', async () => {
		const wrapper = mountLocaleComponent()
		await nextTick()
		const locale = wrapper.vm.locale as ReturnType<typeof useLocale>
		expect(locale.t('nav.dashboard')).toBe('Dashboard')
	})
})