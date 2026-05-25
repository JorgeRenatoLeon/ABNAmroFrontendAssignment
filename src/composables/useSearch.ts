import { computed, ref, watch } from 'vue'
import { tvmazeService, TVMazeApiError } from '@/services/tvmaze'
import type { TVMazeShow } from '@/types/tvmaze'

export function useSearch() {
	const query = ref('')
	const results = ref<TVMazeShow[]>([])
	const isLoading = ref(false)
	const error = ref<string | null>(null)

	const hasQuery = computed(() => query.value.trim().length > 0)
	const isEmptyResult = computed(
		() => hasQuery.value && !isLoading.value && results.value.length === 0 && !error.value,
	)

	let debounceTimer: ReturnType<typeof setTimeout> | null = null

	async function runSearch(searchQuery: string) {
		const normalized = searchQuery.trim()

		if (!normalized) {
			results.value = []
			error.value = null
			return
		}

		isLoading.value = true
		error.value = null

		try {
			const response = await tvmazeService.searchShows(normalized)
			results.value = response.map((item) => item.show)
		} catch (err) {
			error.value =
				err instanceof TVMazeApiError
					? err.message
					: 'Something went wrong while searching.'
		} finally {
			isLoading.value = false
		}
	}

	watch(query, (value) => {
		if (debounceTimer) clearTimeout(debounceTimer)

		if (!value.trim()) {
			results.value = []
			error.value = null
			return
		}

		debounceTimer = setTimeout(() => {
			void runSearch(value)
		}, 300)
	})

	function clearSearch() {
		if (debounceTimer) clearTimeout(debounceTimer)
		query.value = ''
		results.value = []
		error.value = null
		isLoading.value = false
	}

	return {
		query,
		results,
		isLoading,
		error,
		hasQuery,
		isEmptyResult,
		clearSearch,
	}
}
