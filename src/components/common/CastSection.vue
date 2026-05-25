<script setup lang="ts">
import type { TVMazeCastMember } from '@/types/tvmaze'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()

defineProps<{ cast: TVMazeCastMember[] }>()
</script>

<template>
	<section aria-label="Cast">
		<h2 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
			{{ t('show.cast') }}
		</h2>

		<div
			class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
			role="list"
		>
			<div
				v-for="member in cast.slice(0, 16)"
				:key="member.person.id"
				role="listitem"
				class="shrink-0 w-18"
			>
				<RouterLink
					:to="{ name: 'person', params: { id: member.person.id } }"
					class="group flex flex-col items-center gap-1 text-center no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg"
				>
					<div class="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
						<img
							v-if="member.person.image"
							:src="member.person.image.medium"
							:alt="member.person.name"
							width="48"
							height="48"
							loading="lazy"
							decoding="async"
							class="w-full h-full object-cover"
						>
						<div
							v-else
							class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500"
							aria-hidden="true"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<circle
									cx="12"
									cy="8"
									r="4"
								/>
								<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
							</svg>
						</div>
					</div>

					<div class="w-full">
						<p class="text-xs font-medium text-gray-800 dark:text-gray-200 leading-tight line-clamp-1">
							{{ member.person.name }}
						</p>
						<p class="text-xs text-gray-400 dark:text-gray-500 leading-tight line-clamp-1">
							{{ member.character.name }}
						</p>
					</div>
				</RouterLink>
			</div>
		</div>
	</section>
</template>