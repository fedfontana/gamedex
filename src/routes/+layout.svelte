<script lang="ts">
	import { is_logged_in } from '$src/stores';
	import '../tailwind.css';
	import Navbar from './Navbar.svelte';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import Toasts from './Toasts.svelte';

	export let data: LayoutData;
	$: {
		if (data) {
			$is_logged_in = data.is_logged_in;
		}
	}

	onMount(() => {
		themeChange(false);
	});
</script>

<svelte:head>
	<title>
		gamedex
	</title>
</svelte:head>

<div class="max-w-screen min-h-screen overflow-y-scroll flex flex-col selection:bg-accent-focus selection:text-primary-content">
	<Navbar />
	<main class="overflow-hidden">
		<slot />
	</main>
	<Toasts/>
</div>
