<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { TVMazeShow } from '@/types/tvmaze'
import RatingBadge from './RatingBadge.vue'
import GenreTag from './GenreTag.vue'

const props = defineProps<{
	show: TVMazeShow
	size?: 'sm' | 'md'
}>()

const router = useRouter()

const posterUrl = computed(() => props.show.image?.medium ?? null)

const displayGenres = computed(() => props.show.genres.slice(0, 2))

function navigate() {
	router.push({ name: 'show-detail', params: { id: props.show.id } })
}

function handleKeydown(event: KeyboardEvent) {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault()
		navigate()
	}
}
</script>

<template>
	<article
		:class="[
			'group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-gray-800',
			'shadow-sm hover:shadow-md cursor-pointer',
			'transition-transform duration-200 hover:-translate-y-1',
			'focus-visible:outline-2 focus-visible:outline-teal-700 focus-visible:outline-offset-2',
		]"
		:aria-label="`${show.name}, rated ${show.rating.average ?? 'not rated'}`"
		tabindex="0"
		role="button"
		@click="navigate"
		@keydown="handleKeydown"
	>
		<div class="relative aspect-2/3 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
			<img
				v-if="posterUrl"
				:src="posterUrl"
				:alt="`${show.name} poster`"
				width="210"
				height="295"
				loading="lazy"
				decoding="async"
				class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
			>

			<!-- Fallback -->
			<div
				v-else
				class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600"
				aria-hidden="true"
			>
				<svg
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<rect
						x="2"
						y="3"
						width="20"
						height="14"
						rx="2"
					/>
					<path d="M8 21h8M12 17v4" />
				</svg>
			</div>

			<div class="absolute top-2 right-2">
				<RatingBadge
					:rating="show.rating.average"
					size="sm"
				/>
			</div>
		</div>

		<div class="p-3 flex flex-col gap-1.5 flex-1">
			<h3 class="font-semibold text-sm leading-snug text-gray-900 dark:text-gray-100 line-clamp-2">
				{{ show.name }}
			</h3>

			<div class="flex flex-wrap gap-1 mt-auto pt-1">
				<GenreTag
					v-for="genre in displayGenres"
					:key="genre"
					:genre="genre"
				/>
			</div>
		</div>
	</article>
</template>