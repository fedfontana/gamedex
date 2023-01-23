<script lang="ts">
	import { is_logged_in } from '$src/stores';
	import '../tailwind.css';
	import Navbar from './Navbar.svelte';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';


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

<div class="max-w-screen max-h-screen flex flex-col">
	<Navbar />
	<main class="overflow-hidden">
		<slot />
	</main>
</div>
