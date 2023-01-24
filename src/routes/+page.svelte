<script>
	import { goto } from '$app/navigation';
	import { is_logged_in } from '$src/stores';
	import SearchIcon from './games/[...query]/SearchIcon.svelte';

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
						<SearchIcon />
					</button>
				</div>
			</div>
		</form>
		<span class="text-center">
			or
			<a class="link link-secondary btn btn-link" href="/games">see the whole backlog</a>
		</span>
	</div>

	{#if $is_logged_in}
		<a class="link link-secondary btn btn-link" href="/new">add new entry</a>
	{/if}
</div>
