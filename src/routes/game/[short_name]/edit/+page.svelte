<script lang="ts">
	import GameForm from '$components/GameForm.svelte';
	import type { Game } from '$models/Game';
	import { addToast } from '$src/toast';
	import type { PageData } from './$types';
	import type { EditGameFormResponse } from './proxy+page.server';

	export let data: PageData;
	export let form: EditGameFormResponse;

	$: initial_data = (form?.values ?? data.game) as any as Game | undefined;

	if(form) {
		if((form?.form_errors?.length ?? 0) > 0 || Object.keys(form?.errors ?? {}).length > 0) {
			addToast({
				title: "Error updating the game",
				type: "error",
			});
		} else {
			addToast({
				type: "success",
				title: "Game updated successfully",
			});
		}
	}
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


