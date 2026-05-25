<script setup lang="ts">
import type { TVMazeShow } from '@/types/tvmaze'
import ShowCard from './ShowCard.vue'
import SkeletonCard from './SkeletonCard.vue'

defineProps<{
	shows: TVMazeShow[]
	isLoading?: boolean
}>()
</script>

<template>
	<section aria-label="Top rated shows">
		<h2 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
			Top Rated
		</h2>

		<div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
			<template v-if="isLoading">
				<SkeletonCard
					v-for="n in 8"
					:key="n"
				/>
			</template>
			<template v-else>
				<ShowCard
					v-for="show in shows"
					:key="show.id"
					:show="show"
				/>
			</template>
		</div>
	</section>
</template>