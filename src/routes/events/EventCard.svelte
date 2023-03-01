<script lang="ts">
	import { is_logged_in } from '$src/stores';
	import { addToast } from '$src/toast';
	import type { Event } from '@prisma/client';
	import { IconCalendar as Calendar, IconTrash as Trash } from '@tabler/icons-svelte';

	export let event: Event;
	export let delete_func: () => void;
	async function delete_event() {
		const res = await fetch(`/events/${event.id}/delete`, { method: 'DELETE' });
		if (res.ok) {
			addToast({
				type: 'success',
				title: `Event with name "${event.name}" deleted successfully`
			});
			delete_func();
		} else {
			addToast({
				type: 'error',
				title: `There was an error deleting the event with name ${event.name}`
			});
		}
	}
</script>

<div class="card lg:card-side bg-base-100 shadow-xl w-full">
	{#if event.art_url}
		<figure><img src={event.art_url} alt="{event.name}'s image" class="min-w-fit" /></figure>
	{/if}
	<div class="card-body">
		<h2 class="card-title">{event.name}</h2>
		<span class="flex flex-row gap-2">
			<Calendar />
			{event.begin_dt.toLocaleDateString()}
			{event.begin_dt.getHours()}:{event.begin_dt.getMinutes()} --
			{event.end_dt.toLocaleDateString()}
			{event.end_dt.getHours()}:{event.end_dt.getMinutes()}
		</span>
		{#if event.streaming_url}
			<h4>
				Follow it live
				<a href={event.streaming_url} target="_blank" rel="noreferrer" class="link link-accent">
					here
				</a>
			</h4>
		{/if}
		{#if event.description || $is_logged_in}
			<div class="flex flex-row gap-2 justify-end h-full">
				{#if event.description}
					<p class="h-full border-base-content border-opacity-20">{event.description}</p>
				{/if}
				{#if $is_logged_in}
					<div class="card-actions h-full items-end">
						<button class="btn btn-primary btn-error" on:click={delete_event}>
							<Trash />
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
