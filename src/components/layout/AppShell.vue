<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useI18n } from 'vue-i18n'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AccessibilityModal from '@/components/common/AccessibilityModal.vue'

defineProps<{ searchQuery: string; isSearchLoading: boolean }>()
const emit = defineEmits<{
	'update:searchQuery': [value: string]
	'clearSearch': []
}>()

const { t } = useI18n()
const uiStore = useUIStore()
const settingsOpen = ref(false)
const mobileSidebarOpen = ref(false)
</script>

<template>
	<div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
		<a
			href="#main-content"
			class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-(--color-primary-hover) focus:rounded-lg focus:shadow-lg focus:font-medium text-sm"
		>
			{{ t('a11y.skipToContent') }}
		</a>

		<div
			aria-live="polite"
			aria-atomic="true"
			class="sr-only"
		>
			{{ uiStore.liveMessage }}
		</div>

		<div class="hidden lg:flex shrink-0">
			<AppSidebar @open-settings="settingsOpen = true" />
		</div>

		<Transition name="drawer">
			<div
				v-if="mobileSidebarOpen"
				class="lg:hidden fixed inset-0 z-40 flex"
			>
				<div
					class="absolute inset-0 bg-black/50"
					aria-hidden="true"
					@click="mobileSidebarOpen = false"
				/>
				<div class="relative z-10 flex">
					<AppSidebar @open-settings="() => { mobileSidebarOpen = false; settingsOpen = true }" />
				</div>
			</div>
		</Transition>

		<div class="flex flex-col flex-1 min-w-0 overflow-hidden">
			<AppHeader
				:search-query="searchQuery"
				:is-search-loading="isSearchLoading"
				@update:search-query="emit('update:searchQuery', $event)"
				@clear-search="emit('clearSearch')"
				@open-sidebar="mobileSidebarOpen = true"
			/>
			<main
				id="main-content"
				class="flex-1 overflow-y-auto"
				tabindex="-1"
			>
				<slot />
			</main>
		</div>

		<AccessibilityModal
			:open="settingsOpen"
			@close="settingsOpen = false"
		/>
	</div>
</template>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: opacity 200ms ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
</style>