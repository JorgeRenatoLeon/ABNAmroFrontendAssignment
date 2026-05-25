import { describe, expect, it } from 'vitest'
import {
	filterShowsByGenre,
	sortShowsByRatingDesc,
	uniqueShowsById,
	stripHtmlTags,
} from '@/utils/show'
import type { TVMazeShow } from '@/types/tvmaze'

function makeShow(id: number, rating: number | null, genres: string[]): TVMazeShow {
	return {
		id,
		url: '',
		name: `Show ${id}`,
		type: 'Scripted',
		language: 'English',
		genres,
		status: 'Running',
		runtime: 60,
		averageRuntime: 60,
		premiered: null,
		ended: null,
		officialSite: null,
		schedule: { time: '', days: [] },
		rating: { average: rating },
		weight: 0,
		network: null,
		webChannel: null,
		dvdCountry: null,
		externals: null,
		image: null,
		summary: null,
		updated: 0,
	}
}

describe('sortShowsByRatingDesc', () => {
	it('sorts shows from highest to lowest rating', () => {
		const shows = [makeShow(1, 6.0, []), makeShow(2, 9.0, []), makeShow(3, 7.5, [])]
		const sorted = sortShowsByRatingDesc(shows)
		expect(sorted.map((s) => s.id)).toEqual([2, 3, 1])
	})

	it('treats null ratings as 0', () => {
		const shows = [makeShow(1, null, []), makeShow(2, 5.0, [])]
		const sorted = sortShowsByRatingDesc(shows)
		expect(sorted[0].id).toBe(2)
	})

	it('does not mutate the original array', () => {
		const shows = [makeShow(1, 6.0, []), makeShow(2, 9.0, [])]
		const original = [...shows]
		sortShowsByRatingDesc(shows)
		expect(shows).toEqual(original)
	})
})

describe('filterShowsByGenre', () => {
	it('returns only shows matching the genre', () => {
		const shows = [
			makeShow(1, 7.0, ['Drama']),
			makeShow(2, 8.0, ['Comedy']),
			makeShow(3, 6.0, ['Drama', 'Crime']),
		]
		const result = filterShowsByGenre(shows, 'Drama')
		expect(result.map((s) => s.id)).toEqual([1, 3])
	})

	it('returns empty array when no shows match', () => {
		const shows = [makeShow(1, 7.0, ['Drama'])]
		expect(filterShowsByGenre(shows, 'Horror')).toEqual([])
	})
})

describe('uniqueShowsById', () => {
	it('removes duplicate show IDs keeping last occurrence', () => {
		const shows = [makeShow(1, 7.0, []), makeShow(1, 8.0, []), makeShow(2, 6.0, [])]
		const result = uniqueShowsById(shows)
		expect(result.map((s) => s.id)).toEqual([1, 2])
	})
})

describe('stripHtmlTags', () => {
	it('removes HTML tags from a string', () => {
		expect(stripHtmlTags('<p>Hello <strong>World</strong></p>')).toBe('Hello World')
	})

	it('returns empty string for null', () => {
		expect(stripHtmlTags(null)).toBe('')
	})

	it('trims leading and trailing whitespace', () => {
		expect(stripHtmlTags('  <p>Hello</p>  ')).toBe('Hello')
	})
})