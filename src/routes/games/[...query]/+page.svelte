<script lang="ts">
	import {
		MOBILE_PLATFORMS,
		NINTENDO_CONSOLES,
		OTHER_PLATFORMS,
		PC_PLATFORMS,
		SONY_CONSOLES,
		STATUSES,
		XBOX_CONSOLES,
		type Platform,
		type Status
	} from '$models/Game';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import GameCard from './GameCard.svelte';
	import { deserialize } from '$app/forms';
	import type { Game } from '@prisma/client';
	import { page as p } from '$app/stores';
	import { Adjustments, ChevronLeft, ChevronRight, Search } from 'tabler-icons-svelte';
	import Drawer from '$components/Drawer.svelte';
	import { addToast } from '$src/toast';
	import { DEFAULT_OPTIONS, SORT_COLS, type SortCol } from './consts';
	import PlatformFamilyCheckboxes from './PlatformFamilyCheckboxes.svelte';

	export let data: PageData;

	let games = data.games;
	let total_games_count = data.total_game_count;
	let total_pages = data.total_pages;

	let page = 1;

	let drawer_open = false;

	let options = {
		query: $p.params.query,
		sort_enabled: false,
		sort_ascending: false,
		sort_col: 'name' as SortCol,
		show_filters: false,
		show_status_filters: false,
		status_filters: [] as Status[],
		show_platform_filters: false,
		platform_filters: [] as Platform[]
	};

	// EventHandler<Event, HTMLFormElement>
	const handleSubmit: svelte.JSX.EventHandler<Event, HTMLFormElement> = async (event) => {
		const getFormData = (object: Record<string, any>) =>
			Object.keys(object).reduce((formData, key) => {
				formData.append(key, object[key]);
				return formData;
			}, new FormData());

		let form_data = getFormData(options);

		const response = await fetch('/games', {
			method: 'POST',
			body: form_data,
			headers: {
				'x-sveltekit-action': 'true'
			}
		});

		const result = deserialize(await response.text());
		switch (result.type) {
			case 'success':
				games = (result.data?.games as Game[] | undefined) ?? [];
				total_games_count = (result.data?.total_game_count as number | undefined) ?? 0;
				total_pages = result.data?.total_pages ?? 1;
				page = 1;
				if (games.length > 0) {
					drawer_open = false;
				}
				break;
			case 'error':
			case 'failure':
				addToast({
					type: 'error',
					title: 'Error',
					message: 'Could not complete your query'
				});
				break;
		}
	};

	const load_game_page = async (page: number) => {
		if (page < 1 || page > total_pages) return;

		const response = await fetch(
			`/games?page=${page}&options=${encodeURIComponent(JSON.stringify(options))}`
		);
		const res = await response.json();
		games = res.games as Game[];
		total_games_count = res.total_game_count as number;
	};

	function reset_options() {
		options = JSON.parse(JSON.stringify(DEFAULT_OPTIONS));
	}
</script>

