import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import type { Composer } from 'vue-i18n'
import { i18n } from '@/plugins/i18n'
import { useLocale } from '@/composables/useLocale'

// The i18n instance is shared across the whole suite — reset to English before
// each test so order-of-execution doesn't bleed locale state from one test
// into the next. In Composition-API mode `i18n.global.locale` is a ref, so
// `.value` is the correct way to assign.
beforeEach(() => {
	setActivePinia(createPinia())
	document.documentElement.lang = 'en'
	;(i18n.global as unknown as Composer).locale.value = 'en'
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

	// Regression test for the bug where setLocale appeared to succeed (lang and
	// uiStore.locale changed) but i18n.global.locale was assigned as a plain
	// string instead of via `.value`, so t() kept returning English.
	it('setLocale(nl) actually changes what t() returns', async () => {
		const wrapper = mountLocaleComponent()
		await nextTick()
		const locale = wrapper.vm.locale as ReturnType<typeof useLocale>

		expect(locale.t('nav.timeline')).toBe('Timeline')

		await locale.setLocale('nl')
		await nextTick()

		expect(locale.t('nav.timeline')).toBe('Tijdlijn')
		expect(locale.t('nav.map')).toBe('Kaart')
		expect(locale.currentLocale.value).toBe('nl')
	})

	it('switching back to en restores English strings', async () => {
		const wrapper = mountLocaleComponent()
		await nextTick()
		const locale = wrapper.vm.locale as ReturnType<typeof useLocale>

		await locale.setLocale('nl')
		await nextTick()
		expect(locale.t('nav.timeline')).toBe('Tijdlijn')

		await locale.setLocale('en')
		await nextTick()
		expect(locale.t('nav.timeline')).toBe('Timeline')
	})
})
