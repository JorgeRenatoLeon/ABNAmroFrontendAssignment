import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CastSection from '@/components/common/CastSection.vue'
import type { TVMazeCastMember } from '@/types/tvmaze'

function makeMember(id: number, hasImage: boolean): TVMazeCastMember {
	return {
		person: {
			id,
			name: `Person ${id}`,
			image: hasImage
				? { medium: 'https://example.com/img.jpg', original: 'https://example.com/img.jpg' }
				: null,
			birthday: '1970-01-01',
			gender: 'Male',
			country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
			deathday: null,
			url: `https://www.tvmaze.com/people/${id}/person-${id}`,
			updated: 123141231231,
		},
		character: { id, name: `Character ${id}`, image: null },
		self: false,
		voice: false,
	}
}

describe('CastSection', () => {
	it('renders cast member names', () => {
		const cast = [makeMember(1, false), makeMember(2, false)]
		const wrapper = mount(CastSection, { props: { cast } })
		expect(wrapper.text()).toContain('Person 1')
		expect(wrapper.text()).toContain('Character 1')
	})

	it('renders portrait image when available', () => {
		const cast = [makeMember(1, true)]
		const wrapper = mount(CastSection, { props: { cast } })
		expect(wrapper.find('img').exists()).toBe(true)
	})

	it('renders fallback SVG when image is null', () => {
		const cast = [makeMember(1, false)]
		const wrapper = mount(CastSection, { props: { cast } })
		expect(wrapper.find('img').exists()).toBe(false)
		expect(wrapper.find('svg').exists()).toBe(true)
	})

	it('caps cast display at 16 members', () => {
		const cast = Array.from({ length: 20 }, (_, i) => makeMember(i + 1, false))
		const wrapper = mount(CastSection, { props: { cast } })
		const names = wrapper.findAll('p.text-xs.font-medium')
		expect(names.length).toBeLessThanOrEqual(16)
	})
})