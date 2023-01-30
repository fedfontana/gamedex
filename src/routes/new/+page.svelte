<script lang="ts">
	import type { SubmitFunction } from '$app/forms';
	import GameForm from '$components/GameForm.svelte';
	import { addToast } from '$src/toast';
	import { page } from '$app/stores';
	import { PLATFORMS, STATUSES, type Game } from '$models/Game';

	let initial_data: Omit<Game, "release_date"> & { release_date: string | null } = {
		name: '',
		short_name: $page.url.searchParams.get("short_name") ?? '',
		art_url: '',
		developer: '',
		release_date: '',
		platform: PLATFORMS[0],
		status: STATUSES[0],
		play_time: 0,
		completion_percentage: 0,
		obtained_achievements: 0,
		total_achievements: 0
	}

	let field_errors: Record<string, string> | undefined = undefined;
	let form_errors: string[] | undefined = undefined;

	const enhance_function: SubmitFunction = ({ data }) => {
		const name = data.get("name");
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					addToast({
						type: 'success',
						title: `${name ?? "Game"} added successfully`
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
						title: 'Error adding the game',
						type: 'error'
					});
					break;
			}
		};
	};
</script>

<div class="mx-auto w-8/12">
	<h2 class="mx-auto text-3xl font-semibold w-fit mt-6 mb-10">Add new game</h2>

	<GameForm {form_errors} {field_errors} {initial_data} button_text="Create game" {enhance_function} />
</div>
