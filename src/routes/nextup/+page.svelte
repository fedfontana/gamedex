<script lang="ts">
	import { addToast } from '$src/toast';
	import type { CalendarMonthEvent } from './types';
	import Calendar from '@toast-ui/calendar';
	import { onMount } from 'svelte';

	let req = {
		month: 1,
		year: 2006
	};

	let data: CalendarMonthEvent[] = [];
	async function sumbit_handler() {
		const response = await fetch(`/nextup?month=${req.month}&year=${req.year}`);
		if (response.ok) {
			data = await response.json();
			calendar.setDate(new Date(req.year, req.month - 1));
			calendar.createEvents([
				{
					id: '1',
					calendarId: '1',
					title: 'my schedule',
					category: 'time',
					dueDateClass: '',
					start: '2023-01-18T22:30:00+09:00',
					end: '2023-01-19T02:30:00+09:00'
				},
				{
					id: '2',
					calendarId: '1',
					title: 'second schedule',
					category: 'time',
					dueDateClass: '',
					start: '2023-01-18T17:30:00+09:00',
					end: '2023-01-19T17:31:00+09:00',
					isReadOnly: true,
				},
				...data.map((e, i) => {
					console.log('processing e: ', e);
					switch (e.type) {
						case 'game':
							return {
								id: i.toString(),
								calendarId: '1',
								isReadOnly: true,
                                category: 'task',
								title: e.data.name,
								start: e.data.release_date as Date,
								isAllDay: true
							} as const;
						case 'DLC':
							return {
								id: i.toString(),
								calendarId: '1',
								isReadOnly: true,
                                category: 'task',
								title: e.data.name,
								start: e.data.release_date as Date,
								isAllDay: true
							} as const;
						case 'game_event':
							return {
								id: i.toString(),
								calendarId: '1',
								isReadOnly: true,
                                category: 'task',
								title: e.data.name,
								start: e.data.begin_dt,
								end: e.data.end_dt ?? undefined,
								isAllDay: e.data.end_dt === null
							} as const;
						case 'event':
							return {
								id: i.toString(),
								calendarId: '1',
								isReadOnly: true,
                                category: 'task',
								title: e.data.name,
								start: e.data.begin_dt,
								end: e.data.end_dt
							} as const;
					}
				})
			]);
		} else {
			addToast({
				type: 'error',
				title: 'error'
			});
		}
	}

	let calendar: Calendar;
	onMount(() => {
		calendar = new Calendar('#calendar', {
			usageStatistics: false,
			defaultView: 'month',
			isReadOnly: true,
			month: {
				startDayOfWeek: 1
			}
		});
	});
</script>

<div class="flex flex-col gap-12 items-center w-full mb-24s">
	<form on:submit|preventDefault={sumbit_handler} class="flex flex-row items-end gap-4">
		<div class="input-group flex-col">
			<label class="label" for="month">month</label>
			<input
				class="input input-bordered"
				name="month"
				type="number"
				min={1}
				max={12}
				bind:value={req.month}
			/>
		</div>
		<div class="input-group flex-col">
			<label class="label" for="year">year</label>
			<input class="input input-bordered" name="year" type="number" min={0} bind:value={req.year} />
		</div>
		<button class="btn btn-primary btn-square" type="submit">check</button>
	</form>
	<div class="flex flex-col gap-6 items-center mx-auto w-8/12">
		{#each data as e}
			<div class="border w-full">
				<h1 class="text-red-600">{e.type}</h1>
				<p class="flex flex-wrap">
					{JSON.stringify(e.data, null, 2)}
				</p>
			</div>
		{/each}
	</div>
</div>
<div id="calendar" class="w-full h-[46rem]" />
