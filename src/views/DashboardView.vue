<script setup lang="ts">
import { computed, ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import GenreFilter from '@/components/common/GenreFilter.vue'
import TopRatedGrid from '@/components/common/TopRated.vue'
import ShowCarousel from '@/components/common/ShowCarousel.vue'
import SearchResults from '@/components/common/SearchResults.vue'
import { useShows } from '@/composables/useShows'
import { useSearch } from '@/composables/useSearch'

const { isLoading, error, topRatedShows, genreSections, fetchShows } = useShows()
const { query, results, isLoading: isSearching, hasQuery, isEmptyResult, clearSearch } = useSearch()

const activeGenre = ref<string | null>(null)

const visibleSections = computed(() => {
	if (activeGenre.value === null) return genreSections.value
	return genreSections.value.filter((s) => s.genre === activeGenre.value)
})
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-950">
		<AppHeader
			:search-query="query"
			:is-search-loading="isSearching"
			@update:search-query="query = $event"
			@clear-search="clearSearch"
		/>

		<main class="max-w-7xl mx-auto px-4 py-6 space-y-8">
			<!-- API error fallback -->
			<div
				v-if="error"
				class="flex flex-col items-center justify-center py-20 gap-4 text-center"
			>
				<svg
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					class="text-red-400"
					aria-hidden="true"
				>
					<circle
						cx="12"
						cy="12"
						r="10"
					/>
					<path d="M12 8v4M12 16h.01" />
				</svg>
				<p class="text-gray-600 dark:text-gray-400 text-sm">
					{{ error }}
				</p>
				<button
					type="button"
					class="px-4 py-2 rounded-full bg-teal-700 text-white text-sm font-medium hover:bg-teal-800 transition-colors"
					@click="fetchShows"
				>
					Try again
				</button>
			</div>

			<!-- Search -->
			<template v-else-if="hasQuery">
				<SearchResults
					:query="query"
					:results="results"
					:is-loading="isSearching"
					:is-empty="isEmptyResult"
				/>
			</template>

			<template v-else>
				<GenreFilter
					:active-genre="activeGenre"
					@select="activeGenre = $event"
				/>

				<TopRatedGrid
					:shows="topRatedShows"
					:is-loading="isLoading"
				/>

				<ShowCarousel
					v-for="section in visibleSections"
					:key="section.genre"
					:title="section.genre"
					:shows="section.shows"
					:is-loading="isLoading"
				/>
			</template>
		</main>
	</div>
</template>