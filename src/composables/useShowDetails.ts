import { ref, watchEffect } from 'vue'
import { tvmazeService, TVMazeApiError } from '@/services/tvmaze'
import type { TVMazeCastMember, TVMazeShow } from '@/types/tvmaze'

export function useShowDetails(showId: () => number | null) {
	const show = ref<TVMazeShow | null>(null)
	const cast = ref<TVMazeCastMember[]>([])
	const isLoading = ref(false)
	const error = ref<string | null>(null)

	async function fetchShowDetails(id: number) {
		isLoading.value = true
		error.value = null

		try {
			const [showResult, castResult] = await Promise.all([
				tvmazeService.getShowById(id),
				tvmazeService.getShowCast(id),
			])

			show.value = showResult
			cast.value = castResult
			document.title = `${showResult.name} | TV Shows`
		} catch (err) {
			error.value =
        err instanceof TVMazeApiError
        	? err.message
        	: 'Something went wrong while loading show details.'
		} finally {
			isLoading.value = false
		}
	}

	watchEffect(() => {
		const id = showId()
		if (id) {
			void fetchShowDetails(id)
		}
	})

	return {
		show,
		cast,
		isLoading,
		error,
		fetchShowDetails,
	}
}
