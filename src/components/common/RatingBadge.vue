<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
	rating: number | null
	size?: 'sm' | 'md'
}>()

const displayRating = computed(() =>
	props.rating !== null ? props.rating.toFixed(1) : 'N/A'
)

const colorClass = computed(() => {
	if (props.rating === null) return 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
	if (props.rating >= 8) return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
	if (props.rating >= 6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
	return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
})

const sizeClass = computed(() =>
	props.size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1'
)
</script>

<template>
	<span
		:class="[colorClass, sizeClass, 'inline-flex items-center gap-1 font-semibold rounded-full whitespace-nowrap']"
		:aria-label="t('ratingBadge.ariaLabel', { rating: displayRating })"
	>
		<svg
			v-if="rating !== null"
			width="10"
			height="10"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
		</svg>
		<span>{{ displayRating }}</span>
	</span>
</template>