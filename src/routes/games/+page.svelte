<script lang="ts">
	import { enhance } from '$app/forms';
	import { PLATFORMS, STATUSES } from '$models/Game';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import GameCard from './GameCard.svelte';
	import SearchIcon from './SearchIcon.svelte';

	export let data: PageData;

	let show_sort = false;
	let show_filter = false;
	let show_status_filters = false;
	let show_platform_filters = false;
</script>

<!-- TODO: filters/sort options dont get preserved (should probably bind them) -->
<!-- TODO: add filter rest/ full reset/ sort reset -->
<!-- TODO: subsections for each platform manufacturer in filters -->

<div class="drawer">
	<input id="filters-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content w-10/12 mx-auto">
		<label for="filters-drawer" class="btn btn-primary drawer-button">Open filters</label>
		<!-- PAGE CONTENT -->

		<div class="grid grid-cols-3 w-full gap-y-12 gap-x-8 my-12">
			{#each data.games as game}
				<GameCard {game} />
			{/each}
		</div>

		<!-- END PAGE CONTENT -->
	</div>
	<div class="drawer-side">
		<label for="filters-drawer" class="drawer-overlay" />
		<div class="p-4 w-1/3 bg-base-100 text-base-content">
			<!-- DRAWER CONTENT -->
			<form method="POST" use:enhance>
				<div class="form-control">
					<div class="input-group">
						<input type="text" name="query" placeholder="Search..." class="input input-bordered" />
						<button class="btn btn-square" type="submit">
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

				<!-- {
					MISSING
					Game = {
					    status: Status,
							- filter ~~
					    platform: Platform?,
							- filter
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
							bind:checked={show_sort}
						/>
					</label>
				</div>
				{#if show_sort}
					<div class="w-10/12 mr-auto">
						<div class="form-control" transition:slide>
							<label class="label cursor-pointer justify-start gap-3">
								<input type="checkbox" name="sort_ascending" class="toggle toggle-primary" />
								<span class="label-text"> Ascending </span>
							</label>
						</div>

						{#each ['name', 'release date', 'play time'] as sort_option}
							<div class="form-control" transition:slide>
								<label class="label cursor-pointer justify-start gap-3">
									<input
										type="radio"
										name="sort_col"
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
							name="filter_enabled"
							class="toggle toggle-primary"
							bind:checked={show_filter}
						/>
					</label>
				</div>
				{#if show_filter}
					<div class="w-10/12 mr-auto">
						<!-- BEGIN STATUS FILTERS -->
						<div class="form-control">
							<label class="label cursor-pointer">
								<span class="label-text text-xl"> Status filters </span>
								<input
									type="checkbox"
									name="status_filters_enabled"
									class="toggle toggle-primary"
									bind:checked={show_status_filters}
								/>
							</label>
						</div>

						{#if show_status_filters}
							{#each STATUSES as status}
								<div class="form-control" transition:slide>
									<label class="label cursor-pointer justify-start gap-3">
										<input
											type="checkbox"
											group="status_filters"
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
						<div class="form-control">
							<label class="label cursor-pointer">
								<span class="label-text text-xl"> Platform filters </span>
								<input
									type="checkbox"
									name="platform_filters_enabled"
									class="toggle toggle-primary"
									bind:checked={show_platform_filters}
								/>
							</label>
						</div>

						{#if show_platform_filters}
							<div class="grid grid-cols-2">
								{#each PLATFORMS as platform}
									<div class="form-control" transition:slide>
										<label class="label cursor-pointer justify-start gap-3">
											<input
												type="checkbox"
												group="platform_filters"
												value={platform}
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
