import { describe, it, expect, beforeEach } from 'vitest'
import { useMeta } from '@/composables/useMeta'

describe('MetaTags', () => {
	beforeEach(() => {
		document.title = ''
		document.head.innerHTML = ''
	})

	it('sets document.title with app suffix', () => {
		useMeta({ title: 'Breaking Bad' })
		expect(document.title).toBe('Breaking Bad | Show Explorer')
	})

	it('creates meta description tag when none exists', () => {
		useMeta({ title: 'Test', description: 'A great show' })
		expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('A great show')
	})

	it('updates existing meta description without duplicating', () => {
		useMeta({ title: 'Test', description: 'First' })
		useMeta({ title: 'Test', description: 'Second' })
		expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1)
		expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Second')
	})

	it('sets og:title and og:description', () => {
		useMeta({ title: 'Breaking Bad', description: 'A chemistry teacher' })
		expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('Breaking Bad | Show Explorer')
		expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe('A chemistry teacher')
	})

	it('sets og:image when image is provided', () => {
		useMeta({ title: 'Test', image: 'https://example.com/poster.jpg' })
		expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe('https://example.com/poster.jpg')
	})

	it('does not create og:image tag when image is undefined', () => {
		useMeta({ title: 'Test' })
		expect(document.querySelector('meta[property="og:image"]')).toBeNull()
	})

	it('falls back to default description when none provided', () => {
		useMeta({ title: 'Test' })
		expect(document.querySelector('meta[name="description"]')?.getAttribute('content'))
			.toBe('Discover top-rated TV shows by genre, timeline, and country.')
	})
})