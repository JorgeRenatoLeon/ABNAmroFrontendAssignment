import { defineStore } from 'pinia'

export const useShowsStore = defineStore('shows',{
	state: () => ({
		favorites: [] as number[],
		isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
	}),
	actions: {
		toggleFavorite(showId: number) {
			const index = this.favorites.indexOf(showId)
			if (index === -1) {
				this.favorites.push(showId)
			} else {
				this.favorites.splice(index, 1)
			}
		},
		isFavorite(showId: number) {
			return this.favorites.includes(showId)
		},
		toggleDarkMode() {
			this.isDarkMode = !this.isDarkMode
			document.documentElement.setAttribute(
				'data-theme',
				this.isDarkMode ? 'dark' : 'light'
			)
		},
	},
})