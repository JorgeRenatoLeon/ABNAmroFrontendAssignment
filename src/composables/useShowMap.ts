import { ref, computed } from 'vue'
import { tvmazeService } from '@/services/tvmaze'
import type { TVMazeShow } from '@/types/tvmaze'

export interface CountryGroup {
  code: string
  name: string
  count: number
  shows: TVMazeShow[]
}

// ISO 3166-1 alpha-2 display names for common TVMaze country codes
const COUNTRY_NAMES: Record<string, string> = {
	US: 'United States', GB: 'United Kingdom', CA: 'Canada', AU: 'Australia',
	FR: 'France', DE: 'Germany', JP: 'Japan', KR: 'South Korea',
	IT: 'Italy', ES: 'Spain', NL: 'Netherlands', SE: 'Sweden',
	NO: 'Norway', DK: 'Denmark', FI: 'Finland', BR: 'Brazil',
	MX: 'Mexico', AR: 'Argentina', IN: 'India', ZA: 'South Africa',
	NZ: 'New Zealand', IE: 'Ireland', BE: 'Belgium', AT: 'Austria',
	CH: 'Switzerland', PL: 'Poland', PT: 'Portugal', HU: 'Hungary',
	CZ: 'Czech Republic', IL: 'Israel', TR: 'Turkey', RU: 'Russia',
	CN: 'China', TW: 'Taiwan', HK: 'Hong Kong', SG: 'Singapore',
	TH: 'Thailand', PH: 'Philippines',
}

export function useShowMap() {
	const shows = ref<TVMazeShow[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)
	const selectedCountry = ref<string | null>(null)

	const countryGroups = computed((): CountryGroup[] => {
		const map = new Map<string, TVMazeShow[]>()
		for (const show of shows.value) {
			const code = show.network?.country?.code ?? null
			if (!code) continue
			const list = map.get(code) ?? []
			list.push(show)
			map.set(code, list)
		}
		return Array.from(map.entries())
			.map(([code, s]) => ({
				code,
				name: COUNTRY_NAMES[code] ?? code,
				count: s.length,
				shows: [...s].sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0)),
			}))
			.sort((a, b) => b.count - a.count)
	})

	const selectedShows = computed(() =>
		selectedCountry.value
			? (countryGroups.value.find(g => g.code === selectedCountry.value)?.shows ?? [])
			: []
	)

	async function load() {
		loading.value = true
		error.value = null
		try {
			// Reuse the same batch helper the Dashboard uses
			shows.value = await tvmazeService.getDashboardShows(4)
		} catch {
			error.value = 'Could not load map data.'
		} finally {
			loading.value = false
		}
	}

	return { loading, error, countryGroups, selectedCountry, selectedShows, load }
}