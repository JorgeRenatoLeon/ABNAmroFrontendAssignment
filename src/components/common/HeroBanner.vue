<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import RatingBadge from '@/components/common/RatingBadge.vue'
import GenreTag from '@/components/common/GenreTag.vue'
import { stripHtmlTags } from '@/utils/show'
import type { TVMazeShow } from '@/types/tvmaze'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ show: TVMazeShow }>()
const router = useRouter()

const summary = computed(() => {
	const stripped = stripHtmlTags(props.show.summary ?? '')
	return stripped.length > 180 ? stripped.slice(0, 177) + '…' : stripped
})

function goToDetail() {
	void router.push({ name: 'show-detail', params: { id: props.show.id } })
}
</script>

<template>
	<section
		class="relative overflow-hidden rounded-2xl min-h-[320px] sm:min-h-[380px] flex items-end"
		:aria-label="`Featured show: ${show.name}`"
	>
		<!-- Backdrop image -->
		<img
			v-if="show.image"
			:src="show.image.original"
			:alt="`${show.name} backdrop`"
			width="1280"
			height="720"
			loading="eager"
			decoding="async"
			class="absolute inset-0 w-full h-full object-cover object-top"
		>

		<div
			class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"
			aria-hidden="true"
		/>

		<div class="relative z-10 p-6 sm:p-8 w-full">
			<div class="flex flex-wrap items-center gap-2 mb-3">
				<RatingBadge :rating="show.rating.average" />
				<GenreTag
					v-for="genre in show.genres.slice(0, 3)"
					:key="genre"
					:genre="genre"
				/>
			</div>

			<h2 class="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2 max-w-lg">
				{{ show.name }}
			</h2>

			<p
				v-if="summary"
				class="text-sm text-white/80 leading-relaxed max-w-xl mb-5 hidden sm:block"
			>
				{{ summary }}
			</p>

			<button
				type="button"
				class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
				@click="goToDetail"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<polygon points="5 3 19 12 5 21 5 3" />
				</svg>
				{{ t('show.explore') }}
			</button>
		</div>
	</section>
</template>