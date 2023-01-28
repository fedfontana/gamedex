<script lang="ts">
	import type { SubmitFunction } from '$app/forms';
	import GameForm from '$components/GameForm.svelte';
	import type { Game } from '$models/Game';
	import { addToast } from '$src/toast';
	import type { PageData } from './$types';

	export let data: PageData;

	function date_to_input_date_format(date: string | Date | null | undefined) {
		if (date === null || date === undefined) return '';
		let d = new Date(date);
		let year = d.getFullYear();
		let month = d.getMonth() + 1;
		let day = d.getDate();
		return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
	}

	// TODO this ts fuckery sucks, its here just to make it stop complaining and idk if it is correct
	const game: Omit<Game, "release_date"> & { release_date: string | null } = {
		...(data.game as Game),
		release_date: date_to_input_date_format(data.game.release_date),
	};

	let field_errors: Record<string, string> | undefined = undefined;
	let form_errors: string[] | undefined = undefined;

	const enhance_function: SubmitFunction = () => {
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					addToast({
						type: 'success',
						title: 'Game updated successfully'
					});
					field_errors = undefined;
					form_errors = undefined;
					break;
				case 'failure':
					field_errors = result.data?.field_errors;
					form_errors = result.data?.form_errors;
					break;
				case 'error':
					addToast({
						title: 'Error updating the game',
						type: 'error'
					});
					break;
			}
		};
	};
</script>

<div class="mx-auto w-8/12">
	<h2 class="mx-auto text-3xl font-semibold w-fit mt-6 mb-10">Edit {data.game.name}</h2>

	<GameForm
		{form_errors}
		initial_data={game}
		{field_errors}
		button_text="Edit game"
		{enhance_function}
	/>
</div>
