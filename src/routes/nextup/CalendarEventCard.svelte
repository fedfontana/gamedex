<script lang="ts">
	import type { CalendarMonthEvent } from './types';

	export let event: CalendarMonthEvent;
</script>

<div class="border w-full">
	{#if event.type === 'game'}
		<h1 class="text-red-600">{event.type} - {event.data.name} by {event.data.developer}</h1>
		<p class="flex flex-wrap">
            Release date: {event.data.release_date}
		</p>
	{:else if event.type === 'DLC'}
		<h1 class="text-red-600">{event.type} - {event.data.name}</h1>
        <p class="flex flex-wrap">
            Release date: {event.data.release_date}
		</p>
	{:else if event.type === 'game_event'}
		<h1 class="text-red-600">{event.type} - {event.data.name}</h1>
        <div class="flex flex-col">
            <p>
                Start: {event.data.begin_dt} - End: {event.data.end_dt}
            </p>
            <p>
                Description: {event.data.description}
            </p>
        </div> 
	{:else if event.type === 'event'}
		<h1 class="text-red-600">{event.type} - {event.data.name}</h1>
        <div class="flex flex-col">
            <p>
                Start: {event.data.begin_dt} - End: {event.data.end_dt}
            </p>
            <p>
                Description: {event.data.description}
            </p>
            <p>
                Streamed on: {event.data.streaming_url}
            </p>
        </div> 
	{/if}
</div>
