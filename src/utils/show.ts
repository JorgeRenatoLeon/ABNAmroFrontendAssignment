import type { TVMazeShow } from '@/types/tvmaze'

export function getShowRating(show: TVMazeShow): number {
	return show.rating.average ?? 0
}

export function sortShowsByRatingDesc(shows: TVMazeShow[]): TVMazeShow[] {
	return [...shows].sort((a, b) => getShowRating(b) - getShowRating(a))
}

export function filterShowsByGenre(shows: TVMazeShow[], genre: string): TVMazeShow[] {
	return shows.filter((show) => show.genres.includes(genre))
}

export function uniqueShowsById(shows: TVMazeShow[]): TVMazeShow[] {
	const map = new Map<number, TVMazeShow>()
	for (const show of shows) {
		map.set(show.id, show)
	}
	return Array.from(map.values())
}

export function stripHtmlTags(value: string | null): string {
	if (!value) return ''
	return value.replace(/<[^>]+>/g, '').trim()
}