<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMeta } from '@/composables/useMeta'
import { useShowMap } from '@/composables/useShowMap'
import ShowCard from '@/components/common/ShowCard.vue'
import type { CountryGroup } from '@/composables/useShowMap'

const { t } = useI18n()
useMeta({ title: t('nav.map') })

const {
	loading, error, countryGroups, selectedCountry, selectedShows, load,
} = useShowMap()

onMounted(() => void load())

// Top 5 countries for a bar chart visual
const topCountries = computed(() => countryGroups.value.slice(0, 15))

function selectCountry(group: CountryGroup) {
	selectedCountry.value = selectedCountry.value === group.code ? null : group.code
}

const maxCount = computed(() => topCountries.value[0]?.count ?? 1)
</script>

<template>
	<div class="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
		<h1 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
			{{ t('nav.map') }}
		</h1>
		<p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
			{{ t('map.subtitle') }}
		</p>

		<!-- Loading -->
		<div
			v-if="loading"
			class="flex items-center justify-center py-24"
			aria-busy="true"
			:aria-label="t('a11y.loading')"
		>
			<svg
				class="animate-spin w-8 h-8 text-[var(--color-primary)]"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
			</svg>
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
				{{ t('errors.retryPrompt') }}
			</button>
		</div>

		<template v-else>
			<!-- Country bar chart -->
			<section
				:aria-label="t('map.showsByCountry')"
				class="mb-10"
			>
				<h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
					{{ t('map.showsByCountry') }}
				</h2>

				<div
					role="list"
					class="space-y-2"
				>
					<button
						v-for="group in topCountries"
						:key="group.code"
						type="button"
						role="listitem"
						:aria-pressed="selectedCountry === group.code"
						:aria-label="`${group.name}: ${group.count} shows`"
						class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
						:class="selectedCountry === group.code && 'bg-[var(--color-primary-highlight)] dark:bg-gray-800'"
						@click="selectCountry(group)"
					>
						<!-- Country code badge -->
						<span
							class="shrink-0 w-10 text-center text-xs font-mono font-bold text-gray-600 dark:text-gray-400 tabular-nums"
							aria-hidden="true"
						>
							{{ group.code }}
						</span>

						<!-- Bar -->
						<div
							class="flex-1 relative h-6 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden"
							aria-hidden="true"
						>
							<div
								class="absolute inset-y-0 left-0 rounded transition-all duration-500"
								:class="selectedCountry === group.code ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-primary-highlight)] dark:bg-gray-700'"
								:style="{ width: `${(group.count / maxCount) * 100}%` }"
							/>
							<span class="absolute inset-y-0 left-3 flex items-center text-xs font-medium text-gray-700 dark:text-gray-300 z-10">
								{{ group.name }}
							</span>
						</div>

						<!-- Count -->
						<span
							class="shrink-0 text-xs tabular-nums font-medium text-gray-500 dark:text-gray-400 w-8 text-right"
							aria-hidden="true"
						>
							{{ group.count }}
						</span>
					</button>
				</div>
			</section>

			<!-- Selected country shows -->
			<section
				v-if="selectedCountry && selectedShows.length"
				:aria-label="t('map.showsFrom', { country: countryGroups.find(g => g.code === selectedCountry)?.name ?? selectedCountry })"
			>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-base font-semibold text-gray-900 dark:text-white">
						{{ countryGroups.find(g => g.code === selectedCountry)?.name }}
					</h2>
					<button
						type="button"
						class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
						@click="selectedCountry = null"
					>
						{{ t('map.clearSelection') }}
					</button>
				</div>

				<ul
					class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
					role="list"
				>
					<li
						v-for="show in selectedShows.slice(0, 20)"
						:key="show.id"
						role="listitem"
					>
						<ShowCard :show="show" />
					</li>
				</ul>
			</section>
		</template>
	</div>
</template>