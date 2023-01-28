<script lang="ts">
	import GameForm from '$components/GameForm.svelte';
	import type { Game } from '$models/Game';
	import { addToast } from '$src/toast';
	import type { CreateGameFormResponse } from './proxy+page.server';

	export let form: CreateGameFormResponse;

	$: initial_data = form?.values as any as Game | undefined;

	$: {
		if ((form?.form_errors?.length ?? 0) > 0 || Object.keys(form?.errors ?? {}).length > 0) {
			form.form_errors?.forEach(err => addToast({ type: "error", title: "Error creatin the game", message: err}));
		} else {
			addToast({
				type: "success",
				title: "Game created successfully",
			});
		}
	}

</script>

<div class="w-8/12 mx-auto">
	<h2 class="mx-auto text-3xl font-semibold w-fit mt-6 mb-10">Add new game</h2>

	<GameForm
		form_errors={form?.form_errors}
		{initial_data}
		field_errors={form?.errors}
		button_text="Create game"
	/>
</div>
