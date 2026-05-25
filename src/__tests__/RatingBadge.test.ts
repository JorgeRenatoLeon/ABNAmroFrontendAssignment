import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RatingBadge from '@/components/common/RatingBadge.vue'

describe('RatingBadge', () => {
	it('shows N/A for null rating', () => {
		const wrapper = mount(RatingBadge, { props: { rating: null } })
		expect(wrapper.text()).toContain('N/A')
	})

	it('applies green class for rating >= 8', () => {
		const wrapper = mount(RatingBadge, { props: { rating: 8.5 } })
		expect(wrapper.classes().join(' ')).toContain('green')
	})

	it('applies yellow class for rating between 6 and 8', () => {
		const wrapper = mount(RatingBadge, { props: { rating: 6.5 } })
		expect(wrapper.classes().join(' ')).toContain('yellow')
	})

	it('applies red class for rating below 6', () => {
		const wrapper = mount(RatingBadge, { props: { rating: 1.5 } })
		expect(wrapper.classes().join(' ')).toContain('red')
	})

	it('formats rating to one decimal place', () => {
		const wrapper = mount(RatingBadge, { props: { rating: 7 } })
		expect(wrapper.text()).toContain('7.0')
	})
})
