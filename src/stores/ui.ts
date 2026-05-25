import { defineStore } from 'pinia'

import type { AppLocale } from '@/plugins/i18n'

export type AppTheme = 'light' | 'dark'
export type FontSize = 'sm' | 'md' | 'lg'

interface UIState {
  theme: AppTheme
  fontSize: FontSize
  reducedMotion: boolean
  highContrast: boolean
  enhancedFocus: boolean
  sidebarCollapsed: boolean
  liveMessage: string
  locale: AppLocale
}

export const useUIStore = defineStore('ui', {
	state: (): UIState => ({
		theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
		fontSize: 'md',
		reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
		highContrast: false,
		enhancedFocus: false,
		sidebarCollapsed: false,
		liveMessage: '',
		locale: 'en',
	}),

	actions: {
		toggleTheme() {
			this.theme = this.theme === 'light' ? 'dark' : 'light'
			document.documentElement.setAttribute('data-theme', this.theme)
		},

		setFontSize(size: FontSize) {
			this.fontSize = size
			document.documentElement.setAttribute('data-font-size', size)
		},

		setReducedMotion(val: boolean) {
			this.reducedMotion = val
			document.documentElement.setAttribute('data-reduced-motion', String(val))
		},

		setHighContrast(val: boolean) {
			this.highContrast = val
			document.documentElement.setAttribute('data-high-contrast', String(val))
		},

		setEnhancedFocus(val: boolean) {
			this.enhancedFocus = val
			document.documentElement.setAttribute('data-enhanced-focus', String(val))
		},

		setLocale(newLocale: AppLocale) {
			this.locale = newLocale
		},

		toggleSidebar() {
			this.sidebarCollapsed = !this.sidebarCollapsed
		},

		announce(message: string) {
			this.liveMessage = ''
			setTimeout(() => { this.liveMessage = message }, 50)
		},
	},
})