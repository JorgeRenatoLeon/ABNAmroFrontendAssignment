<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import RatingBadge from '@/components/common/RatingBadge.vue'
import GenreTag from '@/components/common/GenreTag.vue'
import FavoriteButton from '@/components/common/FavoriteButton.vue'
import type { TVMazeShow } from '@/types/tvmaze'

const props = defineProps<{ show: TVMazeShow }>()
const router = useRouter()

const posterUrl = computed(() => props.show.image?.medium ?? null)
const displayGenres = computed(() => props.show.genres.slice(0, 2))

// Deterministic color from show name — no gray fallback
const hashColor = computed(() => {
	let hash = 0
	for (const ch of props.show.name) hash = ch.charCodeAt(0) + ((hash << 5) - hash)
	return `hsl(${Math.abs(hash) % 360}, 28%, 32%)`
})

function navigate() {
	void router.push({ name: 'show-detail', params: { id: props.show.id } })
}
</script>

<template>
	<article
		class="group relative flex flex-col rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2"
		@click="navigate"
	>
		<!-- Poster -->
		<div class="relative aspect-2/3 overflow-hidden shrink-0">
			<img
				v-if="posterUrl"
				:src="posterUrl"
				:alt="`${show.name} poster`"
				width="210"
				height="295"
				loading="lazy"
				decoding="async"
				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
			>
			<div
				v-else
				class="w-full h-full flex items-center justify-center text-white/70 text-3xl font-bold select-none"
				:style="{ backgroundColor: hashColor }"
				aria-hidden="true"
			>
				{{ show.name.charAt(0) }}
			</div>
			<FavoriteButton
				:show="show"
				class="absolute top-2 right-2"
			/>
		</div>

		<div class="p-3 h-full flex flex-col">
			<button
				type="button"
				class="text-left focus:outline-none"
			>
				<h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
					{{ show.name }}
				</h3>
			</button>
			
			<RatingBadge
				:rating="show.rating.average"
				size="sm"
				class="w-fit my-1"
			/>

			<div
				class="mt-auto relative"
				style="max-height: 1.375rem;"
			>
				<div
					class="flex items-center gap-1 overflow-x-scroll scrollbar-hide whitespace-nowrap pr-2"
				>
					<GenreTag
						v-for="genre in displayGenres"
						:key="genre"
						:genre="genre"
						class="bg-gray-200 dark:bg-gray-50/5!"
					/>
				</div>

				<!-- Fading overlay -->
				<div
					class="absolute top-0 right-0 h-full w-6 pointer-events-none bg-linear-to-r from-transparent to-white dark:to-gray-800"
				/>
			</div>
		</div>
	</article>
</template>

<style scoped></style>