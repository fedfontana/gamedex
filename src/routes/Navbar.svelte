<script lang="ts">
	import { goto } from '$app/navigation';
	import Alert from '$components/Alert.svelte';
	import { DAISYUI_THEMES } from '$src/constants';
	import { is_logged_in } from '$src/stores';
	import SearchIcon from './games/[...query]/SearchIcon.svelte';
	let logout_error = false;

	let game_query = '';
</script>

<div class="navbar bg-base-100 p-4">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-4xl" href="/">gamedex</a>
	</div>
	<div class="flex-none gap-2">
		<form on:submit|preventDefault={() => {goto(`/games/${encodeURIComponent(game_query)}`);}} >
			<div class="form-control">
				<div class="input-group">
					<input type="text" placeholder="Search" class="input input-bordered w-80" bind:value={game_query}/>
					<button type="submit" class="btn btn-square btn-primary">
						<SearchIcon />
					</button>
				</div>
			</div>
		</form>

		<select data-choose-theme value="forest" class="select select-accent">
			{#each DAISYUI_THEMES as theme}
				<option value={theme}> {theme} </option>
			{/each}
		</select>

		{#if $is_logged_in}
			<div class="dropdown dropdown-end">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<img src="/icon.png" alt="Admin's propics" />
					</div>
				</label>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
				>
					<li>
						<a href="/games">Backlog</a>
					</li>
					<li>
						<button
							on:click={async () => {
								const res = await fetch('/logout', { method: 'DELETE' });
								if (res.ok) {
									$is_logged_in = false;
								} else {
									logout_error = true;
								}
							}}>Logout</button
						>
					</li>
				</ul>
			</div>
		{:else}
			<a href="/login">
				<button class="btn btn-primary shadow-xl"> login </button>
			</a>
		{/if}
	</div>
</div>

{#if logout_error}
	<Alert kind="error" title="There was an error logging you out." />
{/if}
