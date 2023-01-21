<script lang="ts">
	import { fly } from 'svelte/transition';

	type AlertKind = 'info' | 'warning' | 'success' | 'error';

	export let visible = true;
	export let title: string;
	export let message: string = '';
	export let kind: AlertKind = 'info';
	export let open_for = 2000;

	let timeout: NodeJS.Timeout | null = null;
	$: {
		if (visible) {
			timeout = setTimeout(() => {
				visible = false;
			}, open_for);
		}
	}
</script>

{#if visible}
	<div
		class="alert shadow-lg absolute bottom-4 right-4 max-w-md"
		class:alert-info={kind === 'info'}
		class:alert-warning={kind === 'warning'}
		class:alert-error={kind === 'error'}
		class:alert-success={kind === 'success'}
		transition:fly={{ y: 200, duration: 2000 }}
	>
		<div>
			{#if kind === 'success'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
			{:else if kind === 'warning'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/></svg
				>
			{:else if kind === 'error'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
			{:else if kind === 'info'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="stroke-current flex-shrink-0 w-6 h-6"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
			{/if}

			{#if message}
				<div>
					<h3 class="font-bold">{title}</h3>
					<div class="text-xs">{message}</div>
				</div>
			{:else}
				<span>{title}</span>
			{/if}
		</div>
		<div class="flex-none">
			<button
				class="btn btn-sm"
				class:btn-warning={kind === 'warning'}
				class:btn-error={kind === 'error'}
				class:btn-info={kind === 'info'}
				class:btn-success={kind === 'success'}
				on:click={() => {
					visible = false;
					if (timeout) {
						clearTimeout(timeout);
					}
					timeout = null;
				}}
			>
				Close
			</button>
		</div>
	</div>
{/if}
