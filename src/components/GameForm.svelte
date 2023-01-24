<script lang="ts">
	import { enhance } from '$app/forms';
	import { STATUSES, PLATFORMS, Game } from '$models/Game';
	import type { FieldErrors } from '$types/types';

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
			status: ng?.status ?? STATUSES[0]
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
		<div class="form-control w-full max-w-md">
			<label class="label" for="name">
				<span class="label-text"> game name </span>
			</label>
			<!-- svelte-ignore a11y-autofocus -->
			<input
				name="name"
				type="text"
				placeholder="Name"
				class="input input-bordered {field_errors?.name ? 'input-error' : ''}"
				bind:value={game.name}
				required
				autofocus
			/>
			{#if field_errors?.name}
				<label class="label flex flex-col items-baseline" for="name">
					{#each field_errors.name as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>

		<div class="form-control w-full max-w-md">
			<label class="label" for="short_name">
				<span class="label-text"> short game name </span>
			</label>
			<input
				name="short_name"
				type="text"
				placeholder="Short name"
				class="input input-bordered {field_errors?.short_name ? 'input-error' : ''}"
				bind:value={game.short_name}
				required
			/>
			{#if field_errors?.short_name}
				<label class="label flex flex-col items-baseline" for="short_name">
					{#each field_errors.short_name as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>
	</div>

	<div class="flex flex-row gap-4 items-baseline justify-center">
		<div class="form-control w-full max-w-xs">
			<label class="label" for="art_url">
				<span class="label-text"> Art url </span>
			</label>
			<input
				name="art_url"
				type="text"
				placeholder="Art url"
				class="input input-bordered {field_errors?.art_url ? 'input-error' : ''}"
				bind:value={game.art_url}
			/>
			{#if field_errors?.art_url}
				<label class="label flex flex-col items-baseline" for="art_url">
					{#each field_errors.art_url as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="developer">
				<span class="label-text"> Developer </span>
			</label>
			<input
				name="developer"
				type="text"
				placeholder="Developer"
				class="input input-bordered {field_errors?.developer ? 'input-error' : ''}"
				bind:value={game.developer}
			/>
			{#if field_errors?.developer}
				<label class="label flex flex-col items-baseline" for="developer">
					{#each field_errors.developer as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="release_date">
				<span class="label-text"> Release date </span>
			</label>
			<input
				name="release_date"
				type="date"
				placeholder="Release date"
				class="input input-bordered {field_errors?.release_date ? 'input-error' : ''}"
				bind:value={game.release_date}
			/>
			{#if field_errors?.release_date}
				<label class="label flex flex-col items-baseline" for="release_date">
					{#each field_errors.release_date as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>
	</div>

	<div class="flex flex-row gap-4 items-baseline justify-center">
		<div class="form-control w-full max-w-xs">
			<label class="label" for="status">
				<span class="label-text"> Status </span>
			</label>
			<select
				name="status"
				class="select select-bordered {field_errors?.status ? 'select-error' : ''}"
				bind:value={game.status}
			>
				{#each STATUSES as status}
					<option value={status}> {status} </option>
				{/each}
			</select>
			{#if field_errors?.status}
				<label class="label flex flex-col items-baseline" for="status">
					{#each field_errors.status as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="platform">
				<span class="label-text"> Platform </span>
			</label>
			<select
				name="platform"
				class="select select-bordered {field_errors?.platform ? 'select-error' : ''}"
				bind:value={game.platform}
			>
				{#each PLATFORMS as platform}
					<option value={platform}> {platform} </option>
				{/each}
			</select>
			{#if field_errors?.platform}
				<label class="label flex flex-col items-baseline" for="platform">
					{#each field_errors.platform as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="play_time">
				<span class="label-text"> Play time </span>
			</label>
			<input
				name="play_time"
				type="number"
				min={0}
				placeholder="Play time"
				class="input input-bordered {field_errors?.play_time ? 'input-error' : ''}"
				bind:value={game.play_time}
			/>
			{#if field_errors?.play_time}
				<label class="label flex flex-col items-baseline" for="play_time">
					{#each field_errors.play_time as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>
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
