<script lang="ts">
	import { is_logged_in } from '$src/stores';
	import '../tailwind.css';
	import Navbar from './Navbar.svelte';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import Toasts from './Toasts.svelte';
	import { addToast } from '$src/toast';


	export let data: LayoutData;
	$: {
		if (data) {
			$is_logged_in = data.is_logged_in;
		}
	}

	onMount(() => {
		themeChange(false);
	});
	let idx = 0;

	const options = ["info", "success", "warning", "error"] as const;
</script>

<div class="max-w-screen min-h-screen overflow-y-scroll flex flex-col">
	<Navbar />
	<main class="overflow-hidden">
		<slot />
	</main>
	<button on:click={() => {
		idx += 1;
		addToast({
			title: `Ciao ${idx}`,
			message: "henlog",
			type: options[Math.floor(Math.random()*4)],
		})
	}}>
		ciaone
	</button>
	<Toasts/>
</div>
