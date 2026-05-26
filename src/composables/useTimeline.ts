import { ref, computed } from 'vue'
import { tvmazeService } from '@/services/tvmaze'
import type { TVMazeShow } from '@/types/tvmaze'

export interface TimelineGroup {
  year: number
  shows: TVMazeShow[]
}

export function useTimeline() {
	const shows = ref<TVMazeShow[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)
	const minRating = ref(7)
	const selectedGenre = ref<string | null>(null)

	const filteredShows = computed(() =>
		shows.value.filter(s => {
			const meetsRating = (s.rating.average ?? 0) >= minRating.value
			const meetsGenre = !selectedGenre.value || s.genres.includes(selectedGenre.value)
			return meetsRating && meetsGenre && !!s.premiered
		})
	)

	const groups = computed((): TimelineGroup[] => {
		const map = new Map<number, TVMazeShow[]>()
		for (const show of filteredShows.value) {
			const year = new Date(show.premiered!).getFullYear()
			const list = map.get(year) ?? []
			list.push(show)
			map.set(year, list)
		}
		return Array.from(map.entries())
			.sort(([a], [b]) => b - a) // newest first
			.map(([year, s]) => ({
				year,
				shows: [...s].sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0)),
			}))
	})

	const availableGenres = computed(() => {
		const set = new Set<string>()
		for (const show of shows.value) show.genres.forEach(g => set.add(g))
		return [...set].sort()
	})

	async function load() {
		loading.value = true
		error.value = null
		try {
			// Reuse the same batch helper the Dashboard uses — one source of truth
			// for "fetch the working set of shows" instead of an ad-hoc Promise.all.
			shows.value = await tvmazeService.getDashboardShows(4)
		} catch {
			error.value = 'Could not load timeline data.'
		} finally {
			loading.value = false
		}
	}

	return { shows, loading, error, minRating, selectedGenre, groups, availableGenres, load }
}