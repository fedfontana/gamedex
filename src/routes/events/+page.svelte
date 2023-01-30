<script lang="ts">
	import type { PageData } from './$types';
	import EventCard from './EventCard.svelte';

	export let data: PageData;

	function delete_with_id(id: number) {
		return () => {
			data.events = data.events.filter((e) => e.id !== id);
		};
	}
</script>

<div class="flex flex-col gap-6 items-center w-8/12 mx-auto mt-12 mb-24">
	{#each data.events as event}
		<EventCard {event} delete_func={delete_with_id(event.id)} />
	{/each}
</div>
