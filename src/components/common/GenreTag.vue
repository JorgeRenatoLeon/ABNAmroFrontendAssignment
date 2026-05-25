<script setup lang="ts">
defineProps<{
	genre: string
	active?: boolean
	clickable?: boolean
}>()

defineEmits<{
	click: [genre: string]
}>()
</script>

<template>
	<button
		v-if="clickable"
		type="button"
		:class="[
			'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors',
			active
				? 'bg-teal-700 text-white'
				: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
		]"
		@click="$emit('click', genre)"
	>
		{{ genre }}
	</button>

	<span
		v-else
		class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
	>
		{{ genre }}
	</span>
</template>