<script lang="ts">
	import { enhance } from '$app/forms';
	import { STATUSES, PLATFORMS, type Game } from '$models/Game';
	import type { FieldErrors } from '$types/types';
	import DexInput from './DexInput.svelte';
	import DexSelect from './DexSelect.svelte';

	export let initial_data: Game | undefined;
	export let form_errors: string[] | undefined;
	export let field_errors: FieldErrors | undefined;
	export let button_text: string = 'Confirm';

	const deep_copy = (g: Game | undefined): Game | undefined =>
		g ? JSON.parse(JSON.stringify(g)) : undefined;

	function form_string_to_int(v: any, default_value: number | undefined = 0) {
		let parsed = parseInt(v as string);
		if (isNaN(parsed)) return default_value;
		return parsed;
	}

	function date_to_input_date_format(date: string | Date | null | undefined) {
		if (date === null || date === undefined) return '';
		let d = new Date(date);
		let year = d.getFullYear();
		let month = d.getMonth() + 1;
		let day = d.getDate();
		return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
	}

	function to_form_values(
		g: Game | undefined
	): Omit<Game, 'release_date'> & { release_date: string | null } {
		let ng = deep_copy(g);
		let new_game = {
			name: ng?.name ?? '',
			short_name: ng?.short_name ?? '',
			art_url: ng?.art_url ?? '',
			developer: ng?.developer ?? '',
			platform: ng?.platform ?? PLATFORMS[0],
			play_time: form_string_to_int(ng?.play_time),
			release_date: date_to_input_date_format(ng?.release_date),
			status: ng?.status ?? STATUSES[0],
			total_achievements: ng?.total_achievements ?? 0,
			obtained_achievements: ng?.obtained_achievements ?? 0,
			completion_percentage: ng?.completion_percentage ?? 0
		};

		return new_game;
	}

	let game = to_form_values(initial_data);
</script>

<!-- TODO: sometimes sending data too many times makes it so that the old values are not filled in? -->
<!-- TODO: add reset button? -->
<!-- TODO: fix buttons being too wide off the sides of the form -->

<form method="POST" use:enhance class="flex flex-col gap-6 w-10/12 mx-auto">
	{#if form_errors !== undefined && form_errors.length > 0}
		<div class="flex flex-col items-center gap-2">
			{#each form_errors as error}
				<span class="text-error">
					{error}
				</span>
			{/each}
		</div>
	{/if}
	<div class="flex flex-row gap-6 items-baseline justify-center">
		<DexInput
			name="name"
			label="game name"
			placeholder="Name"
			bind:value={game.name}
			errors={field_errors?.name}
			autofocus
			required
		/>

		<DexInput
			name="short_name"
			label="short game name"
			placeholder="Short name"
			bind:value={game.short_name}
			errors={field_errors?.short_name}
			required
		/>
	</div>

	<div class="flex flex-row gap-4 items-baseline justify-center">
		<DexInput
			name="art_url"
			label="art url"
			placeholder="Art url"
			bind:value={game.art_url}
			errors={field_errors?.art_url}
			wrapper_classes="max-w-xs"
			type="url"
		/>

		<DexInput
			name="developer"
			label="developer"
			placeholder="Developer"
			bind:value={game.developer}
			errors={field_errors?.developer}
			wrapper_classes="max-w-xs"
			type="text"
		/>

		<DexInput
			name="release_date"
			label="release date"
			bind:value={game.release_date}
			errors={field_errors?.release_date}
			wrapper_classes="max-w-xs"
			type="date"
		/>
	</div>

	<div class="flex flex-row gap-4 items-baseline justify-center">
		<DexSelect
			name="status"
			label="Status"
			errors={field_errors?.status}
			bind:value={game.status}
			options={[...STATUSES]}
		/>

		<DexSelect
			name="platform"
			label="Platform"
			errors={field_errors?.platform}
			bind:value={game.platform}
			options={[...PLATFORMS]}
		/>

		<DexInput
			name="play_time"
			label="play time"
			placeholder="Play time"
			bind:value={game.play_time}
			errors={field_errors?.play_time}
			wrapper_classes="max-w-xs"
			type="number"
			min={0}
		/>
	</div>
	<div class="flex flex-row gap-6 items-baseline justify-center">
		<DexInput
			name="total_achievements"
			label="total achievements"
			bind:value={game.total_achievements}
			errors={field_errors?.total_achievements}
			type="number"
			min={0}
		/>

		<DexInput
			name="obtained_achievements"
			label="obtained achievements"
			bind:value={game.obtained_achievements}
			errors={field_errors?.obtained_achievements}
			type="number"
			min={0}
			max={game.total_achievements}
		/>

		<!-- TODO: decimal point in percentage -->
		<DexInput
			name="completion_percentage"
			label="completion%"
			bind:value={game.completion_percentage}
			errors={field_errors?.completion_percentage}
			type="number"
			min={0}
			max={100}
		/>
	</div>

	<div class="w-11/12 mx-auto flex justify-between">
		<button
			class="btn btn-warning max-w-xs"
			on:click|preventDefault={() => {
				game = to_form_values(initial_data);
			}}
		>
			Reset
		</button>
		<button type="submit" class="btn btn-primary max-w-xs"> {button_text} </button>
	</div>
</form>
