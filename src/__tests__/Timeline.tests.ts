import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTimeline } from '@/composables/useTimeline'
import * as tvmazeService from '@/services/tvmaze'
import type { TVMazeShow } from '@/types/tvmaze'

function makeShow(id: number, year: number, rating: number, genres: string[] = []): TVMazeShow {
	return {
		id,
		name: `Show ${id}`,
		genres,
		rating: { average: rating },
		image: null,
		summary: null,
		premiered: `${year}-06-15`,
		status: 'Ended',
		runtime: 60,
		language: 'English',
		network: null,
		webChannel: null,
		schedule: { time: '21:00', days: ['Sunday'] },
	}
}

describe('useTimeline', () => {
	beforeEach(() => vi.restoreAllMocks())

	it('groups shows by premiere year, newest first', async () => {
		vi.spyOn(tvmazeService.tvmazeService, 'getAllShows')
			.mockResolvedValue([makeShow(1, 2020, 8), makeShow(2, 2022, 9), makeShow(3, 2022, 7)])
		const tl = useTimeline()
		await tl.load()
		expect(tl.groups.value[0].year).toBe(2022)
		expect(tl.groups.value[1].year).toBe(2020)
	})

	it('sorts shows within each year by rating descending', async () => {
		vi.spyOn(tvmazeService.tvmazeService, 'getAllShows')
			.mockResolvedValue([makeShow(1, 2021, 6), makeShow(2, 2021, 9), makeShow(3, 2021, 7.5)])
		const tl = useTimeline()
		await tl.load()
		expect(tl.groups.value[0].shows[0].id).toBe(2) // rating 9 first
	})

	it('excludes shows below minRating', async () => {
		vi.spyOn(tvmazeService.tvmazeService, 'getAllShows')
			.mockResolvedValue([makeShow(1, 2020, 5), makeShow(2, 2020, 8)])
		const tl = useTimeline()
		tl.minRating.value = 7
		await tl.load()
		expect(tl.groups.value[0].shows.length).toBe(1)
		expect(tl.groups.value[0].shows[0].id).toBe(2)
	})

	it('filters by selectedGenre', async () => {
		vi.spyOn(tvmazeService.tvmazeService, 'getAllShows')
			.mockResolvedValue([makeShow(1, 2020, 8, ['Drama']), makeShow(2, 2020, 8, ['Comedy'])])
		const tl = useTimeline()
		tl.minRating.value = 0
		tl.selectedGenre.value = 'Drama'
		await tl.load()
		expect(tl.groups.value[0].shows.every(s => s.genres.includes('Drama'))).toBe(true)
	})

	it('excludes shows without premiered date', async () => {
		vi.spyOn(tvmazeService.tvmazeService, 'getAllShows')
			.mockResolvedValue([{ ...makeShow(1, 2020, 8), premiered: null }])
		const tl = useTimeline()
		tl.minRating.value = 0
		await tl.load()
		expect(tl.groups.value.length).toBe(0)
	})

	it('sets error state on fetch failure', async () => {
		vi.spyOn(tvmazeService.tvmazeService, 'getAllShows').mockRejectedValue(new Error('Network error'))
		const tl = useTimeline()
		await tl.load()
		expect(tl.error.value).not.toBeNull()
		expect(tl.loading.value).toBe(false)
	})
})