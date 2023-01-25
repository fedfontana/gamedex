<script lang="ts">
	import Alert from '$components/Alert.svelte';
	import { is_logged_in } from '$src/stores';
	import type { PageData } from './$types';
	import BoxIcon from './BoxIcon.svelte';
	import CalendarIcon from './CalendarIcon.svelte';
	import ConsoleIcon from './ConsoleIcon.svelte';
	import TimerIcon from './TimerIcon.svelte';

	export let data: PageData;
	const { game } = data;

	let called_delete = false;
	let delete_ok = true;

	const deleteGame = async () => {
		called_delete = true;

		const res = await fetch(`/games/${encodeURIComponent(game.short_name)}/delete`, {
			method: 'DELETE'
		});
		if (!res.ok) {
			delete_ok = false;
			console.error('Could not delete game for some reason. Res: ', res);
		}
	};

	let new_note_content = '';
	let new_useful_link = {
		title: '',
		url: ''
	};

	//TODO add errors under notes
	async function add_new_note() {
		if (new_note_content.length < 1 || new_note_content.length > 512) return;
		//TODO handle errors
		const res = await fetch(`/game/${encodeURIComponent(game.short_name)}/notes`, {
			method: 'POST',
			body: JSON.stringify({
				gameId: game.id,
				content: new_note_content
			})
		});

		const id = (await res.json()).id as number;

		if (res.ok) {
			game.notes = [...game.notes, { id, gameId: game.id, content: new_note_content }];
			new_note_content = '';
		}
	}

	async function add_new_useful_link() {
		if (new_useful_link.title.length < 1 || new_useful_link.title.length > 128) return;
		if (new_useful_link.url.length < 1 || new_useful_link.url.length > 256) return;
		//TODO handle errors
		const res = await fetch(`/game/${encodeURIComponent(game.short_name)}/links`, {
			method: 'POST',
			body: JSON.stringify({
				gameId: game.id,
				...new_useful_link
			})
		});

		const id = (await res.json()).id as number;

		if (res.ok) {
			game.useful_links = [...game.useful_links, { id, gameId: game.id, ...new_useful_link }];
			new_useful_link = {
				title: '',
				url: ''
			};
		}
	}

	function remove_note_with_id(id: number) {
		return async () => {
			const res = await fetch(`/game/${encodeURIComponent(game.short_name)}/notes/${id}`, {
				method: 'DELETE'
			});
			if (res.ok) {
				let old_note_id = (await res.json()).id;
				game.notes = game.notes.filter((n) => n.id != old_note_id);
			}
		};
	}

	function remove_useful_link_with_id(id: number) {
		return async () => {
			const res = await fetch(`/game/${encodeURIComponent(game.short_name)}/links/${id}`, {
				method: 'DELETE'
			});
			if (res.ok) {
				let old_link_id = (await res.json()).id;
				game.useful_links = game.useful_links.filter((n) => n.id != old_link_id);
			}
		};
	}
</script>

