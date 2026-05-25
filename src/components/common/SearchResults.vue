<script setup lang="ts">
import type { TVMazeShow } from '@/types/tvmaze'
import ShowCard from './ShowCard.vue'
import SkeletonCard from './SkeletonCard.vue'

defineProps<{
	query: string
	results: TVMazeShow[]
	isLoading?: boolean
	isEmpty?: boolean
}>()
</script>

<template>
	<section aria-label="Search results">
		<h2 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
			Results for
			<span class="text-teal-700 dark:text-teal-400">"{{ query }}"</span>
		</h2>

		<div
			v-if="isLoading"
			class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3"
		>
			<SkeletonCard
				v-for="n in 6"
				:key="n"
			/>
		</div>

		<div
			v-else-if="isEmpty"
			class="flex flex-col items-center justify-center py-20 text-center gap-3"
		>
			<svg
				width="48"
				height="48"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				class="text-gray-300 dark:text-gray-600"
				aria-hidden="true"
			>
				<circle
					cx="11"
					cy="11"
					r="8"
				/>
				<path d="M21 21l-4.35-4.35" />
				<path d="M8 11h6M11 8v6" />
			</svg>
			<p class="text-gray-500 dark:text-gray-400 text-sm">
				No shows found for <strong class="text-gray-700 dark:text-gray-200">"{{ query }}"</strong>
			</p>
		</div>

		<div
			v-else
			class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3"
		>
			<ShowCard
				v-for="show in results"
				:key="show.id"
				:show="show"
			/>
		</div>
	</section>
</template>