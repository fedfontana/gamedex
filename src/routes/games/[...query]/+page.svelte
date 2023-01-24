<script lang="ts">
	import { PLATFORMS, STATUSES, type Platform, type Status } from '$models/Game';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import GameCard from './GameCard.svelte';
	import SearchIcon from './SearchIcon.svelte';
	import { applyAction, deserialize } from '$app/forms';
	import { SORT_OPTIONS, type SortOption } from '$src/utils/enums';
	import type { Game } from '@prisma/client';
	import FilterIcon from './FilterIcon.svelte';
	import { page as p } from '$app/stores';

	export let data: PageData;
	export let form: { games: Game[]; total_pages: number; page: number } | undefined;

	$: total_pages = form?.total_pages ?? data.total_pages; // in case something changes

	let options = {
		query: $p.params.query,
		sort_enabled: false,
		sort_ascending: false,
		sort_col: 'name' as SortOption,
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
		list_games = undefined;
		applyAction(result);
	};

	////////////////////////////////////////////
	////////////////////////////////////////////
	////////////////////////////////////////////
	////////////////////////////////////////////
	////////////////////////////////////////////
	////////////////////////////////////////////
	// TODO: FIX DOUBLE SCROLLBAR ON THE RIGHT//
	////////////////////////////////////////////
	////////////////////////////////////////////
	////////////////////////////////////////////
	////////////////////////////////////////////
	////////////////////////////////////////////
	////////////////////////////////////////////

	let list_games: Game[] | undefined = undefined;
	let page = 1;

	const load_game_page = async (page: number) => {
		if (page < 1 || page > total_pages) return;

		const response = await fetch(
			`/games?page=${page}&options=${encodeURIComponent(JSON.stringify(options))}`
		);

		list_games = (await response.json()).games as Game[];
	};

	$: games = list_games ?? form?.games ?? data.games;
</script>

<!-- TODO: add filter rest/ full reset/ sort reset -->
<!-- TODO: subsections for each platform manufacturer in filters -->
<!-- TODO: reactive game grid -->
<!-- TODO: fix sidebar not being on the far right sie-->
<!-- TODO: add svelte:head with title in the whole website -->
<!-- TODO: add special screen if no results are found -->
<!-- TODO: add screen with button to add a game with that short_name if the user lands on /games/<short_name>[/edit] (only if logged in ofc) -->
<!-- TODO: change filter icon and put it on the right -->
<!-- TODO: add animation when new games pop up in the list (scale? fade? fly? ) -->
<!-- TODO: move theme selection -->
<!-- TODO: add new custom personal theme -->
<!-- TODO: add license -->
<!-- TODO: change selected text color based on theme? -->
<!-- TODO: automatically close sidebar when search is successfull -->
<!-- TODO: fix double scrolling bar on ther right in the list of games -->
<!-- TODO: escape / from game names -->
<!-- TODO: fix icons: they have padding on the bottom, so they're off-center/misaligned -->
<!-- TODO: add some sort of shadow/box around the paringation thingy at the bottom -->

<div class="drawer relative">
	<input id="filters-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<!-- TODO: remove the bottom padding from the svg, and then remove the pt-2 -->
		<label
			for="filters-drawer"
			class="btn btn-primary btn-square drawer-button absolute top-6 left-12 z-50 flex items-center justify-center pt-2 p-2"
		>
			<FilterIcon size="35" />
		</label>
		<!-- PAGE CONTENT -->

		{#if games.length > 0}
			<!-- TODO make this round -->
			<button
				class="btn btn-primary absolute top-[calc(50%-3rem)] left-4 py-2 font-semibold text-xl"
				class:btn-disabled={page <= 1}
				on:click={() => {
					page--;
					load_game_page(page);
				}}
				disabled={page <= 1}
			>
				-
			</button>
			<button
				class="btn btn-primary absolute top-[calc(50%-3rem)] right-4 py-2 font-semibold text-xl"
				class:btn-disabled={page >= total_pages}
				on:click={() => {
					page++;
					load_game_page(page);
				}}
				disabled={page >= total_pages}
			>
				+
			</button>
	
			<!-- TODO if i dont put mb-24 the bottom navigation gets cut off, fix -->
			<div class="grid grid-cols-3 gap-y-12 gap-x-8 w-10/12 mx-auto mt-12 mb-36">
				{#each games as game}
					<GameCard {game} />
				{/each}
			</div>
		{:else}
			<div class="mt-32 text-center">
				<p class="text-xl font-semibold">such content, much wow</p>
			</div>
		{/if}

		<!-- END PAGE CONTENT -->
	</div>
	<div class="drawer-side">
		<label for="filters-drawer" class="drawer-overlay" />
		<div class="p-4 w-1/3 bg-base-100 text-base-content">
			<!-- DRAWER CONTENT -->
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
							<SearchIcon />
						</button>
					</div>
				</div>
				<!-- {
					Game = {
					    name: string,
							- sort
							- search
					    short_name: string,
							- search
					    art_url: url?,
					    developer: string?,
							- search
					    release_date: Date?,
							- sort
					    status: Status,
							- filter
					    platform: Platform?,
							- filter
					    play_time: int
							- sort
					}
				} -->

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

						{#each SORT_OPTIONS as sort_option}
							<div class="form-control" transition:slide>
								<label class="label cursor-pointer justify-start gap-3">
									<input
										type="radio"
										name="sort_col"
										bind:group={options.sort_col}
										value={sort_option}
										class="radio checked:bg-primary-focus"
									/>
									<span class="label-text"> {sort_option} </span>
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
							<div class="grid grid-cols-2">
								{#each PLATFORMS as platform}
									<div class="form-control" transition:slide>
										<label class="label cursor-pointer justify-start gap-3">
											<input
												type="checkbox"
												name="platform_filters"
												value={platform}
												bind:group={options.platform_filters}
												class="checkbox checkbox-primary"
											/>
											<span class="label-text"> {platform} </span>
										</label>
									</div>
								{/each}
							</div>
						{/if}
						<!-- END PLATFORM FILTERS -->
					</div>
				{/if}
				<!-- END FILTER OPTIONS -->
			</form>
			<!-- END DRAWER CONTENT -->
		</div>
	</div>
</div>