<script lang="ts">
	import type { SubmitFunction } from '$app/forms';
	import { addToast } from '$src/toast';
	import { enhance } from '$app/forms';
	import DexInput from '$components/DexInput.svelte';
	import DexTextArea from '$components/DexTextArea.svelte';

	let field_errors: Record<string, string[]> | undefined = undefined;
	let form_errors: string[] | undefined = undefined;
	let form_element: HTMLFormElement;

	const enhance_function: SubmitFunction = ({ data }) => {
		const name = data.get('name');
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					addToast({
						type: 'success',
						title: `Event ${name ?? ''} added successfully`
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
						title: 'Error adding the event',
						type: 'error'
					});
					break;
			}
		};
	};
</script>

<div class="mx-auto w-8/12">
	<h2 class="mx-auto text-3xl font-semibold w-fit mt-6 mb-10">Add new event</h2>

	<form
		method="POST"
		bind:this={form_element}
		use:enhance={enhance_function}
		class="flex flex-col gap-6 w-full mx-auto"
	>
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
			<DexInput
				name="name"
				label="event name"
				placeholder="Name"
				value=""
				errors={field_errors?.name}
				autofocus
				required
			/>
		</div>
		<div class="flex flex-row gap-6 items-baseline justify-center">
			<DexInput
				name="art_url"
				label="art url"
				placeholder="Art url"
				value=""
				errors={field_errors?.art_url}
				type="url"
			/>

			<DexInput
				name="streaming_url"
				label="streaming url"
				placeholder="Streaming url"
				value=""
				errors={field_errors?.streaming_url}
				type="url"
			/>
		</div>
		<div class="flex flex-row gap-6 items-baseline justify-center">
			<DexInput
				name="begin_dt"
				label="begin date"
				value=""
				errors={field_errors?.begin_dt}
				type="datetime-local"
			/>

			<DexInput
				name="end_dt"
				label="begin date"
				value=""
				errors={field_errors?.end_dt}
				type="datetime-local"
			/>
		</div>
		<div class="flex flex-row gap-6 items-baseline justify-center">
			<DexTextArea
				name="description"
				label="description"
				value=""
				errors={field_errors?.description}
			/>
		</div>

		<div class="w-10/12 mx-auto flex justify-between">
			<button
				type="reset"
				class="btn btn-warning max-w-xs"
				on:click|preventDefault={() => {
					form_element.reset();
				}}
			>
				Reset
			</button>
			<button type="submit" class="btn btn-primary max-w-xs"> Create </button>
		</div>
	</form>
</div>
