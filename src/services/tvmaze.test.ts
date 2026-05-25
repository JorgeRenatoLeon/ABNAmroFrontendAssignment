import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { tvmazeService, TVMazeApiError } from './tvmaze'

describe('tvmazeService', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn())
	})

	afterEach(() => {
		vi.unstubAllGlobals()
		vi.restoreAllMocks()
	})

	it('fetch a page of shows', async () => {
		const mockShows = [
			{ id: 1, name: 'SpongeBob', genres: ['Cartoon'], rating: { average: 9.9 } },
		]

		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: async () => mockShows,
		} as Response)

		const result = await tvmazeService.getShowsPage(0)

		expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=0')
		expect(result).toEqual(mockShows)
	})

	it('search shows', async () => {
		const mockResults = [
			{
				score: 17.3,
				show: { id: 1, name: 'SpongeBob', genres: ['Cartoon'], rating: { average: 9.9 } },
			},
		]

		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: async () => mockResults,
		} as Response)

		const result = await tvmazeService.searchShows('sponge')

		expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/search/shows?q=sponge')
		expect(result).toEqual(mockResults)
	})

	it('throws a TVMazeApiError for failed calls', async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: false,
			status: 404,
		} as Response)

		await expect(tvmazeService.getShowById(999999)).rejects.toBeInstanceOf(TVMazeApiError)
	})

	it('fetch dashboard shows between different pages', async () => {
		vi.mocked(fetch)
			.mockResolvedValueOnce({
				ok: true,
				json: async () => [{ id: 1, name: 'Show 1', genres: [], rating: { average: 7 } }],
			} as Response)
			.mockResolvedValueOnce({
				ok: true,
				json: async () => [{ id: 2, name: 'Show 2', genres: [], rating: { average: 8 } }],
			} as Response)

		const result = await tvmazeService.getDashboardShows(2)

		expect(result).toHaveLength(2)
		expect(result.map((show) => show.id)).toEqual([1, 2])
	})

	// Pending tests
	// Fetching show by ID, fetching show cast, and error handling for all methods
})
