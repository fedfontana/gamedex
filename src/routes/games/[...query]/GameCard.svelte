<script lang="ts">
	import type { Game } from '@prisma/client';
	import { Calendar, Hourglass, DeviceGamepad, Box } from 'tabler-icons-svelte';

	export let game: Game;
</script>

<div class="card w-96 h-[30rem] bg-base-100 shadow-xl image-full">
	<figure class="min-w-full min-h-full">
		<img
			class="min-w-full min-h-full"
			src={game.art_url || 'https://static-cdn.jtvnw.net/ttv-boxart/498566-500x640.jpg'}
			alt={game.art_url ? `${game.name}'s art` : 'Sample game art'}
		/>
	</figure>
	<div class="card-body gap-6">
		<div>
			<h2 class="card-title text-3xl">{game.name}</h2>
			{#if game.developer}
				<span class="text-xl font-semibold text-gray-400">
					{game.developer}
				</span>
			{/if}
		</div>

		<div class="grow-[1] flex flex-col gap-2 text-md">
			<span class="flex flex-row gap-1 items-center">
				<DeviceGamepad class="stroke-accent" size={30} />
				Platform: {game.platform}
			</span>
			{#if game.play_time > 0}
				<span class="flex flex-row gap-2 items-center">
					<Hourglass class="stroke-accent" size={30} />

					Play time: {game.play_time} hour(s)
				</span>
			{/if}
			<span class="flex flex-row gap-2 items-center">
				<Box class="stroke-accent" size={30} />
				Status: {game.status}
			</span>
			<span class="flex flex-row gap-2 items-center">
				<Calendar class="stroke-accent" size={30} />
				Release date: {game.release_date ? (new Date(game.release_date)).toDateString() : 'unknown'}
			</span>
		</div>

		<div class="card-actions justify-end">
			<a href="/game/{encodeURIComponent(game.short_name)}">
				<button class="btn btn-primary"> Details </button>
			</a>
		</div>
	</div>
</div>
