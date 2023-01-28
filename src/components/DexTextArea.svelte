<script lang="ts">
	export let required = false;
	export let autofocus = false;
	export let errors: string[] | undefined;
	export let value: string | number | null | undefined = undefined;
	export let label: string = '';
	export let name: string;
	export let placeholder: string = '';
	export let wrapper_classes = '';
	export let input_classes = '';
</script>

<div class="form-control w-full max-w-md {wrapper_classes}">
	{#if label}
		<label class="label" for={name}>
			<span class="label-text"> {label} </span>
		</label>
	{/if}
	<!-- svelte-ignore a11y-autofocus -->
	<textarea
		{name}
		{placeholder}
		class="textarea textarea-bordered {(errors && errors.length > 0) ? 'textarea-error' : ''} {input_classes}"
		bind:value
		{required}
		{autofocus}
	/>
	{#if errors && errors.length > 0}
		<label class="label flex flex-col items-baseline" for={name}>
			{#each errors as error}
				<span class="label-text text-error">{error}</span>
			{/each}
		</label>
	{/if}
</div>
