import { ref, watch, type Ref } from 'vue'

export function useDebounce<T>(source: Ref<T>, delay = 300) {
    const debouncedValue = ref(source.value) as Ref<T>

    watch(
        source,
        (value) => {
            const timeout = window.setTimeout(() => {
            debouncedValue.value = value
            }, delay)

            return () => window.clearTimeout(timeout)
        },
        { immediate: true }
    )

    return debouncedValue
}
