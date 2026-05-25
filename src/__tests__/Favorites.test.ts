import { describe, it, vi, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import FavoriteButton from '@/components/common/FavoriteButton.vue'
import { useShowsStore } from '@/stores/shows'
import type { TVMazeShow } from '@/types/tvmaze'

function makeShow(id = 1): TVMazeShow {
	return {
		id,
		name: 'Breaking Bad',
		genres: ['Drama'],
		rating: { average: 9.5 },
		image: null,
		summary: null,
		premiered: '2008-01-20',
		status: 'Ended',
		runtime: 47,
		language: 'English',
		network: null,
		webChannel: null,
		dvdCountry: null,
		externals: null,
		schedule: { time: '21:00', days: ['Sunday'] },
		updated: 0,
		url: '',
		type: '',
		officialSite: null,
		averageRuntime: null,
		weight: 0,
		ended: null
	}
}

describe('FavoriteButton', () => {
	beforeEach(() => setActivePinia(createPinia()))

	it('renders with aria-pressed=false when not a favorite', () => {
		const w = mount(FavoriteButton, { props: { show: makeShow() } })
		expect(w.find('button').attributes('aria-pressed')).toBe('false')
	})

	it('toggles favorite on click and updates aria-pressed', async () => {
		const w = mount(FavoriteButton, { props: { show: makeShow() } })
		await w.find('button').trigger('click')
		expect(w.find('button').attributes('aria-pressed')).toBe('true')
	})

	it('shows correct aria-label when not a favorite', () => {
		const w = mount(FavoriteButton, { props: { show: makeShow() } })
		expect(w.find('button').attributes('aria-label')).toContain('Add Breaking Bad')
	})

	it('shows correct aria-label when already a favorite', async () => {
		const store = useShowsStore()
		store.toggleFavorite(makeShow().id)
		const w = mount(FavoriteButton, { props: { show: makeShow() } })
		expect(w.find('button').attributes('aria-label')).toContain('Remove Breaking Bad')
	})

	it('does not propagate click event to parent', async () => {
		const parentClick = vi.fn()
		const w = mount({ template: '<div @click="parentClick"><FavoriteButton :show="show" /></div>', components: { FavoriteButton }, setup: () => ({ show: makeShow(), parentClick }) })
		await w.findComponent(FavoriteButton).find('button').trigger('click')
		expect(parentClick).not.toHaveBeenCalled()
	})
})