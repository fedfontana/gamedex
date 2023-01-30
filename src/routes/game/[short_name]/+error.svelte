<script>
	import { page } from '$app/stores';
	import { is_logged_in } from '$src/stores';
</script>

<div class="flex flex-col items-center gap-4 mt-24">
	{#if $page.status === 404}
		<h2 class="font-semibold text-2xl">
			Game with short name "{$page.params.short_name}" not found
		</h2>
		{#if $is_logged_in}
			<!-- TODO remove hard-coded px and py and find a way to stop it from shrinking -->
			<a
				class="btn btn-square btn-primary min-w-fit px-6 py-2"
				href="/new?short_name={$page.params.short_name}"
			>
				create it
			</a>
		{/if}
	{:else}
		<h2 class="font-semibold text-3xl">An error occurred</h2>
		{#if $page.error?.message}
			<h2 class="font-medium text-xl">{$page.error.message}</h2>
		{/if}
	{/if}
	<a href="/" class="link link-accent">Return to the home page</a>
</div>
