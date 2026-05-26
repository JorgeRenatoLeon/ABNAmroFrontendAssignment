import type {
	TVMazeCastMember,
	TVMazeSearchResult,
	TVMazeShow,
	TVMazePerson,
	TVMazeCrew,
	TVMazeCastCredit,
} from '@/types/tvmaze'
import { TVMAZE_BASE_URL } from './tvmaze.constants'

export class TVMazeApiError extends Error {
	public readonly status?: number
	public readonly endpoint?: string

	constructor(
		message: string,
		status?: number,
		endpoint?: string,
	) {
		super(message)
		this.name = 'TVMazeApiError'
		this.status = status
		this.endpoint = endpoint
	}
}

// Single typed entry point — every TVMaze call goes through this so error
// handling, base URL, and JSON parsing stay consistent across endpoints.
async function request<T>(endpoint: string): Promise<T> {
	const response = await fetch(`${TVMAZE_BASE_URL}${endpoint}`)

	if (!response.ok) {
		throw new TVMazeApiError(
			`TVMaze request failed with status ${response.status}`,
			response.status,
			endpoint,
		)
	}

	return response.json() as Promise<T>
}

export const tvmazeService = {
	getShowsPage(page = 0): Promise<TVMazeShow[]> {
		return request<TVMazeShow[]>(`/shows?page=${page}`)
	},

	getShowById(id: number): Promise<TVMazeShow> {
		return request<TVMazeShow>(`/shows/${id}`)
	},

	searchShows(query: string): Promise<TVMazeSearchResult[]> {
		return request<TVMazeSearchResult[]>(
			`/search/shows?q=${encodeURIComponent(query)}`,
		)
	},

	getShowCast(showId: number): Promise<TVMazeCastMember[]> {
		return request<TVMazeCastMember[]>(`/shows/${showId}/cast`)
	},

	getShowCrew(showId: number): Promise<TVMazeCrew[]> {
		return request<TVMazeCrew[]>(`/shows/${showId}/crew`)
	},

	getPerson(personId: number): Promise<TVMazePerson> {
		return request<TVMazePerson>(`/people/${personId}`)
	},

	getPersonCastCredits(personId: number): Promise<TVMazeCastCredit[]> {
		return request<TVMazeCastCredit[]>(
			`/people/${personId}/castcredits?embed=show`,
		)
	},

	// Batch helper used by Dashboard, Timeline, and Map — fetches N pages of
	// /shows in parallel. TVMaze has no genre/country/year filter endpoint, so
	// client-side grouping is the only path; this is necessity, not optimisation.
	async getDashboardShows(pageCount = 4): Promise<TVMazeShow[]> {
		const requests = Array.from({ length: pageCount }, (_, page) =>
			this.getShowsPage(page),
		)
		const pages = await Promise.all(requests)
		return pages.flat()
	},
}
