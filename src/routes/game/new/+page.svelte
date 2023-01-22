<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$components/Alert.svelte';
	import { STATUSES, PLATFORMS } from '$models/Game';
	import type { CreateGameFormResponse } from './proxy+page.server';

	export let form: CreateGameFormResponse;

	function form_string_to_int(v: any, default_value: number | undefined = 0) {
		let parsed = parseInt(v as string);
		if (isNaN(parsed)) return default_value;
		console.log('Returning: ', parsed);
		return parsed;
	}
</script>

<!-- 
	TODO: show something when the game is created
	TODO: sometimes sending data too many times makes it so that the old values are not filled in?
	TODO: add reset button?
 -->

<form method="POST" use:enhance class="flex flex-col gap-6 w-10/12 mx-auto">
	<h2 class="mx-auto text-3xl font-semibold w-fit mb-6">Create new game</h2>
	{#if form?.form_errors !== undefined}
		<div class="flex flex-col items-center gap-2">
			{#each form?.form_errors as error}
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
				class="input input-bordered {form?.errors?.name ? 'input-error' : ''}"
				value={form?.values?.name ?? ''}
				required
				autofocus
			/>
			{#if form?.errors?.name}
				<label class="label flex flex-col items-baseline" for="name">
					{#each form.errors.name as error}
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
				class="input input-bordered {form?.errors?.short_name ? 'input-error' : ''}"
				value={form?.values?.short_name ?? ''}
				required
			/>
			{#if form?.errors?.short_name}
				<label class="label flex flex-col items-baseline" for="short_name">
					{#each form.errors.short_name as error}
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
				class="input input-bordered {form?.errors?.art_url ? 'input-error' : ''}"
				value={form?.values?.art_url ?? ''}
			/>
			{#if form?.errors?.art_url}
				<label class="label flex flex-col items-baseline" for="art_url">
					{#each form.errors.art_url as error}
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
				class="input input-bordered {form?.errors?.developer ? 'input-error' : ''}"
				value={form?.values?.developer ?? ''}
			/>
			{#if form?.errors?.developer}
				<label class="label flex flex-col items-baseline" for="developer">
					{#each form.errors.developer as error}
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
				class="input input-bordered {form?.errors?.release_date ? 'input-error' : ''}"
				value={form?.values?.release_date ?? ''}
			/>
			{#if form?.errors?.release_date}
				<label class="label flex flex-col items-baseline" for="release_date">
					{#each form.errors.release_date as error}
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
				class="select select-bordered {form?.errors?.status ? 'select-error' : ''}"
				value={form?.values?.status ?? STATUSES[0]}
			>
				{#each STATUSES as status}
					<option value={status}> {status} </option>
				{/each}
			</select>
			{#if form?.errors?.status}
				<label class="label flex flex-col items-baseline" for="status">
					{#each form.errors.status as error}
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
				class="select select-bordered {form?.errors?.platform ? 'select-error' : ''}"
				value={form?.values?.platform ?? PLATFORMS[0]}
			>
				{#each PLATFORMS as platform}
					<option value={platform}> {platform} </option>
				{/each}
			</select>
			{#if form?.errors?.platform}
				<label class="label flex flex-col items-baseline" for="platform">
					{#each form.errors.platform as error}
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
				class="input input-bordered {form?.errors?.play_time ? 'input-error' : ''}"
				value={form_string_to_int(form?.values?.play_time)}
			/>
			{#if form?.errors?.play_time}
				<label class="label flex flex-col items-baseline" for="play_time">
					{#each form.errors.play_time as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>
	</div>

	<div class="w-10/12 mx-auto flex justify-end">
		<button type="submit" class="btn btn-primary max-w-xs">Create game</button>
	</div>
</form>


<!-- TODO: fix bug, after one try has been made, the error variant does not work for subsequent errors (resets on success) -->
{#if form}
	{#if (form?.form_errors?.length ?? 0) > 0 || Object.keys(form?.errors ?? {}).length > 0}
		<Alert title="Error creating the game" kind="error" />
	{:else}
		<Alert title="Game created successfully" kind="success" />
	{/if}
{/if}