import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CrewSection from '@/components/common/CrewSection.vue'
import type { TVMazeCrew } from '@/types/tvmaze'

function makeCrew(type: string, name: string): TVMazeCrew {
	return {
		type,
		person: { id: 1, name, birthday: null, country: null, image: null, gender: null, url: '', deathday: null, updated: 0 },
	}
}

describe('CrewSection', () => {
	it('renders section with aria-label', () => {
		const w = mount(CrewSection, { props: { crew: [makeCrew('Director', 'Jane Doe')] }, global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } } })
		expect(w.find('section').attributes('aria-label')).toBe('Crew')
	})

	it('groups crew members by type', () => {
		const crew = [
			makeCrew('Director', 'Jane Doe'),
			makeCrew('Director', 'John Doe'),
			makeCrew('Writer', 'Alice Smith'),
		]
		const w = mount(CrewSection, { props: { crew }, global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } } })
		const dts = w.findAll('dt')
		expect(dts.map(d => d.text())).toContain('Director')
		expect(dts.map(d => d.text())).toContain('Writer')
	})

	it('joins multiple members of same type with comma', () => {
		const crew = [makeCrew('Director', 'Jane'), makeCrew('Director', 'John')]
		const w = mount(CrewSection, { props: { crew }, global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } } })
		const dd = w.find('dd')
		expect(dd.text()).toContain('Jane')
		expect(dd.text()).toContain('John')
		expect(dd.text()).toContain(',')
	})

	it('renders nothing when crew is empty', () => {
		const w = mount(CrewSection, { props: { crew: [] }, global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } } })
		expect(w.find('dl').exists()).toBe(true)
		expect(w.findAll('dt').length).toBe(0)
	})
})