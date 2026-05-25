<script setup lang="ts">
import { useShows } from '@/composables/useShows'

const { isLoading, error, topRatedShows, genreSections } = useShows()
</script>

<template>
    <main class="p-6">
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <p v-if="isLoading">Loading shows...</p>
        <p v-else-if="error">{{ error }}</p>
        <div v-else>
            <p>Top rated: {{ topRatedShows.length }}</p>
            <p>Genres: {{ genreSections.length }}</p>
        </div>
    </main>
</template>