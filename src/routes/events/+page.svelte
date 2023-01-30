<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { page } from '$app/stores';
	import { addToast } from '$src/toast';
	import { Search } from 'tabler-icons-svelte';
	import type { PageData } from './$types';
	import EventCard from './EventCard.svelte';

	export let data: PageData;

	function delete_with_id(id: number) {
		return () => {
			data.events = data.events.filter((e) => e.id !== id);
		};
	}

	const handle_search: SubmitFunction = () => {
		return async ({ result, form }) => {
			switch (result.type) {
				case 'success':
					data.events = result.data?.events ?? [];
					form.reset();
					break;
				case 'error':
				case 'failure':
					addToast({
						type: 'error',
						title: 'Something went wrong while fetching events'
					});
					break;
			}
		};
	};
</script>

<div class="flex flex-col gap-12 items-center w-8/12 mx-auto mt-12 mb-24">
	<form method="POST" use:enhance={handle_search} class="flex flex-col gap-2 items-center">
		<div class="form-control">
			<div class="input-group">
				<input type="text" placeholder="Search" name="query" class="input input-bordered w-80" value={$page.url.searchParams.get("q") ?? ''} />
				<button type="submit" class="btn btn-square btn-primary">
					<Search class="pr-1" />
				</button>
			</div>
		</div>
		<span class="flex flex-row gap-2 items-center">
			<input type="checkbox" name="show_all" class="checkbox checkbox-primary" />
			<label for="show_all"> show past events </label>
		</span>
	</form>

	<div class="flex flex-col gap-6 items-center w-full">
		{#each data.events as event}
			<EventCard {event} delete_func={delete_with_id(event.id)} />
		{/each}
	</div>
</div>
