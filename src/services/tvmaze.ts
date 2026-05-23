import type {
  TVMazeCastMember,
  TVMazeSearchResult,
  TVMazeShow,
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
      `/search/shows?q=${encodeURIComponent(query)}`
    )
  },

  getShowCast(showId: number): Promise<TVMazeCastMember[]> {
    return request<TVMazeCastMember[]>(`/shows/${showId}/cast`)
  },

  async getDashboardShows(pageCount = 4): Promise<TVMazeShow[]> {
    const requests = Array.from({ length: pageCount }, (_, page) =>
      this.getShowsPage(page)
    )

    const pages = await Promise.all(requests)
    // Flatten the array of all pages into a single array of shows
    return pages.flat()
  },
}
