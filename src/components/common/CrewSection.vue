<script setup lang="ts">
import type { TVMazeCrew } from '@/types/tvmaze'

defineProps<{ crew: TVMazeCrew[] }>()

function groupByType(crew: TVMazeCrew[]): Map<string, TVMazeCrew[]> {
	const map = new Map<string, TVMazeCrew[]>()
	for (const member of crew) {
		const list = map.get(member.type) ?? []
		list.push(member)
		map.set(member.type, list)
	}
	return map
}
</script>

<template>
	<section aria-label="Crew">
		<h2 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
			Crew
		</h2>

		<dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
			<div
				v-for="[type, members] in groupByType(crew)"
				:key="type"
				class="flex gap-2"
			>
				<dt class="text-xs text-gray-500 dark:text-gray-400 shrink-0 w-28 pt-0.5">
					{{ type }}
				</dt>
				<dd class="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
					{{ members.map(m => m.person.name).join(', ') }}
				</dd>
			</div>
		</dl>
	</section>
</template>