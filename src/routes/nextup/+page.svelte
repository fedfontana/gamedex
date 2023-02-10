<script lang="ts">
	import { addToast } from '$src/toast';
	import Calendar from '@toast-ui/calendar';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { CalendarMonthEvent } from './types';

	let req = {
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear()
	};

	export let data: PageData;

	let calendar_events = db_events_to_calendar_events(data.calendar_events);
	$: console.log(calendar_events);

	function db_events_to_calendar_events(calendar_events: CalendarMonthEvent[]) {
		const event_ids: string[] = [];
		const mapped_events = calendar_events.map((e) => {
			console.log('processing e: ', e);
			switch (e.type) {
				case 'game':
					const gid = `game${e.data.id}`;
					event_ids.push(gid);
					return {
						id: gid,
						calendarId: '1',
						isReadOnly: true,
						category: 'task',
						title: e.data.name,
						start: e.data.release_date as Date,
						isAllDay: true
					} as const;
				case 'DLC':
					const dlcid = `dlc${e.data.id}`;
					event_ids.push(dlcid);
					return {
						id: dlcid,
						calendarId: '1',
						isReadOnly: true,
						category: 'task',
						title: e.data.name,
						start: e.data.release_date as Date,
						isAllDay: true
					} as const;
				case 'game_event':
					const geid = `game_event${e.data.id}`;
					event_ids.push(geid);
					return {
						id: geid,
						calendarId: '1',
						isReadOnly: true,
						category: 'task',
						title: e.data.name,
						start: e.data.begin_dt,
						end: e.data.end_dt ?? undefined,
						isAllDay: e.data.end_dt === null
					} as const;
				case 'event':
					const eid = `event${e.data.id}`;
					event_ids.push(eid);
					return {
						id: eid,
						calendarId: '1',
						isReadOnly: true,
						category: 'task',
						title: e.data.name,
						start: e.data.begin_dt,
						end: e.data.end_dt
					} as const;
			}
		});
		return {
			ids: event_ids,
			events: mapped_events
		};
	}

	async function sumbit_handler(year: number, month: number) {
		const response = await fetch(`/nextup?month=${month}&year=${year}`);
		if (response.ok) {
			let calendar_events = await response.json();

			// Set the events to be shown
			data.calendar_events = calendar_events;

			// Map db events to calendar events
			const { ids, events } = db_events_to_calendar_events(calendar_events);

			// Remove old events
			ids.forEach((id) => calendar.deleteEvent(id, '1'));
			// tmp delete hard coded events
			calendar.deleteEvent('1', '1');
			calendar.deleteEvent('2', '1');

			// Set new date for the calendar
			calendar.setDate(new Date(year, month - 1));

			// Add new events
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
					isReadOnly: true
				},
				...events
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

		// Add new events
		calendar.createEvents(calendar_events.events);
	});
</script>

<div class="flex flex-row gap-2 items-center mx-auto w-fit">
	<button
		class="btn btn-primary btn-square"
		on:click={() => {
			calendar.prev();
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
			calendar.next();
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
<div id="calendar" class="w-full h-[46rem]" />
<div class="flex flex-col gap-12 items-center w-full mb-24s">
	<div class="flex flex-col gap-6 items-center mx-auto w-8/12">
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
