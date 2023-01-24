<script lang="ts">
	import Alert from '$components/Alert.svelte';
	import GameForm from '$components/GameForm.svelte';
	import type { Game } from '$models/Game';
	import type { CreateGameFormResponse } from './proxy+page.server';

	export let form: CreateGameFormResponse;

	$: initial_data = form?.values as any as Game | undefined;
</script>

<h2 class="mx-auto text-3xl font-semibold w-fit mt-6 mb-10">Add new game</h2>

<GameForm
	form_errors={form?.form_errors}
	{initial_data}
	field_errors={form?.errors}
	button_text="Create game"
/>

<!-- TODO: fix bug, after one try has been made, the error variant does not work for subsequent errors (resets on success) -->
{#if form}
	{#if (form?.form_errors?.length ?? 0) > 0 || Object.keys(form?.errors ?? {}).length > 0}
		<Alert title="Error creating the game" kind="error" />
	{:else}
		<Alert title="Game created successfully" kind="success" />
	{/if}
{/if}
