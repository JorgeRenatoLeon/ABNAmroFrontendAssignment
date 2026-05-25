import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useSearch } from '@/composables/useSearch'

describe('useSearch', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn())
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.unstubAllGlobals()
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	function mountComposable() {
		let result: ReturnType<typeof useSearch>
		mount(
			defineComponent({
				setup() {
					result = useSearch()
					return () => null
				},
			}),
		)
		return result!
	}

	it('starts with empty state', () => {
		const { query, results, hasQuery } = mountComposable()
		expect(query.value).toBe('')
		expect(results.value).toEqual([])
		expect(hasQuery.value).toBe(false)
	})

	it('sets hasQuery true immediately when query has a value', async () => {
		const { query, hasQuery } = mountComposable()

		query.value = 'friends'
		await nextTick()

		// hasQuery is based on query directly — no debounce needed
		expect(hasQuery.value).toBe(true)
	})

	it('clears all state on clearSearch', async () => {
		const { query, results, hasQuery, clearSearch } = mountComposable()

		query.value = 'friends'
		await nextTick()

		clearSearch()
		await nextTick()

		expect(query.value).toBe('')
		expect(results.value).toEqual([])
		expect(hasQuery.value).toBe(false)
	})

	it('does not call fetch before debounce delay', async () => {
		const { query } = mountComposable()

		query.value = 'friends'
		await nextTick()

		// Timer has not fired yet
		expect(fetch).not.toHaveBeenCalled()
	})

	it('calls the search API after debounce delay', async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: async () => [
				{ score: 10, show: { id: 1, name: 'Friends', genres: [], rating: { average: 8 } } },
			],
		} as Response)

		const { query } = mountComposable()

		query.value = 'friends'
		await nextTick()

		expect(fetch).not.toHaveBeenCalled()

		vi.runAllTimers()
		await nextTick()

		expect(fetch).toHaveBeenCalledWith(
			'https://api.tvmaze.com/search/shows?q=friends',
		)
	})

	it('maps search response to show array', async () => {
		const mockShow = { id: 1, name: 'Friends', genres: ['Comedy'], rating: { average: 8.5 } }
		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: async () => [{ score: 10, show: mockShow }],
		} as Response)

		const { query, results } = mountComposable()

		query.value = 'friends'
		await nextTick()
		vi.runAllTimers()
		await vi.runAllTimersAsync()
		await nextTick()

		expect(results.value[0].name).toBe('Friends')
	})

	it('clears results immediately when query is emptied', async () => {
		const { query, results } = mountComposable()

		query.value = 'friends'
		await nextTick()
		query.value = ''
		await nextTick()

		expect(results.value).toEqual([])
	})
})