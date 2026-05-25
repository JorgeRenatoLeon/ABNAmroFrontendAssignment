<script setup lang="ts">
import type { TVMazeCrew } from '@/types/tvmaze'
import { RouterLink } from 'vue-router'

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
					<template
						v-for="(member, index) in members"
						:key="member.person.id"
					>
						<RouterLink
							:to="{ name: 'person', params: { id: member.person.id } }"
							class="text-teal-600 dark:text-teal-300 hover:underline"
						>
							{{ member.person.name }}
						</RouterLink>
						<span v-if="index < members.length - 1">, </span>
					</template>
				</dd>
			</div>
		</dl>
	</section>
</template>