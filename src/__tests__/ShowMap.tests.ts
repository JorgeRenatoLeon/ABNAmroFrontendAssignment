import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useShowMap } from '@/composables/useShowMap'
import * as service from '@/services/tvmaze'
import type { TVMazeShow } from '@/types/tvmaze'

function makeShow(id: number, countryCode: string | null, rating = 7): TVMazeShow {
	return {
		id,
		name: `Show ${id}`,
		genres: [],
		rating: { average: rating },
		image: null,
		summary: null,
		premiered: '2020-01-01',
		status: 'Running',
		runtime: 60,
		language: 'English',
		network: countryCode ? { name: 'Net', country: { name: 'Country', code: countryCode } } : null,
		webChannel: null,
		schedule: { time: '', days: [] },
	}
}

describe('useShowMap', () => {
	beforeEach(() => vi.restoreAllMocks())

	it('groups shows by network country code', async () => {
		vi.spyOn(service.tvmazeService, 'getAllShows')
			.mockResolvedValue([makeShow(1, 'US'), makeShow(2, 'US'), makeShow(3, 'GB')])
		const map = useShowMap()
		await map.load()
		expect(map.countryGroups.value.find(g => g.code === 'US')?.count).toBe(2)
		expect(map.countryGroups.value.find(g => g.code === 'GB')?.count).toBe(1)
	})

	it('excludes shows with no network country', async () => {
		vi.spyOn(service.tvmazeService, 'getAllShows')
			.mockResolvedValue([makeShow(1, null), makeShow(2, 'US')])
		const map = useShowMap()
		await map.load()
		const total = map.countryGroups.value.reduce((s, g) => s + g.count, 0)
		expect(total).toBe(1)
	})

	it('sorts groups by show count descending', async () => {
		vi.spyOn(service.tvmazeService, 'getAllShows')
			.mockResolvedValue([makeShow(1, 'GB'), makeShow(2, 'US'), makeShow(3, 'US'), makeShow(4, 'US')])
		const map = useShowMap()
		await map.load()
		expect(map.countryGroups.value[0].code).toBe('US')
	})

	it('selectedShows returns shows for selectedCountry, sorted by rating', async () => {
		vi.spyOn(service.tvmazeService, 'getAllShows')
			.mockResolvedValue([makeShow(1, 'US', 6), makeShow(2, 'US', 9), makeShow(3, 'GB', 8)])
		const map = useShowMap()
		await map.load()
		map.selectedCountry.value = 'US'
		expect(map.selectedShows.value[0].id).toBe(2) // rating 9 first
		expect(map.selectedShows.value.every(s => s.network?.country?.code === 'US')).toBe(true)
	})

	it('selectedShows returns empty when no country selected', async () => {
		vi.spyOn(service.tvmazeService, 'getAllShows').mockResolvedValue([makeShow(1, 'US')])
		const map = useShowMap()
		await map.load()
		expect(map.selectedShows.value.length).toBe(0)
	})

	it('sets error state on fetch failure', async () => {
		vi.spyOn(service.tvmazeService, 'getAllShows').mockRejectedValue(new Error('fail'))
		const map = useShowMap()
		await map.load()
		expect(map.error.value).not.toBeNull()
	})
})