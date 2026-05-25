import { computed, ref, watch, type Ref } from 'vue'
import { tvmazeService, TVMazeApiError } from '@/services/tvmaze'
import type { TVMazeShow } from '@/types/tvmaze'
import { filterShowsByGenre, sortShowsByRatingDesc } from '@/utils/show'

export function useRelatedShows(show: Ref<TVMazeShow | null>) {
	const relatedShows = ref<TVMazeShow[]>([])
	const isLoading = ref(false)

	async function fetchRelated(currentShow: TVMazeShow) {
		if (!currentShow.genres.length) return

		isLoading.value = true

		try {
			// Fetch first 2 pages and filter by the show's primary genre
			const pages = await Promise.all([
				tvmazeService.getShowsPage(0),
				tvmazeService.getShowsPage(1),
			])

			const primaryGenre = currentShow.genres[0]
			const candidates = pages.flat()

			relatedShows.value = sortShowsByRatingDesc(
				filterShowsByGenre(candidates, primaryGenre).filter(
					(s) => s.id !== currentShow.id,
				),
			).slice(0, 12)
		} catch (err) {
			if (err instanceof TVMazeApiError) {
				console.warn('Could not load related shows:', err.message)
			}
		} finally {
			isLoading.value = false
		}
	}

	watch(
		show,
		(newShow) => {
			if (newShow) void fetchRelated(newShow)
		},
		{ immediate: true },
	)

	return { relatedShows, isLoading }
}