<script lang="ts">
	import { addToast } from '$src/toast';
	import type { PageData } from './$types';
	import type { CalendarMonthEvent } from './types';

	let req = {
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear()
	};

	export let data: PageData;

	async function sumbit_handler(year: number, month: number) {
		const response = await fetch(`/nextup?month=${month}&year=${year}`);
		if (response.ok) {
			let calendar_events = await response.json();

			// Set the events to be shown
			data.calendar_events = calendar_events;
		} else {
			addToast({
				type: 'error',
				title: 'error'
			});
		}
	}
</script>

<div class="flex flex-row gap-2 items-center mx-auto w-fit">
	<button
		class="btn btn-primary btn-square"
		on:click={() => {
			req.month -= 1;
			if (req.month === 0) {
				req.month = 12;
				req.year -= 1;
			}
			sumbit_handler(req.year, req.month);
		}}
	>
		prev
	</button>
	<input
		class="input input-bordered"
		name="month"
		type="number"
		min={1}
		max={12}
		bind:value={req.month}
	/>
	<input class="input input-bordered" name="year" type="number" min={0} bind:value={req.year} />
	<button
		class="btn btn-primary btn-square"
		on:click={() => {
			req.month += 1;
			if (req.month === 13) {
				req.month = 1;
				req.year += 1;
			}
			sumbit_handler(req.year, req.month);
		}}
	>
		next
	</button>
</div>
<div class="flex flex-col gap-12 items-center w-full mb-24s">
	<div class="flex flex-col gap-6 items-center mx-auto w-8/12 mt-12">
		{#each data.calendar_events as e}
			<div class="border w-full">
				<h1 class="text-red-600">{e.type}</h1>
				<p class="flex flex-wrap">
					{JSON.stringify(e.data, null, 2)}
				</p>
			</div>
		{/each}
	</div>
</div>
