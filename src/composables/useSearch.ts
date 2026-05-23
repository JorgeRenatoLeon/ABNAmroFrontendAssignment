import { computed, ref, watch } from 'vue'
import { useDebounce } from './useDebounce'
import { tvmazeService, TVMazeApiError } from '@/services/tvmaze'
import type { TVMazeShow } from '@/types/tvmaze'

export function useSearch() {
  const query = ref('')
  const results = ref<TVMazeShow[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const debouncedQuery = useDebounce(query, 300)

  const hasQuery = computed(() => debouncedQuery.value.trim().length > 0)
  const isEmptyResult = computed(
    () => hasQuery.value && !isLoading.value && results.value.length === 0 && !error.value
  )

  async function runSearch(searchQuery: string) {
    const normalizedQuery = searchQuery.trim()

    if (!normalizedQuery) {
      results.value = []
      error.value = null
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await tvmazeService.searchShows(normalizedQuery)
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

  function clearSearch() {
    query.value = ''
    results.value = []
    error.value = null
  }

  watch(debouncedQuery, (value) => {
    void runSearch(value)
  })

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
