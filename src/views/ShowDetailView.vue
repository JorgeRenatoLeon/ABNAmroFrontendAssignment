<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useShowDetails } from '@/composables/useShowDetails'

const route = useRoute()
const showId = computed(() => Number(route.params.id) || null)

const { show, cast, isLoading, error } = useShowDetails(() => showId.value)
</script>

<template>
  <main class="p-6">
    <p v-if="isLoading">Loading show details...</p>
    <p v-else-if="error">{{ error }}</p>
    <div v-else-if="show">
      <h1 class="text-2xl font-bold">{{ show.name }}</h1>
      <p>Cast members: {{ cast.length }}</p>
    </div>
  </main>
</template>