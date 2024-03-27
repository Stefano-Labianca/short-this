<script lang="ts">
	import X from 'lucide-svelte/icons/x';
	import { flip } from 'svelte/animate';
	import { Alert, TRANSITION_BASE, alerts } from 'virtue-ui';
</script>

<div class="alerts">
	{#each $alerts as alert (alert.id)}
		<div animate:flip={TRANSITION_BASE}>
			<Alert.Root {alert}>
				<Alert.Title>{alert.title}</Alert.Title>
				<Alert.Close>
					<X />
				</Alert.Close>
				<Alert.Progress />
			</Alert.Root>
		</div>
	{/each}
</div>

<style lang="postcss">
	.alerts {
		@apply fixed;
		@apply top-0;
		@apply left-0;
		@apply w-full;
		@apply p-4;
		@apply z-50;

		@apply flex;
		@apply flex-col;
		@apply gap-2;
	}
</style>
