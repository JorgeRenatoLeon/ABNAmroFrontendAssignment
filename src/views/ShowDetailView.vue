<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ShowCarousel from '@/components/common/ShowCarousel.vue'
import RatingBadge from '@/components/common/RatingBadge.vue'
import GenreTag from '@/components/common/GenreTag.vue'
import CastSection from '@/components/common/CastSection.vue'
import ShowDetailSkeleton from '@/components/common/ShowDetailSkeleton.vue'
import { useShowDetails } from '@/composables/useShowDetails'
import { useRelatedShows } from '@/composables/useRelatedShows'
import { stripHtmlTags } from '@/utils/show'
import { useMeta } from '@/composables/useMeta'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const showId = computed(() => Number(route.params.id) || null)

const { show, cast, isLoading, error, fetchShowDetails } = useShowDetails(() => showId.value)
const { relatedShows, isLoading: isLoadingRelated } = useRelatedShows(show)

const summary = computed(() => stripHtmlTags(show.value?.summary ?? null))

const meta = computed(() => {
	if (!show.value) return []
	const s = show.value
	return [
		{ label: t('show.status'), value: s.status },
		// Format dates
		{ label: t('show.premiered'), value: s.premiered ? new Date(s.premiered).toLocaleDateString() : 'Unknown' },
		{
			label: t('show.ended'),
			value: s.ended ? new Date(s.ended).toLocaleDateString() : 'N/A',
		},
		{ label: t('show.runtime'), value: s.runtime ? `${s.runtime} min` : 'Unknown' },
		{ label: t('show.language'), value: s.language ?? 'Unknown' },
		{ label: t('show.network'), value: s.network?.name ?? s.webChannel?.name ?? 'Unknown' },
		{
			label: t('show.schedule'),
			value: s.schedule.days.length
				? `${s.schedule.days.join(', ')} at ${s.schedule.time || 'TBA'}`
				: 'Unknown',
		},
	]
})

watch(show, (s) => {
	if (s) {
		useMeta({
			title: s.name,
			description: summary.value ?? undefined,
			image: s.image?.original ?? undefined,
		})
	}
}, { immediate: true })

function goBack() {
	if (window.history.length > 1) {
		router.go(-1)
	} else {
		router.push({ name: 'dashboard' })
	}
}
</script>

<template>
	<section class="max-w-7xl mx-auto px-4 py-6">
		<button
			type="button"
			class="cursor-pointer inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-teal-700 dark:hover:text-teal-400 transition-colors mb-6"
			aria-label="Go back to previous page"
			role="button"
			tabindex="0"
			@click="goBack"
			@keydown.enter="goBack"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				aria-hidden="true"
			>
				<path d="M19 12H5M12 5l-7 7 7 7" />
			</svg>
			{{ t('show.backButton') }}
		</button>

		<!-- Loading -->
		<ShowDetailSkeleton v-if="isLoading" />

		<!-- Error -->
		<div
			v-else-if="error"
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
				@click="fetchShowDetails(showId!)"
			>
				{{ t('errors.retryPrompt') }}
			</button>
		</div>

		<template v-else-if="show">
			<div class="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-10">
				<div class="shrink-0 w-40 sm:w-52 mx-auto sm:mx-0">
					<div class="relative rounded-xl overflow-hidden aspect-2/3 bg-gray-100 dark:bg-gray-800 shadow-md">
						<img
							v-if="show.image"
							:src="show.image.original"
							:alt="`${show.name} poster`"
							width="400"
							height="562"
							loading="eager"
							decoding="async"
							class="w-full h-full object-cover"
						>
						<div
							v-else
							class="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600"
							aria-hidden="true"
						>
							<svg
								width="48"
								height="48"
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
					</div>
				</div>

				<!-- Info -->
				<div class="flex flex-col gap-4 flex-1">
					<div>
						<h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
							{{ show.name }}
						</h1>
						<div class="flex flex-wrap items-center gap-2">
							<RatingBadge :rating="show.rating.average" />
							<GenreTag
								v-for="genre in show.genres"
								:key="genre"
								:genre="genre"
							/>
						</div>
					</div>

					<p
						v-if="summary"
						class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl"
					>
						{{ summary }}
					</p>

					<dl class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mt-auto">
						<div
							v-for="item in meta"
							:key="item.label"
						>
							<dt class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
								{{ item.label }}
							</dt>
							<dd class="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
								{{ item.value }}
							</dd>
						</div>
					</dl>
				</div>
			</div>

			<CastSection
				v-if="cast.length > 0"
				:cast="cast"
				class="mb-10"
			/>

			<ShowCarousel
				v-if="relatedShows.length > 0 || isLoadingRelated"
				title="Related Shows"
				:shows="relatedShows"
				:is-loading="isLoadingRelated"
				class="mb-10"
			/>
		</template>
	</section>
</template>
