import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useShowsStore = defineStore('shows', () => {
	const favorites = ref<number[]>([])
	const isDarkMode = ref(
		window.matchMedia('(prefers-color-scheme: dark)').matches
	)

	function toggleFavorite(showId: number) {
		const index = favorites.value.indexOf(showId)
		if (index === -1) {
			favorites.value.push(showId)
		} else {
			favorites.value.splice(index, 1)
		}
	}

	function toggleDarkMode() {
		isDarkMode.value = !isDarkMode.value
		document.documentElement.setAttribute(
			'data-theme',
			isDarkMode.value ? 'dark' : 'light'
		)
	}

	return { favorites, isDarkMode, toggleFavorite, toggleDarkMode }
})