<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, toRefs } from 'vue'
import type { TVMazeShow } from '@/types/tvmaze'
import ShowCard from './ShowCard.vue'
import SkeletonCard from './SkeletonCard.vue'

const props = defineProps<{
	title: string
	shows: TVMazeShow[]
	isLoading?: boolean
	skeletonCount?: number
}>()

const { isLoading, shows } = toRefs(props)

const scrollRef = ref<HTMLElement | null>(null)
const showFade = ref(false)

function updateFade() {
	const el = scrollRef.value
	if (!el) {
		showFade.value = false
		return
	}
	const canScroll = el.scrollWidth > el.clientWidth
	const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
	showFade.value = canScroll && !atEnd
}

function onScroll() {
	updateFade()
}

function scroll(direction: 'left' | 'right') {
	if (!scrollRef.value) return
	const amount = scrollRef.value.clientWidth * 0.75
	scrollRef.value.scrollBy({
		left: direction === 'right' ? amount : -amount,
		behavior: 'smooth',
	})
}

onMounted(() => {
	nextTick(updateFade)
	window.addEventListener('resize', updateFade)
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateFade)
})

watch([shows, isLoading], () => nextTick(updateFade))
</script>

<template>
	<section
		:aria-label="`${title} shows`"
	>
		<div class="flex items-center justify-between mb-3">
			<h2 class="text-base font-semibold text-gray-900 dark:text-white">
				{{ title }}
				<span
					v-if="!isLoading && shows.length > 0"
					class="ml-1.5 text-sm font-normal text-gray-400"
				>
					{{ shows.length }}
				</span>
			</h2>

			<div class="hidden sm:flex gap-1">
				<button
					type="button"
					class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
					aria-label="Scroll left"
					:disabled="!showFade"
					@click="scroll('left')"
					@keydown.enter="scroll('left')"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
					>
						<path d="M15 18l-6-6 6-6" />
					</svg>
				</button>
				<button
					type="button"
					class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
					aria-label="Scroll right"
					:disabled="shows.length <= 1"
					@click="scroll('right')"
					@keydown.enter="scroll('right')"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
					>
						<path d="M9 18l6-6-6-6" />
					</svg>
				</button>
			</div>
		</div>

		<div
			class="relative"
		>
			<div
				ref="scrollRef"
				class="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
				:class="!isLoading && shows.length > 1 ? 'pr-3' : ''"
				style="scroll-snap-type: x mandatory;"
				role="list"
				aria-label="Shows carousel"
				@scroll="onScroll"
			>
				<template v-if="isLoading">
					<div
						v-for="n in (skeletonCount ?? 8)"
						:key="n"
						class="shrink-0 w-36 sm:w-40"
						style="scroll-snap-align: start;"
						role="listitem"
						aria-label="Loading show"
					>
						<SkeletonCard />
					</div>
				</template>

				<template v-else>
					<div
						v-for="show in shows"
						:key="show.id"
						class="shrink-0 w-36 sm:w-40 flex items-stretch"
						style="scroll-snap-align: start;"
						role="listitem"
						aria-label="Show: {{ show.name }}"
					>
						<ShowCard :show="show" />
					</div>

					<!-- Fading overlay -->
					<div
						v-if="!isLoading && shows.length > 1 && showFade"
						class="absolute top-0 right-0 h-full w-6 pointer-events-none bg-linear-to-r from-transparent to-white dark:to-gray-800"
					/>
				</template>
			</div>
		</div>
	</section>
</template>
