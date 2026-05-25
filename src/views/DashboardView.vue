<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import GenreFilter from '@/components/common/GenreFilter.vue'
import TopRatedGrid from '@/components/common/TopRated.vue'
import ShowCarousel from '@/components/common/ShowCarousel.vue'
import SearchResults from '@/components/common/SearchResults.vue'
import { useShows } from '@/composables/useShows'
import { useSearch } from '@/composables/useSearch'
import { useMeta } from '@/composables/useMeta'
import HeroBanner from '@/components/common/HeroBanner.vue'
import { useShowsStore } from '@/stores/shows'
useMeta({ title: 'Discover Shows', description: 'Browse top-rated TV shows by genre, timeline, and country.' })

const { isLoading, error, topRatedShows, genreSections, fetchShows } = useShows()
const showsStore = useShowsStore()

// Provided search object from App.vue or local if not available
const globalSearch = inject<ReturnType<typeof useSearch> | null>('globalSearch', null)
let query, results, isSearching, hasQuery, isEmptyResult
if (globalSearch) {
	query = globalSearch.query
	results = globalSearch.results
	isSearching = globalSearch.isLoading
	hasQuery = globalSearch.hasQuery
	isEmptyResult = globalSearch.isEmptyResult
} else {
	const local = useSearch()
	query = local.query
	results = local.results
	isSearching = local.isLoading
	hasQuery = local.hasQuery
	isEmptyResult = local.isEmptyResult
}

const activeGenre = ref<string | null>(null)

const featuredShow = computed(() => topRatedShows.value[0] ?? null)
const hasFavorites = computed(() => showsStore.favorites.length > 0)

const visibleSections = computed(() => {
	if (activeGenre.value === null || activeGenre.value === 'All' || activeGenre.value === '__favorites__' && !hasFavorites.value) return genreSections.value
	if (activeGenre.value === '__favorites__' && hasFavorites.value) {
		// Non repeating list of favorited shows across all genres
		return [
			{
				genre: 'Favorites',
				shows: genreSections.value
					.flatMap((s) => s.shows)
					.filter((show) => showsStore.isFavorite(show.id))
					.reduce((unique, show) => {
						if (!unique.some((s) => s.id === show.id)) unique.push(show)
						return unique
					}, [] as typeof genreSections.value[0]['shows']),
			},
		]
	}
	return genreSections.value.filter((s) => s.genre === activeGenre.value)
})
</script>

<template>
	<section class="max-w-7xl mx-auto px-4 py-6 space-y-8">
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
			<HeroBanner
				v-if="featuredShow && !hasQuery"
				:show="featuredShow"
				class="mb-8"
			/>

			<GenreFilter
				:show-favorites-tab="hasFavorites"
				:active-genre="activeGenre"
				@select="activeGenre = $event"
			/>

			<TopRatedGrid
				v-if="activeGenre === 'All' || activeGenre === null"
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
	</section>
</template>