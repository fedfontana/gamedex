<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { STATUSES, PLATFORMS, type Game } from '$models/Game';
	import type { FieldErrors } from '$types/types';
	import DexInput from './DexInput.svelte';
	import DexSelect from './DexSelect.svelte';

	export let initial_data: Omit<Game, 'release_date'> & { release_date: string | null } = {
		name: '',
		short_name: '',
		art_url: '',
		developer: '',
		platform: PLATFORMS[0],
		play_time: 0,
		release_date: '',
		status: STATUSES[0],
		total_achievements: 0,
		obtained_achievements: 0,
		completion_percentage: 0
	};

	export let readonly_short_name = false;

	export let form_errors: string[] | undefined;
	export let field_errors: FieldErrors | undefined;
	export let button_text: string = 'Confirm';
	export let enhance_function: SubmitFunction = () => {};

	
	const deep_copy = (g: Object) =>  JSON.parse(JSON.stringify(g));
	let game = deep_copy(initial_data);
</script>

<form method="POST" use:enhance={enhance_function} class="flex flex-col gap-6 w-full mx-auto">
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
			value={game.name}
			errors={field_errors?.name}
			autofocus
			required
		/>

		<DexInput
			name="short_name"
			label="short game name"
			placeholder="Short name"
			value={game.short_name}
			errors={field_errors?.short_name}
			required
			readonly={readonly_short_name}
		/>
	</div>

	<div class="flex flex-row gap-6 items-baseline justify-center">
		<DexInput
			name="art_url"
			label="art url"
			placeholder="Art url"
			value={game.art_url}
			errors={field_errors?.art_url}
			type="url"
		/>

		<DexInput
			name="developer"
			label="developer"
			placeholder="Developer"
			value={game.developer}
			errors={field_errors?.developer}
			type="text"
		/>

		<DexInput
			name="release_date"
			label="release date"
			value={game.release_date}
			errors={field_errors?.release_date}
			type="date"
		/>
	</div>

	<div class="flex flex-row gap-6 items-baseline justify-center">
		<DexSelect
			name="status"
			label="Status"
			errors={field_errors?.status}
			value={game.status}
			options={[...STATUSES]}
		/>

		<DexSelect
			name="platform"
			label="Platform"
			errors={field_errors?.platform}
			value={game.platform}
			options={[...PLATFORMS]}
		/>

		<DexInput
			name="play_time"
			label="play time"
			placeholder="Play time"
			value={game.play_time}
			errors={field_errors?.play_time}
			type="number"
			min={0}
		/>
	</div>
	<div class="flex flex-row gap-6 items-baseline justify-center">
		<DexInput
			name="total_achievements"
			label="total achievements"
			value={game.total_achievements}
			errors={field_errors?.total_achievements}
			type="number"
			min={0}
		/>

		<DexInput
			name="obtained_achievements"
			label="obtained achievements"
			value={game.obtained_achievements}
			errors={field_errors?.obtained_achievements}
			type="number"
			min={0}
		/>

		<DexInput
			name="completion_percentage"
			label="completion %"
			value={game.completion_percentage}
			errors={field_errors?.completion_percentage}
			type="number"
			min={0}
			max={100}
		/>
	</div>

	<div class="w-10/12 mx-auto flex justify-between">
		<button
			type="reset"
			class="btn btn-warning max-w-xs"
			on:click|preventDefault={() => {
				console.info("Resetting form");
				game = deep_copy(initial_data);
			}}
		>
			Reset
		</button>
		<button type="submit" class="btn btn-primary max-w-xs"> {button_text} </button>
	</div>
</form>
