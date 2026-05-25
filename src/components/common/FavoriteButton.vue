<script setup lang="ts">
import { computed } from 'vue'
import { useShowsStore } from '@/stores/shows'
import type { TVMazeShow } from '@/types/tvmaze'

const props = defineProps<{ show: TVMazeShow }>()
const store = useShowsStore()

const isFavorite = computed(() => store.isFavorite(props.show.id))

function toggle(e: Event) {
	e.stopPropagation()
	store.toggleFavorite(props.show.id)
}
</script>

<template>
	<button
		type="button"
		:aria-label="isFavorite ? `Remove ${show.name} from favorites` : `Add ${show.name} to favorites`"
		:aria-pressed="isFavorite"
		class="w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
		@click="toggle"
	>
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			:fill="isFavorite ? 'currentColor' : 'none'"
			stroke="currentColor"
			stroke-width="2"
			:class="isFavorite ? 'text-red-400' : 'text-white'"
			aria-hidden="true"
		>
			<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
		</svg>
	</button>
</template>