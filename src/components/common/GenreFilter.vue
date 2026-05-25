<script setup lang="ts">
import GenreTag from './GenreTag.vue'
import { DASHBOARD_GENRES } from '@/services/tvmaze.constants'

const props = defineProps<{
	activeGenre: string | null
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