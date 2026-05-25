<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useUIStore, type FontSize } from '@/stores/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const uiStore = useUIStore()
const closeBtn = ref<HTMLButtonElement | null>(null)
const dialogRef = ref<HTMLDivElement | null>(null)

function trapFocus(e: KeyboardEvent) {
	if (!dialogRef.value) return
	const focusable = Array.from(
		dialogRef.value.querySelectorAll<HTMLElement>(
			'button, [href], input, select, [tabindex]:not([tabindex="-1"])',
		),
	)
	const first = focusable[0]
	const last = focusable[focusable.length - 1]
	if (e.key === 'Tab') {
		if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
		else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
	}
	if (e.key === 'Escape') emit('close')
}

watch(() => props.open, async (val) => {
	if (val) {
		await nextTick()
		closeBtn.value?.focus()
		document.addEventListener('keydown', trapFocus)
	} else {
		document.removeEventListener('keydown', trapFocus)
	}
})

onUnmounted(() => document.removeEventListener('keydown', trapFocus))

const fontSizes: { val: FontSize; label: string }[] = [
	{ val: 'sm', label: 'fontSizeSmall' },
	{ val: 'md', label: 'fontSizeMedium' },
	{ val: 'lg', label: 'fontSizeLarge' },
]

const toggleSettings = [
	{ key: 'reducedMotion' as const, label: 'reducedMotion' },
	{ key: 'highContrast' as const, label: 'highContrast' },
	{ key: 'enhancedFocus' as const, label: 'focusIndicators' },
]
</script>

<template>
	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="open"
				class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
			>
				<div
					class="absolute inset-0 bg-black/50 backdrop-blur-sm"
					aria-hidden="true"
					@click="emit('close')"
				/>

				<div
					ref="dialogRef"
					class="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-6"
				>
					<div class="flex items-center justify-between">
						<h2
							id="modal-title"
							class="text-base font-semibold text-gray-900 dark:text-gray-100"
						>
							{{ t('settings.title') }}
						</h2>
						<button
							ref="closeBtn"
							type="button"
							:aria-label="t('settings.close')"
							class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
							@click="emit('close')"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<line
									x1="18"
									y1="6"
									x2="6"
									y2="18"
								/><line
									x1="6"
									y1="6"
									x2="18"
									y2="18"
								/>
							</svg>
						</button>
					</div>

					<!-- Font size -->
					<fieldset class="space-y-2">
						<legend class="text-sm font-medium text-gray-700 dark:text-gray-300">
							{{ t('settings.fontSize') }}
						</legend>
						<div class="flex gap-2">
							<button
								v-for="size in fontSizes"
								:key="size.val"
								type="button"
								:aria-pressed="uiStore.fontSize === size.val"
								:class="[
									'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)',
									uiStore.fontSize === size.val
										? 'border-(--color-primary) bg-(--color-primary-highlight) text-(--color-primary-hover) dark:text-(--color-primary)'
										: 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300',
								]"
								@click="uiStore.setFontSize(size.val)"
							>
								{{ t(size.label) }}
							</button>
						</div>
					</fieldset>

					<!-- Toggle switches -->
					<div class="space-y-4">
						<div
							v-for="setting in toggleSettings"
							:key="setting.key"
							class="flex items-center justify-between"
						>
							<label
								:for="`toggle-${setting.key}`"
								class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
							>
								{{ t(setting.label) }}
							</label>
							<button
								:id="`toggle-${setting.key}`"
								type="button"
								role="switch"
								:aria-checked="uiStore[setting.key]"
								:class="[
									'relative w-10 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2',
									uiStore[setting.key] ? 'bg-(--color-primary)' : 'bg-gray-200 dark:bg-gray-700',
								]"
								@click="uiStore[`set${setting.key.charAt(0).toUpperCase() + setting.key.slice(1)}` as 'setReducedMotion' | 'setHighContrast' | 'setEnhancedFocus'](!uiStore[setting.key])"
							>
								<span
									:class="['absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform', uiStore[setting.key] && 'translate-x-4']"
									aria-hidden="true"
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 180ms ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>