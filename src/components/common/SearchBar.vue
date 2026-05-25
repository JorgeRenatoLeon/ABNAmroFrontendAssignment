<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
	modelValue: string
	isLoading?: boolean
	placeholder?: string
}>()

const emit = defineEmits<{
	'update:modelValue': [value: string]
	clear: []
}>()

const inputRef = ref<HTMLInputElement | null>(null)

function onInput(event: Event) {
	emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function clear() {
	emit('update:modelValue', '')
	emit('clear')
	inputRef.value?.focus()
}
</script>

<template>
	<div class="relative flex items-center w-full max-w-md">
		<svg
			class="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<circle
				cx="11"
				cy="11"
				r="8"
			/>
			<path d="M21 21l-4.35-4.35" />
		</svg>

		<input
			id="search-input"
			ref="inputRef"
			type="search"
			:value="modelValue"
			:placeholder="placeholder ?? 'Search TV shows...'"
			class="w-full pl-9 pr-10 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-transparent focus:border-teal-700 focus:bg-white dark:focus:bg-gray-900 outline-none transition-colors"
			aria-label="Search TV shows"
			aria-keyshortcuts="/"
			autocomplete="off"
			spellcheck="false"
			:aria-busy="isLoading ? 'true' : 'false'"
			@input="onInput"
		>

		<!-- Loading -->
		<span
			v-if="isLoading"
			class="absolute right-3 w-4 h-4"
			aria-label="Searching..."
		>
			<svg
				class="animate-spin text-teal-700"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M21 12a9 9 0 1 1-6.22-8.56" />
			</svg>
		</span>

		<button
			v-else-if="modelValue.length > 0"
			type="button"
			class="absolute right-3 w-4 h-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
			aria-label="Clear search"
			@click="clear"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
			>
				<path d="M18 6 6 18M6 6l12 12" />
			</svg>
		</button>
	</div>
</template>
