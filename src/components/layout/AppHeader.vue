<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useShowsStore } from '@/stores/shows'
import SearchBar from '@/components/common/SearchBar.vue'

defineProps<{
  searchQuery: string
  isSearchLoading?: boolean
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  clearSearch: []
}>()

const router = useRouter()
const store = useShowsStore()

function goHome() {
  router.push({ name: 'dashboard' })
  emit('clearSearch')
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
    <div class="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-4">

      <!-- Logo -->
      <button
        type="button"
        class="flex items-center gap-2 shrink-0 font-bold text-gray-900 dark:text-white hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
        aria-label="Go to home"
        @click="goHome"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <rect width="28" height="28" rx="6" fill="#01696f" />
          <rect x="5" y="8" width="18" height="12" rx="2" fill="none" stroke="white" stroke-width="1.8" />
          <circle cx="14" cy="14" r="3" fill="white" />
          <circle cx="14" cy="14" r="1.2" fill="#01696f" />
        </svg>
        <span class="text-base hidden sm:block">TVShows</span>
      </button>

      <!-- Search — grows to fill available space -->
      <div class="flex-1 flex justify-center">
        <SearchBar
          :model-value="searchQuery"
          :is-loading="isSearchLoading"
          @update:model-value="$emit('update:searchQuery', $event)"
          @clear="$emit('clearSearch')"
        />
      </div>

      <!-- Dark mode toggle -->
      <button
        type="button"
        class="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :aria-label="store.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="store.toggleDarkMode"
      >
        <!-- Sun -->
        <svg v-if="store.isDarkMode" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <!-- Moon -->
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

    </div>
  </header>
</template>