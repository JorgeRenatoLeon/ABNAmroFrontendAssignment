<script setup lang="ts">
import { provide } from 'vue'
import { useSearch } from '@/composables/useSearch'
import AppShell from '@/components/layout/AppShell.vue'

const { query, results, isLoading, clearSearch, hasQuery, isEmptyResult } = useSearch()

// Provide the search object to child components
provide('globalSearch', { query, results, isLoading, clearSearch, hasQuery, isEmptyResult })
</script>

<template>
	<AppShell
		:search-query="query"
		:is-search-loading="isLoading"
		@update:search-query="query = $event"
		@clear-search="clearSearch"
	>
		<RouterView v-slot="{ Component }">
			<Transition
				name="page"
				mode="out-in"
			>
				<component
					:is="Component"
					:key="$route.fullPath"
				/>
			</Transition>
		</RouterView>
	</AppShell>
</template>