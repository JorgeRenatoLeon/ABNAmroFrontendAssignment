<template>
	<div
		class="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
		aria-busy="true"
		aria-label="Loading show"
		role="status"
	>
		<div class="skeleton aspect-2/3 w-full" />

		<div class="p-3 flex flex-col gap-2">
			<div class="skeleton skeleton-text w-3/4" />
			<div class="skeleton skeleton-text w-1/2" />
			<div class="flex gap-1.5 mt-1">
				<div class="skeleton h-5 w-14 rounded-full" />
				<div class="skeleton h-5 w-14 rounded-full" />
			</div>
		</div>
	</div>
</template>