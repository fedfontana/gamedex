<script lang="ts">
	import Toast from '$components/Toast.svelte';

	import { dismissToast, toasts } from '$src/toast';
</script>

{#if $toasts}
	<section class="fixed right-0 bottom-0 mb-4 mr-4 flex flex-col gap-2 w-1/4">
		{#each $toasts as toast (toast.id)}
			<Toast
                title={toast.title}
				message={toast.message}
				type={toast.type}
				dismissible={toast.dismissible}
				on:dismiss={() => dismissToast(toast.id)}
			/>
		{/each}
	</section>
{/if}
