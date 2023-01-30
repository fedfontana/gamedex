<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="w-full flex flex-col items-center gap-4 mt-24">
	<h2 class="font-semibold text-3xl">
		An error occurred
	</h2>
	{#if $page.error?.message}
		<h2 class="font-medium text-xl">{$page.error.message}</h2>
	{/if}
	<a href="/" class="link link-accent">Return to the home page</a>
</div>
