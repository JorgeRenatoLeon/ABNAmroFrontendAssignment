<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import SearchBar from '@/components/common/SearchBar.vue'

defineProps<{ searchQuery: string; isSearchLoading: boolean }>()
const emit = defineEmits<{
	'update:searchQuery': [value: string]
	'clearSearch': []
	'openSidebar': []
}>()

const uiStore = useUIStore()
const searchRef = ref<InstanceType<typeof SearchBar> | null>(null)

function onKeydown(e: KeyboardEvent) {
	const tag = (e.target as HTMLElement).tagName
	if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
		e.preventDefault()
		const input = searchRef.value?.$el?.querySelector('input')
		input?.focus()
	}
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
	<header class="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
		<button
			type="button"
			class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
			aria-label="Open navigation"
			@click="emit('openSidebar')"
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<line
					x1="3"
					y1="6"
					x2="21"
					y2="6"
				/>
				<line
					x1="3"
					y1="12"
					x2="21"
					y2="12"
				/>
				<line
					x1="3"
					y1="18"
					x2="21"
					y2="18"
				/>
			</svg>
		</button>

		<div class="flex-1 max-w-xl">
			<SearchBar
				ref="searchRef"
				:model-value="searchQuery"
				:is-loading="isSearchLoading"
				aria-keyshortcuts="/"
				@update:model-value="emit('update:searchQuery', $event)"
				@clear="emit('clearSearch')"
			/>
		</div>

		<button
			type="button"
			aria-label="Toggle theme"
			class="ml-auto p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
			@click="uiStore.toggleTheme()"
		>
			<svg
				v-if="uiStore.theme === 'dark'"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<circle
					cx="12"
					cy="12"
					r="5"
				/>
				<line
					x1="12"
					y1="1"
					x2="12"
					y2="3"
				/><line
					x1="12"
					y1="21"
					x2="12"
					y2="23"
				/>
				<line
					x1="4.22"
					y1="4.22"
					x2="5.64"
					y2="5.64"
				/><line
					x1="18.36"
					y1="18.36"
					x2="19.78"
					y2="19.78"
				/>
				<line
					x1="1"
					y1="12"
					x2="3"
					y2="12"
				/><line
					x1="21"
					y1="12"
					x2="23"
					y2="12"
				/>
				<line
					x1="4.22"
					y1="19.78"
					x2="5.64"
					y2="18.36"
				/><line
					x1="18.36"
					y1="5.64"
					x2="19.78"
					y2="4.22"
				/>
			</svg>
			<svg
				v-else
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</svg>
		</button>
	</header>
</template>