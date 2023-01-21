<script lang="ts">
	import type { PageData } from './$types';
	import BoxIcon from './BoxIcon.svelte';
	import CalendarIcon from './CalendarIcon.svelte';
	import ConsoleIcon from './ConsoleIcon.svelte';
	import Console from './ConsoleIcon.svelte';
	import TimerIcon from './TimerIcon.svelte';
	export let data: PageData;
	const { game } = data;

	const deleteGame = async () => {
		const res = await fetch(`/games/${game.short_name}/delete`, {
			method: 'DELETE'
		});
		if (res.ok) {
			console.log('Game deleted');
		} else {
			console.error('Could not delete game for some reason. Res: ', res);
		}
	};
</script>

<div class="w-10/12 mx-auto flex flex-row gap-8 mt-10">
	<!-- left panel -->
	<div class="flex flex-col gap-4 flex-[2]">
		<!-- top part -->
		<div class="max-w-xs rounded-xl overflow-hidden">
			<img src={game.art_url ?? 'https://static-cdn.jtvnw.net/ttv-boxart/498566-500x640.jpg'} alt="{game.name} art" class="w-full" />
		</div>
		<div class="flex flex-col gap-2 w-fit mx-auto">
			<button
				class="btn btn-warning w-48"
				on:click={() => {
					console.log('Edit game');
				}}
			>
				edit
			</button>
			<button class="btn btn-error w-48" on:click={deleteGame}> delete </button>
		</div>
	</div>

	<!-- central panel -->
	<div class="flex flex-col justify-start items-start flex-[4]">
		<h2 class="text-3xl font-semibold">
			{game.name}
			{#if game.developer}
				<span class="text-2xl font-semibold text-gray-500">
					by {game.developer}
				</span>
			{/if}
		</h2>

		<!-- TODO fix this and add it back -->
		<!-- {#if game.release_date && game.release_date > new Date()}
			<Countdown end_time={game.release_date} />
		{/if} -->
		<!-- 
			TODO: add 3 tabs with:
			- useful links
			- notes
			- dlcs
		 -->
	</div>

	<!-- right panel -->
	<div class="flex flex-col gap-3 bg-base-300 shadow-xl p-4 rounded-xl flex-[2]">
		<h3 class="text-lg font-semibold">Data</h3>
		<span class="flex flex-row gap-1 items-center">
			<ConsoleIcon size="30" />
			Platform: {game.platform}
		</span>
		{#if game.play_time > 0}
			<span class="flex flex-row gap-1 items-center">
				<TimerIcon size="30" />
				Play time: {game.play_time} hour(s)
			</span>
		{/if}
		<span class="flex flex-row gap-1 items-center">
			<BoxIcon size="30" />
			Status: {game.status}
		</span>
		<span class="flex flex-row gap-1 items-center">
			<CalendarIcon size="30" />
			Release date: {game.release_date?.toDateString() ?? 'unknown'}
		</span>
	</div>
</div>
