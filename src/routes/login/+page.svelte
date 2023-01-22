<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$components/Alert.svelte';
	import { onMount } from 'svelte';
	import type { LoginFormResponse } from './proxy+page.server';

	export let form: LoginFormResponse;

    // let user_input_elem;
    // onMount(() => user_input_elem.focus());
</script>

<form method="POST" use:enhance class="flex flex-col gap-12 w-[28rem] mx-auto">
	<h2 class="mx-auto text-3xl font-semibold mb-6">Login</h2>

	{#if form?.form_errors !== undefined}
		<div class="flex flex-col items-center gap-2">
			{#each form?.form_errors as error}
				<span class="text-error">
					{error}
				</span>
			{/each}
		</div>
	{/if}

	<div class="flex flex-col gap-4 items-center justify-center">
		<div class="form-control w-full">
			<label class="label" for="username">
				<span class="label-text"> Username </span>
			</label>
			<!-- svelte-ignore a11y-autofocus -->
			<input
				name="username"
				type="text"
				placeholder="Username"
				class="input input-bordered {form?.errors?.username ? 'input-error' : ''}"
				value={form?.values?.username ?? ''}
				required
                autofocus
			/>
			{#if form?.errors?.username}
				<label class="label flex flex-col items-baseline" for="username">
					{#each form.errors.username as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>

		<div class="form-control w-full">
			<label class="label" for="password">
				<span class="label-text"> Password </span>
			</label>
			<input
				name="password"
				type="password"
				placeholder="Password"
				class="input input-bordered {form?.errors?.password ? 'input-error' : ''}"
				value={form?.values?.password ?? ''}
			/>
			{#if form?.errors?.password}
				<label class="label flex flex-col items-baseline" for="password">
					{#each form.errors.password as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>
	</div>

	<div class="w-full mx-auto flex justify-end">
		<button type="submit" class="btn btn-primary max-w-xs">Login</button>
	</div>
</form>

<!-- TODO: fix bug, after one try has been made, the error variant does not work for subsequent errors (resets on success) -->
{#if form}
	{#if form.logged_in}
		<Alert title="Successfully logged in" kind="success" />
	{:else}
		<Alert title="Error logging in" kind="error" />
	{/if}
{/if}
