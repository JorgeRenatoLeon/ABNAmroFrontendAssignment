<template>
	<div
		role="status"
		aria-busy="true"
		aria-label="Loading show details"
	>
		<div class="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-10">
			<div class="shrink-0 w-40 sm:w-52 mx-auto sm:mx-0">
				<div class="skeleton aspect-2/3 w-full rounded-xl" />
			</div>

			<div class="flex flex-col gap-4 flex-1">
				<div class="skeleton h-8 w-2/3 rounded" />
				<div class="flex gap-2">
					<div class="skeleton h-6 w-16 rounded-full" />
					<div class="skeleton h-6 w-16 rounded-full" />
					<div class="skeleton h-6 w-16 rounded-full" />
				</div>
				<div class="space-y-2">
					<div class="skeleton skeleton-text w-full" />
					<div class="skeleton skeleton-text w-full" />
					<div class="skeleton skeleton-text w-3/4" />
				</div>
				<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
					<div
						v-for="n in 6"
						:key="n"
						class="space-y-1"
					>
						<div class="skeleton h-3 w-16 rounded" />
						<div class="skeleton h-4 w-24 rounded" />
					</div>
				</div>
			</div>
		</div>

		<div class="mb-10">
			<div class="skeleton h-5 w-16 rounded mb-3" />
			<div class="flex gap-4">
				<div
					v-for="n in 8"
					:key="n"
					class="shrink-0 flex flex-col items-center gap-1.5"
				>
					<div class="skeleton w-16 h-16 rounded-full" />
					<div class="skeleton h-3 w-14 rounded" />
				</div>
			</div>
		</div>
	</div>
</template>