import { computed, onMounted, ref } from 'vue'
import { tvmazeService, TVMazeApiError } from '@/services/tvmaze'
import {
	DASHBOARD_GENRES,
	DASHBOARD_PAGE_COUNT,
	SHOWS_PER_GENRE_LIMIT,
} from '@/services/tvmaze.constants'
import type { GenreSection, TVMazeShow } from '@/types/tvmaze'
import {
	filterShowsByGenre,
	sortShowsByRatingDesc,
	uniqueShowsById,
} from '@/utils/show'

export function useShows() {
	const shows = ref<TVMazeShow[]>([])
	const isLoading = ref(false)
	const error = ref<string | null>(null)

	const topRatedShows = computed(() =>
		sortShowsByRatingDesc(uniqueShowsById(shows.value)).slice(0, 8)
	)

	const genreSections = computed<GenreSection[]>(() =>
		DASHBOARD_GENRES.map((genre) => ({
			genre,
			shows: sortShowsByRatingDesc(
				filterShowsByGenre(shows.value, genre)
			).slice(0, SHOWS_PER_GENRE_LIMIT),
		})).filter((section) => section.shows.length > 0)
	)

	async function fetchShows() {
		isLoading.value = true
		error.value = null

		try {
			shows.value = await tvmazeService.getDashboardShows(DASHBOARD_PAGE_COUNT)
		} catch (err) {
			error.value =
            err instanceof TVMazeApiError
            	? err.message
            	: 'Something went wrong while loading shows.'
		} finally {
			isLoading.value = false
		}
	}

	onMounted(fetchShows)

	return {
		shows,
		isLoading,
		error,
		topRatedShows,
		genreSections,
		fetchShows,
	}
}
