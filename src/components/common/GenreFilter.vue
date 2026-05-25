<script setup lang="ts">
import GenreTag from './GenreTag.vue'
import { DASHBOARD_GENRES } from '@/services/tvmaze.constants'

const props = defineProps<{
	activeGenre: string | null
	showFavoritesTab?: boolean
}>()

const emit = defineEmits<{
	select: [genre: string | null]
}>()

function onSelect(genre: string) {
	emit('select', props.activeGenre === genre ? null : genre)
}
</script>

<template>
	<nav
		class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
		aria-label="Filter by genre"
	>
		<GenreTag
			genre="All"
			:clickable="true"
			:active="activeGenre === null"
			@click="$emit('select', null)"
		/>
		<button
			v-if="showFavoritesTab"
			type="button"
			:aria-pressed="activeGenre === '__favorites__'"
			:class="[
				'cursor-pointer inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors',
				activeGenre === '__favorites__'
					? 'bg-teal-700 text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
			]"
			@click="$emit('select', activeGenre === '__favorites__' ? null : '__favorites__')"
		>
			Favorites
		</button>
		<GenreTag
			v-for="genre in DASHBOARD_GENRES"
			:key="genre"
			:genre="genre"
			:clickable="true"
			:active="activeGenre === genre"
			@click="onSelect(genre)"
		/>
	</nav>
</template>