<script setup lang="ts">
import ShowCard from '@/components/common/ShowCard.vue'
import RatingBadge from '@/components/common/RatingBadge.vue'
import GenreTag from '@/components/common/GenreTag.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import ShowCarousel from '@/components/common/ShowCarousel.vue'
import SearchResults from '@/components/common/SearchResults.vue'
import ShowDetailSkeleton from '@/components/common/ShowDetailSkeleton.vue'
import CastSection from '@/components/common/CastSection.vue'
import { ref } from 'vue'
import type { TVMazeShow } from '@/types/tvmaze'
import type { TVMazeCastMember } from '@/types/tvmaze'
import AppShell from '@/components/layout/AppShell.vue'

const search = ref('')

const mockShow: TVMazeShow = {
	id: 1,
	url: '',
	name: 'Breaking Bad',
	type: 'Scripted',
	language: 'English',
	genres: ['Drama', 'Crime'],
	status: 'Ended',
	runtime: 60,
	averageRuntime: 60,
	premiered: '2008-01-20',
	ended: '2013-09-29',
	officialSite: null,
	schedule: { time: '21:00', days: ['Sunday'] },
	rating: { average: 9.3 },
	weight: 100,
	network: null,
	webChannel: null,
	dvdCountry: null,
	externals: { tvrage: 18164, thetvdb: 81189, imdb: 'tt0903747' },
	image: {
		medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2.jpg',
		original: 'https://static.tvmaze.com/uploads/images/original_untouched/0/2.jpg',
	},
	summary: '<p>A chemistry teacher becomes a drug lord.</p>',
	updated: 1616179200,
}

const mockNoImage: TVMazeShow = { ...mockShow, id: 2, name: 'No Image Show', image: null }
const mockLowRating: TVMazeShow = { ...mockShow, id: 3, name: 'Low Rated Show', rating: { average: 4.2 } }
const mockMidRating: TVMazeShow = { ...mockShow, id: 4, name: 'Mid Rated Show', rating: { average: 6.8 } }
const mockNoRating: TVMazeShow = { ...mockShow, id: 5, name: 'Unrated Show', rating: { average: null } }



const mockCast: TVMazeCastMember[] = [
	{
		person: {
			id: 1,
			name: 'Bryan Cranston',
			image: null,
			birthday: '1956-03-07',
			gender: 'Male',
			country: {
				name: 'United States',
				code: 'US',
				timezone: 'America/New_York'
			},
			deathday: null,
			url: 'https://www.tvmaze.com/people/1/bryan-cranston',
			updated: 123141231231
		},
		character: { id: 1, name: 'Walter White', image: null },
		self: false,
		voice: false,
	},
	{
		person: {
			id: 2,
			name: 'Aaron Paul',
			image: null,
			birthday: '1979-03-12',
			gender: 'Male',
			country: {
				name: 'United States',
				code: 'US',
				timezone: 'America/New_York'
			},
			deathday: null,
			url: 'https://www.tvmaze.com/people/2/aaron-paul',
			updated: 123141231231
		},
		character: { id: 2, name: 'Jesse Pinkman', image: null },
		self: false,
		voice: false,
	},
]
</script>

<template>
	<AppShell
		:search-query="search"
		:is-search-loading="false"
		@update:search-query="search = $event"
	>
		<section class="max-w-7xl mx-auto p-6 space-y-12">
			<section>
				<h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
					RatingBadge
				</h2>
				<div class="flex flex-wrap gap-3">
					<RatingBadge :rating="9.3" />
					<RatingBadge :rating="6.8" />
					<RatingBadge :rating="4.2" />
					<RatingBadge :rating="null" />
					<RatingBadge
						:rating="9.3"
						size="sm"
					/>
				</div>
			</section>

			<section>
				<h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
					GenreTag
				</h2>
				<div class="flex flex-wrap gap-2">
					<GenreTag genre="Drama" />
					<GenreTag genre="Comedy" />
					<GenreTag
						genre="Crime"
						:clickable="true"
					/>
					<GenreTag
						genre="Action"
						:clickable="true"
						:active="true"
					/>
				</div>
			</section>

			<section>
				<h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
					SearchBar
				</h2>
				<SearchBar
					v-model="search"
					placeholder="Type something..."
				/>
				<p class="mt-2 text-sm text-gray-500">
					Value: "{{ search }}"
				</p>
			</section>

			<section>
				<h2 class="text-lg font-semibold mb-4 text-gray-900">
					SkeletonCard Component
				</h2>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg">
					<SkeletonCard
						v-for="n in 4"
						:key="n"
					/>
				</div>
			</section>

			<section>
				<h2 class="text-lg font-semibold mb-4 text-gray-900">
					ShowCard — all states
				</h2>
				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
					<ShowCard :show="mockShow" />
					<ShowCard :show="mockNoImage" />
					<ShowCard :show="mockLowRating" />
					<ShowCard :show="mockMidRating" />
					<ShowCard :show="mockNoRating" />
				</div>
			</section>

			<section>
				<h2 class="text-lg font-semibold mb-4 text-gray-900">
					ShowCarousel (loading)
				</h2>
				<ShowCarousel
					title="Drama"
					:shows="[]"
					:is-loading="true"
				/>
			</section>

			<section>
				<h2 class="text-lg font-semibold mb-4 text-gray-900">
					SearchResults (No results)
				</h2>
				<SearchResults
					query="asdqweqsad"
					:results="[]"
					:is-loading="false"
					:is-empty="true"
				/>
			</section>

			<section>
				<h2 class="text-lg font-semibold mb-4 text-gray-900">
					ShowDetailSkeleton Component
				</h2>
				<ShowDetailSkeleton />
			</section>

			<section>
				<h2 class="text-lg font-semibold mb-4 text-gray-900">
					CastSection Component
				</h2>
				<CastSection :cast="mockCast" />
			</section>
		</section>
	</AppShell>
</template>
