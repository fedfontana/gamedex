<script lang="ts">
	import { STATUSES } from '$models/Game';
	import { is_logged_in } from '$src/stores';
	import type { PageData } from './$types';
	import { Calendar, Hourglass, DeviceGamepad, Box, Trash, Check } from 'tabler-icons-svelte';
	import { enhance, type SubmitFunction } from '$app/forms';
	import DexTextArea from '$components/DexTextArea.svelte';
	import type { DexFormErrors } from './proxy+page.server';
	import DexInput from '$components/DexInput.svelte';
	import DexSelect from '$components/DexSelect.svelte';
	import { addToast } from '$src/toast';
	import Collapse from '$components/Collapse.svelte';

	export let data: PageData;
	const { game } = data;

	let errors: {
		notes?: DexFormErrors;
		links?: DexFormErrors;
		events?: DexFormErrors;
		dlcs?: DexFormErrors;
	} = {};

	//TODO these and the delete functions are way too similar and could probably be generalized
	const submit_create_note: SubmitFunction = () => {
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

	const submit_create_useful_link: SubmitFunction = () => {
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

	const submit_create_event: SubmitFunction = () => {
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

	const submit_create_dlc: SubmitFunction = () => {
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

	const deleteGame = async () => {
		const res = await fetch(`/game/${encodeURIComponent(game.short_name)}/delete`, {
			method: 'DELETE'
		});
		if (!res.ok) {
			addToast({
				type: 'error',
				title: 'An error occurred while trying to delete the game'
			});
			console.error('Could not delete game for some reason. Res: ', res);
		} else {
			addToast({
				type: 'success',
				title: `Successfully deleted ${game.name}`
			});
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
		<div class="max-w-xs rounded-box overflow-hidden shadow-xl">
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
	<div class="flex flex-col justify-start items-start flex-[4] gap-12 mb-24">
		<h2 class="text-3xl font-semibold">
			{game.name}
			{#if game.developer}
				<span class="text-2xl font-semibold text-accent">
					by {game.developer}
				</span>
			{/if}
		</h2>

		<div class="flex flex-col justify-start items-start gap-2 w-full">
			<!-- BEGIN DLC PART -->
			{#if $is_logged_in || game.DLCs.length > 0}
				<Collapse title="DLCs">
					<div class="flex flex-col gap-2">
						{#each game.DLCs as dlc}
							<div class="flex flex-row gap-2">
								<div
									class="flex flex-grow flex-col gap-2 border border-base-content border-opacity-20 rounded-box px-4 py-2"
								>
									<h4 class="font-semibold text-lg">
										{dlc.name}
									</h4>
									<span class="flex flex-row gap-6">
										<span class="flex flex-row gap-2">
											<Box />
											{dlc.status}
										</span>
										<span class="flex flex-row gap-2">
											<Calendar />
											{#if dlc.release_date}
												{dlc.release_date.toLocaleDateString()}
											{:else}
												<p>Unknown release date</p>
											{/if}
										</span>
									</span>
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
							{#if game.DLCs.length > 0}
								<div class="divider my-2" />
							{/if}
							<form
								action="?/dlc"
								method="POST"
								class="w-full flex flex-col gap-2"
								use:enhance={submit_create_dlc}
							>
								<h4 class="text-xl font-medium">Add a DLC</h4>
								<input type="number" name="gameId" class="hidden" bind:value={game.id} readonly />
								<div class="flex flex-row gap-2">
									<DexInput
										name="name"
										type="text"
										placeholder="DLC name"
										value=""
										errors={errors?.dlcs?.errors?.name}
									/>
									<button class="btn btn-primary btn-square" type="submit">
										<Check />
									</button>
								</div>
								<div class="flex flex-row gap-2">
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
								</div>
							</form>
						{/if}
					</div>
				</Collapse>
			{/if}
			<!-- END TMP -->

			<!-- BEGIN EVENTS PART -->
			{#if $is_logged_in || game.events.length > 0}
				<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-full">
					<input type="checkbox" />
					<div class="collapse-title text-2xl font-semibold">Events</div>
					<div class="collapse-content flex flex-col gap-2">
						{#each game.events as event}
							<div class="flex flex-row gap-2">
								<div
									class="flex flex-grow flex-col gap-2 border border-base-content border-opacity-20 rounded-box px-4 py-2"
								>
									<h4 class="font-semibold text-lg">
										{event.name}
									</h4>
									<span class="flex flex-row gap-2">
										<Calendar />
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
										<div class="flex flex-col gap-[2px]">
											<h6 class="text-opacity-80 ml-2 text-xs">Description</h6>
											<p class="border border-base-content border-opacity-20 rounded-box px-4 py-2">
												{event.description}
											</p>
										</div>
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
							{#if game.events.length > 0}
								<div class="divider my-2" />
							{/if}
							<form
								action="?/events"
								method="POST"
								class="w-full flex flex-col gap-2"
								use:enhance={submit_create_event}
							>
								<h4 class="text-xl font-medium">Add an event</h4>
								<input type="number" name="gameId" class="hidden" bind:value={game.id} readonly />
								<div class="flex flex-row gap-2">
									<DexInput
										type="text"
										name="name"
										placeholder="Event name"
										value=""
										errors={errors?.events?.errors?.name}
										required
									/>
									<button class="btn btn-primary btn-square" type="submit">
										<Check />
									</button>
								</div>

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
							</form>
						{/if}
					</div>
				</div>
			{/if}
			<!-- END EVENTS PART -->

			<!-- BEGIN USEFUL LINKS PART -->
			{#if $is_logged_in || game.useful_links.length > 0}
				<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-full">
					<input type="checkbox" />
					<div class="collapse-title text-2xl font-semibold">Useful links</div>
					<div class="collapse-content flex flex-col gap-2">
						{#each game.useful_links as link}
							<div class="flex flex-row gap-2">
								<p
									class="flex flex-grow flex-col gap-2 border border-base-content border-opacity-20 rounded-box px-4 py-2"
								>
									<!-- border border-base-content -->
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
							{#if game.useful_links.length > 0}
								<div class="divider my-2" />
							{/if}
							<form
								action="?/link"
								method="POST"
								use:enhance={submit_create_useful_link}
								class="w-full flex flex-col gap-2"
							>
								<h4 class="text-xl font-medium">Add a link</h4>
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
							</form>
						{/if}
					</div>
				</div>
			{/if}
			<!-- END USEFUL LINKS PART -->

			<!-- BEGIN NOTE PART -->
			{#if $is_logged_in || game.notes.length > 0}
				<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-full">
					<input type="checkbox" />
					<div class="collapse-title text-2xl font-semibold">Notes</div>
					<div class="collapse-content flex flex-col gap-2">
						{#each game.notes as note}
							<div class="flex flex-row gap-2">
								<p
									class="flex flex-grow flex-col gap-2 border border-base-content border-opacity-20 rounded-box px-4 py-2"
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
							{#if game.notes.length > 0}
								<div class="divider my-2" />
							{/if}
							<form
								method="POST"
								action="?/note"
								use:enhance={submit_create_note}
								class="w-full flex flex-col gap-2"
							>
								<h4 class="text-xl font-medium">Add a note</h4>
								<!-- Using bind value so that form.reset() doesn't break subsequent form submissions -->
								<div class="flex flex-row gap-2">
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
			{/if}
			<!-- END NOTE PART -->
		</div>
	</div>

	<!-- right panel -->
	<div class="flex flex-col gap-3 bg-base-300 shadow-xl p-6 rounded-box flex-[2] h-fit">
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
					<span class="flex flex-col items-center gap-1 w-5/12">
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
					<span class="flex flex-col items-center gap-1 w-5/12">
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
