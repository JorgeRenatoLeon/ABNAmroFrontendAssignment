<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { tvmazeService } from '@/services/tvmaze'
import { useMeta } from '@/composables/useMeta'
import ShowCard from '@/components/common/ShowCard.vue'
import type { TVMazePerson, TVMazeCastCredit } from '@/types/tvmaze'

const route = useRoute()
const personId = Number(route.params.id)

const person = ref<TVMazePerson | null>(null)
const credits = ref<TVMazeCastCredit[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const creditShows = computed(() =>
	credits.value
		.map(c => c._embedded.show)
		.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i) // dedupe
		.sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0))
)

onMounted(async () => {
	try {
		const [personData, creditsData] = await Promise.all([
			tvmazeService.getPerson(personId),
			tvmazeService.getPersonCastCredits(personId),
		])
		person.value = personData
		credits.value = creditsData
		useMeta({ title: personData.name, image: personData.image?.original })
	} catch {
		error.value = 'Could not load person details.'
	} finally {
		loading.value = false
	}
})
</script>

<template>
	<div class="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
		<!-- Loading -->
		<div
			v-if="loading"
			class="flex items-center justify-center py-24"
			aria-busy="true"
			aria-label="Loading person"
		>
			<svg
				class="animate-spin w-8 h-8 text-[var(--color-primary)]"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
			</svg>
		</div>

		<!-- Error -->
		<div
			v-else-if="error"
			class="text-center py-24 text-gray-500 dark:text-gray-400"
		>
			<p>{{ error }}</p>
		</div>

		<template v-else-if="person">
			<!-- Back -->
			<button
				type="button"
				aria-label="Go back"
				class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
				@click="$router.go(-1)"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="M19 12H5M12 5l-7 7 7 7" />
				</svg>
				Back
			</button>

			<div class="flex flex-col sm:flex-row gap-6 mb-10">
				<div class="shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
					<img
						v-if="person.image"
						:src="person.image.medium"
						:alt="person.name"
						width="144"
						height="144"
						loading="eager"
						decoding="async"
						class="w-full h-full object-cover"
					>
					<div
						v-else
						class="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400 dark:text-gray-500"
						aria-hidden="true"
					>
						{{ person.name.charAt(0) }}
					</div>
				</div>

				<div class="flex flex-col justify-center">
					<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						{{ person.name }}
					</h1>
					<dl class="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
						<div
							v-if="person.gender"
							class="flex gap-1"
						>
							<dt class="sr-only">
								Gender
							</dt>
							<dd>{{ person.gender }}</dd>
						</div>
						<div
							v-if="person.birthday"
							class="flex gap-1"
						>
							<dt class="sr-only">
								Birthday
							</dt>
							<dd>{{ person.birthday }}</dd>
						</div>
						<div
							v-if="person.country"
							class="flex gap-1"
						>
							<dt class="sr-only">
								Country
							</dt>
							<dd>{{ person.country.name }}</dd>
						</div>
					</dl>
				</div>
			</div>

			<section
				v-if="creditShows.length"
				aria-label="Known for"
			>
				<h2 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
					Known For
				</h2>
				<ul
					role="list"
					class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
				>
					<li
						v-for="show in creditShows.slice(0, 10)"
						:key="show.id"
						role="listitem"
					>
						<ShowCard :show="show" />
					</li>
				</ul>
			</section>
		</template>
	</div>
</template>