import { customRef, type Ref } from 'vue'

export function useDebounce<T>(source: Ref<T>, delay = 300): Ref<T> {
	let timeout: ReturnType<typeof setTimeout>

	return customRef<T>((track, trigger) => ({
		get() {
			track()
			return source.value
		},
		set(value) {
			clearTimeout(timeout)
			timeout = setTimeout(() => {
				source.value = value
				trigger()
			}, delay)
		},
	}))
}