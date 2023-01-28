<script lang="ts">
	import Alert from '$components/Alert.svelte';
	import GameForm from '$components/GameForm.svelte';
	import type { Game } from '$models/Game';
	import type { PageData } from './$types';
	import type { EditGameFormResponse } from './proxy+page.server';

	export let data: PageData;
	export let form: EditGameFormResponse;

	$: initial_data = (form?.values ?? data.game) as any as Game | undefined;
</script>

<div class="mx-auto w-8/12">
	<h2 class="mx-auto text-3xl font-semibold w-fit mt-6 mb-10">Edit {data.game.name}</h2>

	<GameForm
		form_errors={form?.form_errors}
		{initial_data}
		field_errors={form?.errors}
		button_text="Edit game"
	/>
</div>

<!-- TODO: fix bug, after one try has been made, the error variant does not work for subsequent errors (resets on success) -->
{#if form}
	{#if (form?.form_errors?.length ?? 0) > 0 || Object.keys(form?.errors ?? {}).length > 0}
		<Alert title="Error updating the game" kind="error" />
	{:else}
		<Alert title="Game updated successfully" kind="success" />
	{/if}
{/if}
