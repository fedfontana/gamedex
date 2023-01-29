<script lang="ts">
	import type { SubmitFunction } from '$app/forms';
	import GameForm from '$components/GameForm.svelte';
	import { addToast } from '$src/toast';

	let field_errors: Record<string, string> | undefined = undefined;
	let form_errors: string[] | undefined = undefined;

	const enhance_function: SubmitFunction = ({ data }) => {
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
	<h2 class="mx-auto text-3xl font-semibold w-fit mt-6 mb-10">Add new game</h2>

	<GameForm {form_errors} {field_errors} button_text="Create game" {enhance_function} />
</div>