<div class="w-10/12 mx-auto flex flex-row gap-8 mt-10">
	<!-- left panel -->
	<div class="flex flex-col gap-4 flex-[2]">
		<!-- top part -->
		<div class="max-w-xs rounded-xl overflow-hidden shadow-xl">
			<img
				src={game.art_url ?? 'https://static-cdn.jtvnw.net/ttv-boxart/498566-500x640.jpg'}
				alt="{game.name} art"
				class="w-full"
			/>
		</div>
		{#if $is_logged_in}
			<div class="flex flex-col gap-2 mx-auto w-48">
				<a
					href="/game/{encodeURIComponent(game.short_name)}/edit"
					class="btn btn-warning shadow-xl"
				>
					edit
				</a>
				<label for="modal-delete-game" class="btn btn-error shadow-xl">delete</label>
			</div>
		{/if}
	</div>

	<!-- central panel -->
	<div class="flex flex-col justify-start items-start flex-[4] gap-12">
		<h2 class="text-3xl font-semibold">
			{game.name}
			{#if game.developer}
				<span class="text-2xl font-semibold text-accent">
					by {game.developer}
				</span>
			{/if}
		</h2>

		<!-- TODO fix this and add it back -->
		<!-- {#if game.release_date && game.release_date > new Date()}
			<Countdown end_time={game.release_date} />
		{/if} -->

		<div class="flex flex-col justify-start items-start flex-[4] gap-6 w-full">
			<!-- BEGIN NOTE PART -->
			<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-full">
				<input type="checkbox" />
				<div class="collapse-title text-xl font-medium">See notes</div>
				<div class="collapse-content">
					<div class="flex flex-col gap-4">
						{#each game.notes as note}
							<div class="flex flex-row gap-2">
								<p
									class="border border-base-content border-opacity-20 flex-grow rounded-btn px-4 py-2"
								>
									{note.content}
								</p>
								<button class="btn btn-error btn-square" on:click={remove_note_with_id(note.id)}>
									R
								</button>
							</div>
						{/each}
						<div class="flex flex-row gap-2">
							<textarea
								class="textarea textarea-bordered w-full"
								placeholder="Notes about the game..."
								bind:value={new_note_content}
							/>
							<button
								class="btn btn-primary btn-square"
								on:click={add_new_note}
								disabled={new_note_content.length < 1 || new_note_content.length > 512}
							>
								+
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- END NOTE PART -->

		<!-- BEGIN USEFUL LINKS PART -->
		<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-full">
			<input type="checkbox" />
			<div class="collapse-title text-xl font-medium">See notes</div>
			<div class="collapse-content">
				<div class="flex flex-col gap-4">
					{#each game.useful_links as link}
						<div class="flex flex-row gap-2">
							<p
								class="border border-base-content border-opacity-20 flex-grow rounded-btn px-4 py-2"
							>
								<a href={link.url} target="_blank" rel="noreferrer" class="link link-primary"
									>{link.title}</a
								>
							</p>
							<button
								class="btn btn-error btn-square"
								on:click={remove_useful_link_with_id(link.id)}
							>
								R
							</button>
						</div>
					{/each}
					<div class="flex flex-col gap-2">
						<input
							type="text"
							class="input input-bordered"
							placeholder="Link title"
							bind:value={new_useful_link.title}
						/>
						<input
							type="text"
							class="input input-bordered"
							placeholder="Link content"
							bind:value={new_useful_link.url}
						/>
						<button
							class="btn btn-primary btn-square"
							on:click={add_new_useful_link}
							disabled={new_useful_link.title.length < 1 ||
								new_useful_link.title.length > 128 ||
								new_useful_link.url.length < 1 ||
								new_useful_link.url.length > 256}
						>
							+
						</button>
					</div>
				</div>
			</div>
		</div>
		<!-- END USEFUL LINKS PART -->
	</div>

	<!-- right panel -->
	<!-- TODO: fix this growing when opening the central disclosures -->
	<div class="flex flex-col gap-3 bg-base-300 shadow-xl p-4 rounded-xl flex-[2] max-h-fit">
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

		{#if game.total_achievements > 0 || game.completion_percentage > 0}
			<span class="flex flex-row gap-4 items-center justify-evenly">
				{#if game.total_achievements > 0}
					<span class="flex flex-col items-center gap-1">
						<div
							class="tooltip tooltip-primary"
							data-tip="{game.obtained_achievements}/{game.total_achievements}"
						>
							<div
								class="radial-progress text-primary"
								style="--value:{Math.floor(
									(game.obtained_achievements / game.total_achievements) * 100
								)};"
							>
								{Math.floor((game.obtained_achievements / game.total_achievements) * 100)}%
							</div>
						</div>
						<p>Achievements</p>
					</span>
				{/if}

				{#if game.completion_percentage > 0}
					<span class="flex flex-col items-center gap-1">
						<div class="radial-progress text-accent" style="--value:{game.completion_percentage};">
							{game.completion_percentage}%
						</div>
						<p>Completion</p>
					</span>
				{/if}
			</span>
		{/if}
	</div>
</div>

<input type="checkbox" id="modal-delete-game" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box relative">
		<label for="modal-delete-game" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		<h3 class="font-bold text-lg">Do you really want to delete this game?</h3>
		<p class="py-4">
			If you click on delete, {game.name} will be deleted permanently.
		</p>
		<div class="modal-action">
			<label
				for="modal-delete-game"
				class="btn btn-error"
				on:click={deleteGame}
				on:keydown={deleteGame}
			>
				Delete
			</label>
		</div>
	</div>
</div>

{#if called_delete}
	{#if delete_ok}
		<Alert kind="success" title="Successfully deleted {game.name}" />
	{:else}
		<Alert kind="error" title="An error occurred while trying to delete the game" />
	{/if}
{/if}
