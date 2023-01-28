<script lang="ts">
	import Alert from '$components/Alert.svelte';
	import { STATUSES, type Status } from '$models/Game';
	import { is_logged_in } from '$src/stores';
	import type { PageData } from './$types';
	import { Calendar, Hourglass, DeviceGamepad, Box, Trash, Check } from 'tabler-icons-svelte';
	import { enhance, type SubmitFunction } from '$app/forms';
	//import type { CreateNoteFormResponse } from './proxy+page.server';
	import DexTextArea from '$components/DexTextArea.svelte';
	import type { DexFormErrors } from './proxy+page.server';
	import DexInput from '$components/DexInput.svelte';
	import DexSelect from '$components/DexSelect.svelte';
	//TODO change box icon into the box-sealed

	export let data: PageData;
	const { game } = data;

	let errors: {
		notes?: DexFormErrors;
		links?: DexFormErrors;
		events?: DexFormErrors;
		dlcs?: DexFormErrors;
	} = {};

	//TODO show form errors as toast

	const submit_create_note: SubmitFunction = ({ data }) => {
		return async ({ form, result }) => {
			switch (result.type) {
				case 'success':
					game.notes.push(result.data?.db_values);
					game.notes = game.notes;
					errors.notes = undefined;
					form.reset();
					break;
				case 'error':
					console.error('Error: ', result);
					break;
				case 'failure':
					errors.notes = result.data as DexFormErrors;
					break;
			}
		};
	};

	const submit_create_useful_link: SubmitFunction = ({ data }) => {
		return async ({ form, result }) => {
			switch (result.type) {
				case 'success':
					game.useful_links.push(result.data?.db_values);
					game.useful_links = game.useful_links;
					errors.links = undefined;
					form.reset();
					break;
				case 'error':
					console.error('Error: ', result);
					break;
				case 'failure':
					errors.links = result.data as DexFormErrors;
					break;
			}
		};
	};

	const submit_create_event: SubmitFunction = ({ data }) => {
		return async ({ form, result }) => {
			switch (result.type) {
				case 'success':
					game.events.push(result.data?.db_values);
					game.events = game.events;
					errors.events = undefined;
					form.reset();
					break;
				case 'error':
					console.error('Error: ', result);
					break;
				case 'failure':
					errors.events = result.data as DexFormErrors;
					break;
			}
		};
	};

	const submit_create_dlc: SubmitFunction = ({ data }) => {
		return async ({ form, result }) => {
			switch (result.type) {
				case 'success':
					game.DLCs.push(result.data?.db_values);
					game.DLCs = game.DLCs;
					errors.dlcs = undefined;
					form.reset();
					break;
				case 'error':
					console.error('Error: ', result);
					break;
				case 'failure':
					errors.dlcs = result.data as DexFormErrors;
					break;
			}
		};
	};

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

	async function remove_note_with_id(id: number) {
		const res = await fetch(`/game/${encodeURIComponent(game.short_name)}/notes/${id}`, {
			method: 'DELETE'
		});
		if (res.ok) {
			let old_note_id = (await res.json()).id;
			game.notes = game.notes.filter((n) => n.id != old_note_id);
		}
	}

	async function remove_useful_link_with_id(id: number) {
		const res = await fetch(`/game/${encodeURIComponent(game.short_name)}/links/${id}`, {
			method: 'DELETE'
		});
		if (res.ok) {
			let old_link_id = (await res.json()).id;
			game.useful_links = game.useful_links.filter((n) => n.id != old_link_id);
		}
	}

	async function remove_event_with_id(id: number) {
		const res = await fetch(`/game/${encodeURIComponent(game.short_name)}/events/${id}`, {
			method: 'DELETE'
		});
		if (res.ok) {
			let old_event_id = (await res.json()).id;
			game.events = game.events.filter((n) => n.id != old_event_id);
		}
	}

	async function remove_dlc_with_id(id: number) {
		const res = await fetch(`/game/${encodeURIComponent(game.short_name)}/dlc/${id}`, {
			method: 'DELETE'
		});
		if (res.ok) {
			let old_dlc_id = (await res.json()).id;
			game.DLCs = game.DLCs.filter((n) => n.id != old_dlc_id);
		}
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

	<!-- TODO fix scrolling -->
	<!-- central panel -->
	<div class="flex flex-col justify-start items-start flex-[4] gap-12 mb-24">
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

		<div class="flex flex-col justify-start items-start gap-2 w-full">
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
								{#if $is_logged_in}
									<button
										class="btn btn-error btn-square"
										on:click={() => {
											remove_note_with_id(note.id);
										}}
									>
										<Trash />
									</button>
								{/if}
							</div>
						{/each}
						{#if $is_logged_in}
							<form method="POST" action="?/note" use:enhance={submit_create_note} class="w-full">
								<div class="flex flex-row gap-2">
									<!-- Using bind value so that form.reset() doesn't break subsequent form submissions -->
									<input type="number" name="gameId" class="hidden" bind:value={game.id} readonly />
									<DexTextArea
										name="content"
										placeholder="Notes about the game..."
										errors={errors?.notes?.errors?.content}
									/>

									<button class="btn btn-primary btn-square" type="submit">
										<Check />
									</button>
								</div>
							</form>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<!-- END NOTE PART -->

		<!-- BEGIN USEFUL LINKS PART -->
		<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-full">
			<input type="checkbox" />
			<div class="collapse-title text-xl font-medium">See links</div>
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
							{#if $is_logged_in}
								<button
									class="btn btn-error btn-square"
									on:click={() => {
										remove_useful_link_with_id(link.id);
									}}
								>
									<Trash />
								</button>
							{/if}
						</div>
					{/each}
					{#if $is_logged_in}
						<form
							action="?/link"
							method="POST"
							use:enhance={submit_create_useful_link}
							class="w-full"
						>
							<div class="flex flex-col gap-2">
								<input type="number" name="gameId" class="hidden" bind:value={game.id} readonly />
								<DexInput
									name="title"
									type="text"
									placeholder="Link title"
									value=""
									errors={errors?.links?.errors?.title}
								/>
								<div class="flex flex-row gap-2">
									<DexInput
										name="url"
										type="text"
										placeholder="Link content"
										value=""
										errors={errors?.links?.errors?.url}
									/>
									<button class="btn btn-primary btn-square" type="submit">
										<Check />
									</button>
								</div>
							</div>
						</form>
					{/if}
				</div>
			</div>
		</div>
		<!-- END USEFUL LINKS PART -->

		<!-- BEGIN EVENTS PART -->
		<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-full">
			<input type="checkbox" />
			<div class="collapse-title text-xl font-medium">See events</div>
			<div class="collapse-content">
				<div class="flex flex-col gap-4">
					{#each game.events as event}
						<div class="flex flex-row gap-2">
							<div class="flex flex-grow flex-col gap-2">
								<h4 class="font-semibold text-lg">
									{event.name}
								</h4>
								<span class="flex flex-row gap-2">
									<p>
										{event.begin_dt.toLocaleDateString()}
										{event.begin_dt.toLocaleTimeString()}
									</p>
									{#if event.end_dt}
										<p>--</p>
										<p>
											{event.end_dt.toLocaleDateString()}
											{event.end_dt.toLocaleTimeString()}
										</p>
									{/if}
								</span>
								{#if event.description}
									<p class="border border-base-content border-opacity-20 rounded-btn px-4 py-2">
										{event.description}
									</p>
								{/if}
							</div>
							{#if $is_logged_in}
								<button
									class="btn btn-error btn-square"
									on:click={() => {
										remove_event_with_id(event.id);
									}}
								>
									<Trash />
								</button>
							{/if}
						</div>
					{/each}
					{#if $is_logged_in}
						<form action="?/events" method="POST" class="w-full" use:enhance={submit_create_event}>
							<div class="flex flex-col gap-2">
								<input type="number" name="gameId" class="hidden" bind:value={game.id} readonly />
								<DexInput
									type="text"
									name="name"
									placeholder="Event name"
									value=""
									errors={errors?.events?.errors?.name}
									required
								/>
								<DexTextArea
									placeholder="Event description"
									value=""
									name="description"
									errors={errors?.events?.errors?.description}
								/>
								<DexInput
									type="datetime-local"
									name="begin_dt"
									value=""
									errors={errors?.events?.errors?.begin_dt}
									required
								/>
								<DexInput
									type="datetime-local"
									name="end_dt"
									value=""
									errors={errors?.events?.errors?.end_dt}
								/>
								<button class="btn btn-primary btn-square" type="submit">
									<Check />
								</button>
							</div>
						</form>
					{/if}
				</div>
			</div>
		</div>
		<!-- END EVENTS PART -->

		<!-- BEGIN DLC PART -->
		<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-full">
			<input type="checkbox" />
			<div class="collapse-title text-xl font-medium">See DLC</div>
			<div class="collapse-content">
				<div class="flex flex-col gap-4">
					{#each game.DLCs as dlc}
						<div class="flex flex-row gap-2">
							<div class="flex flex-grow flex-col gap-2">
								<h4 class="font-semibold text-lg">
									{dlc.name}
								</h4>
								<span class="flex flex-row gap-2">
									{#if dlc.release_date}
										<p>
											{dlc.release_date.toLocaleDateString()}
										</p>
									{:else}
										<p>Unknown release date</p>
									{/if}
								</span>
								<p>
									{dlc.status}
								</p>
							</div>
							{#if $is_logged_in}
								<button
									class="btn btn-error btn-square"
									on:click={() => {
										remove_dlc_with_id(dlc.id);
									}}
								>
									<Trash />
								</button>
							{/if}
						</div>
					{/each}
					{#if $is_logged_in}
						<form action="?/dlc" method="POST" class="w-full" use:enhance={submit_create_dlc}>
							<div class="flex flex-col gap-2">
								<input type="number" name="gameId" class="hidden" bind:value={game.id} readonly />
								<DexInput
									name="name"
									type="text"
									placeholder="DLC name"
									value=""
									errors={errors?.dlcs?.errors?.name}
								/>
								<DexInput
									name="release_date"
									type="date"
									value=""
									errors={errors?.dlcs?.errors?.release_date}
								/>
								<DexSelect
									name="status"
									value={STATUSES[0]}
									options={[...STATUSES]}
									errors={errors?.dlcs?.errors?.status}
								/>
								<button class="btn btn-primary btn-square" type="submit">
									<Check />
								</button>
							</div>
						</form>
					{/if}
				</div>
			</div>
		</div>
		<!-- END DLC PART -->
	</div>

	<!-- right panel -->
	<!-- TODO: fix this growing when opening the central disclosures -->
	<div class="flex flex-col gap-3 bg-base-300 shadow-xl p-4 rounded-xl flex-[2] max-h-fit">
		<h3 class="text-lg font-semibold">Data</h3>
		<span class="flex flex-row gap-2 items-center">
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
