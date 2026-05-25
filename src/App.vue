<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { useShowsStore } from '@/stores/shows'

const store = useShowsStore()

// Iinitial theme
document.documentElement.setAttribute(
  'data-theme',
  store.isDarkMode ? 'dark' : 'light'
)

// Change when toggled
watch(
  () => store.isDarkMode,
  (dark) => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }
)
</script>

<template>
  <RouterView />
</template>