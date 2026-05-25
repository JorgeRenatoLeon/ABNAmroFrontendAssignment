<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMeta } from '@/composables/useMeta'
import { useTimeline } from '@/composables/useTimeline'
import ShowCard from '@/components/common/ShowCard.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import GenreTag from '@/components/common/GenreTag.vue'

const { t } = useI18n()
useMeta({ title: t('nav.timeline') })

const {
	loading, error, minRating, selectedGenre,
	groups, availableGenres, load,
} = useTimeline()

onMounted(() => void load())
</script>

<template>
	<div class="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
		<h1 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
			{{ t('nav.timeline') }}
		</h1>

		<!-- Filters bar -->
		<div class="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
			<!-- Min rating slider -->
			<fieldset class="flex items-center gap-3">
				<legend class="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
					{{ t('timeline.minRating') }}
				</legend>
				<input
					id="rating-range"
					v-model.number="minRating"
					type="range"
					min="0"
					max="10"
					step="0.5"
					class="w-28 accent-[var(--color-primary)]"
					:aria-valuenow="minRating"
					:aria-valuemin="0"
					:aria-valuemax="10"
					:aria-label="t('timeline.minRating')"
				>
				<span class="text-sm font-semibold text-[var(--color-primary)] w-8 tabular-nums">
					{{ minRating }}
				</span>
			</fieldset>

			<!-- Genre filter -->
			<div
				class="flex flex-wrap items-center gap-2"
				role="group"
				:aria-label="t('timeline.filterByGenre')"
			>
				<button
					type="button"
					:aria-pressed="selectedGenre === null"
					:class="[
						'px-3 py-1 rounded-full text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
						selectedGenre === null
							? 'bg-[var(--color-primary)] text-white'
							: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
					]"
					@click="selectedGenre = null"
				>
					{{ t('timeline.allGenres') }}
				</button>
				<button
					v-for="genre in availableGenres"
					:key="genre"
					type="button"
					:aria-pressed="selectedGenre === genre"
					:class="[
						'px-3 py-1 rounded-full text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
						selectedGenre === genre
							? 'bg-[var(--color-primary)] text-white'
							: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
					]"
					@click="selectedGenre = selectedGenre === genre ? null : genre"
				>
					{{ genre }}
				</button>
			</div>
		</div>

		<!-- Loading skeletons -->
		<div
			v-if="loading"
			aria-busy="true"
			:aria-label="t('a11y.loading')"
		>
			<div
				v-for="y in 3"
				:key="y"
				class="mb-10"
			>
				<div class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
				<ul
					class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
					role="list"
				>
					<li
						v-for="i in 5"
						:key="i"
						role="listitem"
					>
						<SkeletonCard />
					</li>
				</ul>
			</div>
		</div>

		<!-- Error -->
		<div
			v-else-if="error"
			class="text-center py-16"
		>
			<p class="text-gray-500 dark:text-gray-400 mb-4">
				{{ t('errors.networkError') }}
			</p>
			<button
				type="button"
				class="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm hover:bg-[var(--color-primary-hover)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
				@click="load"
			>
				{{ t('show.retryButton') }}
			</button>
		</div>

		<!-- Empty state -->
		<div
			v-else-if="groups.length === 0"
			class="text-center py-16"
		>
			<p class="text-gray-400 dark:text-gray-500 text-sm">
				{{ t('timeline.noResults') }}
			</p>
		</div>

		<!-- Timeline groups -->
		<div v-else>
			<section
				v-for="group in groups"
				:key="group.year"
				:aria-label="`${group.year}`"
				class="mb-12"
			>
				<div class="flex items-center gap-3 mb-4">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
						{{ group.year }}
					</h2>
					<span class="text-xs text-gray-400 dark:text-gray-500">
						{{ t('timeline.showCount', { count: group.shows.length }) }}
					</span>
					<div
						class="flex-1 h-px bg-gray-200 dark:bg-gray-800"
						aria-hidden="true"
					/>
				</div>

				<ul
					class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
					role="list"
				>
					<li
						v-for="show in group.shows.slice(0, 10)"
						:key="show.id"
						role="listitem"
					>
						<ShowCard :show="show" />
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>