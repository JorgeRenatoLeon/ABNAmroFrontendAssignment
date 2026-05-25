import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { i18n } from '@/plugins/i18n'
import ShowCard from '@/components/common/ShowCard.vue'
import type { TVMazeShow } from '@/types/tvmaze'

const mockShow: TVMazeShow = {
	id: 1234,
	url: '',
	name: 'The Office',
	type: 'Scripted',
	language: 'English',
	genres: ['Comedy'],
	status: 'Ended',
	runtime: 30,
	averageRuntime: 30,
	premiered: '2005-03-24',
	ended: '2013-05-16',
	officialSite: null,
	schedule: { time: '21:00', days: ['Thursday'] },
	rating: { average: 9.9 },
	weight: 100,
	network: null,
	webChannel: null,
	dvdCountry: null,
	externals: null,
	image: { medium: 'https://www.tallengestore.com/cdn/shop/products/91TmR1v-qRL._RI_04a48e6d-be66-47bc-b12d-13659f8615a7.jpg?v=1556951509', original: 'https://www.tallengestore.com/cdn/shop/products/91TmR1v-qRL._RI_04a48e6d-be66-47bc-b12d-13659f8615a7.jpg?v=1556951509' },
	summary: 'A mock show summary.',
	updated: 123456789,
}

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: '/', name: 'dashboard', component: { template: '<div/>' } },
		{ path: '/show/:id', name: 'show-detail', component: { template: '<div/>' } },
	],
})

describe('ShowCard', () => {
	it('renders the show name', () => {
		const wrapper = mount(ShowCard, { props: { show: mockShow }, global: { plugins: [createPinia(), router, i18n] } })
		expect(wrapper.text()).toContain('The Office')
	})

	it('renders genres', () => {
		const wrapper = mount(ShowCard, { props: { show: mockShow }, global: { plugins: [createPinia(), router, i18n] } })
		expect(wrapper.text()).toContain('Comedy')
		expect(wrapper.text()).not.toContain('Crime')
	})

	it('renders the poster image when image exists', () => {
		const wrapper = mount(ShowCard, { props: { show: mockShow }, global: { plugins: [createPinia(), router, i18n] } })
		const img = wrapper.find('img')
		expect(img.exists()).toBe(true)
		expect(img.attributes('src')).toBe('https://www.tallengestore.com/cdn/shop/products/91TmR1v-qRL._RI_04a48e6d-be66-47bc-b12d-13659f8615a7.jpg?v=1556951509')
	})

	it('renders a fallback when image is null', () => {
		const wrapper = mount(ShowCard, {
			props: { show: { ...mockShow, image: null } },
			global: { plugins: [createPinia(), router, i18n] },
		})
		expect(wrapper.find('img').exists()).toBe(false)
	})

	it('navigates on click', async () => {
		const push = vi.spyOn(router, 'push')
		const wrapper = mount(ShowCard, { props: { show: mockShow }, global: { plugins: [createPinia(), router, i18n] } })
		await wrapper.trigger('click')
		expect(push).toHaveBeenCalledWith({ name: 'show-detail', params: { id: 1234 } })
	})
})