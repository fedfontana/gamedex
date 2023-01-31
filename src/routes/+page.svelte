<script>
	import { goto } from '$app/navigation';
	import { is_logged_in } from '$src/stores';
	import { Search } from 'tabler-icons-svelte';

	let game_query = '';
</script>

<div class="mx-auto text-lg flex flex-col gap-8 w-fit mt-32">
	<div class="flex flex-col gap-2">
		<form
			on:submit|preventDefault={() => {
				goto(`/games/${encodeURIComponent(game_query)}`);
			}}
		>
			<div class="form-control">
				<div class="input-group">
					<input
						type="text"
						placeholder="Search"
						class="input input-bordered w-80"
						bind:value={game_query}
					/>
					<button type="submit" class="btn btn-square btn-primary">
						<Search class="pr-1" />
					</button>
				</div>
			</div>
		</form>
		<span class="text-center">
			or
			<a class="link link-secondary btn btn-link" href="/games">see the whole backlog</a>
			|
			<a class="link link-secondary btn btn-link" href="/events">see all the events</a>
		</span>
	</div>

	{#if $is_logged_in}
		<span class="text-center">
			<a class="link link-secondary btn btn-link" href="/new">add new game</a> |
			<a class="link link-secondary btn btn-link" href="/events/new">add new event</a>
		</span>
	{/if}
	<span class="text-center">
		<a class="link link-secondary btn btn-link" href="/nextup">tmp nextup link</a>
	</span>
</div>