<div class="relative">
	<Drawer name="filters-drawer" bind:open={drawer_open}>
		<div
			slot="open_btn"
			class="btn btn-primary btn-square drawer-button absolute top-6 left-12 z-50 flex items-center justify-center p-2"
		>
			<Adjustments size={35} />
		</div>

		<svelte:fragment slot="content">
			{#if games.length > 0}
				<button
					class="btn btn-primary absolute top-[calc(50%-3rem)] left-4 font-semibold text-xl z-50"
					class:btn-disabled={page <= 1}
					on:click={() => {
						page--;
						load_game_page(page);
					}}
					disabled={page <= 1}
				>
					<ChevronLeft />
				</button>
				<button
					class="btn btn-primary absolute top-[calc(50%-3rem)] right-4 font-semibold text-xl z-50"
					class:btn-disabled={page >= total_pages}
					on:click={() => {
						page++;
						load_game_page(page);
					}}
					disabled={page >= total_pages}
				>
					<ChevronRight />
				</button>
				<div class="flex flex-col gap-16 items-center mt-12 mb-16">
					<div class="grid grid-cols-3 gap-y-12 gap-x-8 w-10/12">
						{#each games as game}
							<GameCard {game} />
						{/each}
					</div>
					<p class="font-semibold text-md">
						Page {page} of {total_pages}. {total_games_count} games matched your query.
					</p>
				</div>
			{:else}
				<div class="mt-32 text-center">
					<p class="text-xl font-semibold">such content, much wow</p>
				</div>
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="drawer">
			<form method="POST" on:submit|preventDefault={handleSubmit}>
				<div class="form-control">
					<div class="input-group">
						<input
							type="text"
							name="query"
							placeholder="Search..."
							class="input input-bordered flex-grow"
							bind:value={options.query}
						/>
						<button class="btn btn-square btn-primary" type="submit">
							<Search class="pr-1" />
						</button>
					</div>
				</div>

				<!-- BEGIN SORTING OPTIONS -->
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text text-xl"> Sort results </span>
						<input
							type="checkbox"
							name="sort_enabled"
							class="toggle toggle-primary"
							bind:checked={options.sort_enabled}
						/>
					</label>
				</div>
				{#if options.sort_enabled}
					<div class="w-10/12 mr-auto">
						<div class="form-control" transition:slide>
							<label class="label cursor-pointer justify-start gap-3">
								<input
									type="checkbox"
									name="sort_ascending"
									class="toggle toggle-primary"
									bind:checked={options.sort_ascending}
								/>
								<span class="label-text"> Ascending </span>
							</label>
						</div>

						{#each SORT_COLS as sort_col}
							<div class="form-control" transition:slide>
								<label class="label cursor-pointer justify-start gap-3">
									<input
										type="radio"
										name="sort_col"
										bind:group={options.sort_col}
										value={sort_col}
										class="radio checked:bg-primary-focus"
									/>
									<span class="label-text"> {sort_col.replaceAll('_', ' ')} </span>
								</label>
							</div>
						{/each}
					</div>
				{/if}
				<!-- END SORTING OPTIONS -->

				<!-- BEGIN FILTER OPTIONS -->
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text text-xl"> Filter results </span>
						<input
							type="checkbox"
							name="show_filters"
							class="toggle toggle-primary"
							bind:checked={options.show_filters}
						/>
					</label>
				</div>
				{#if options.show_filters}
					<div class="w-10/12 mr-auto">
						<!-- BEGIN STATUS FILTERS -->
						<div class="form-control" transition:slide>
							<label class="label cursor-pointer">
								<span class="label-text text-xl"> Status filters </span>
								<input
									type="checkbox"
									name="status_filters_enabled"
									class="toggle toggle-primary"
									bind:checked={options.show_status_filters}
								/>
							</label>
						</div>

						{#if options.show_status_filters}
							{#each STATUSES as status}
								<div class="form-control" transition:slide>
									<label class="label cursor-pointer justify-start gap-3">
										<input
											type="checkbox"
											name="status_filters"
											bind:group={options.status_filters}
											value={status}
											class="checkbox checkbox-primary"
										/>
										<span class="label-text"> {status} </span>
									</label>
								</div>
							{/each}
						{/if}
						<!-- END STATUS FILTERS -->

						<!-- BEGIN PLATFORM FILTERS -->
						<div class="form-control" transition:slide>
							<label class="label cursor-pointer">
								<span class="label-text text-xl"> Platform filters </span>
								<input
									type="checkbox"
									name="platform_filters_enabled"
									class="toggle toggle-primary"
									bind:checked={options.show_platform_filters}
								/>
							</label>
						</div>

						{#if options.show_platform_filters}
							<PlatformFamilyCheckboxes
								name="Nintendo"
								platforms={NINTENDO_CONSOLES}
								bind:option_group={options.platform_filters}
							/>
							<PlatformFamilyCheckboxes
								name="XBOX"
								platforms={XBOX_CONSOLES}
								bind:option_group={options.platform_filters}
							/>
							<PlatformFamilyCheckboxes
								name="PlayStation"
								platforms={SONY_CONSOLES}
								bind:option_group={options.platform_filters}
							/>
							<PlatformFamilyCheckboxes
								name="Pc"
								platforms={PC_PLATFORMS}
								bind:option_group={options.platform_filters}
							/>
							<PlatformFamilyCheckboxes
								name="Mobile"
								platforms={MOBILE_PLATFORMS}
								bind:option_group={options.platform_filters}
							/>
							<PlatformFamilyCheckboxes
								name="Other"
								platforms={OTHER_PLATFORMS}
								bind:option_group={options.platform_filters}
							/>
						{/if}
						<!-- END PLATFORM FILTERS -->
					</div>
				{/if}
				<button
					type="button"
					class="btn btn-warning btn-square px-12 py-2"
					on:click={reset_options}
				>
					reset
				</button>
				<!-- END FILTER OPTIONS -->
			</form>
		</svelte:fragment>
	</Drawer>
</div>
