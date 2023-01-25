<script lang="ts">
	export let required = false;
	export let autofocus = false;
	export let errors: string[] | undefined;
	export let value: string | number | null;
	export let label: string = '';
	export let name: string;
	export let wrapper_classes = '';
	export let select_classes = '';
	export let options: string[] | number[];
</script>

<div class="form-control w-full max-w-xs {wrapper_classes}">
	{#if label}
		<label class="label" for={name}>
			<span class="label-text"> {label} </span>
		</label>
	{/if}
	<!-- svelte-ignore a11y-autofocus -->
	<select
		{name}
		class="select select-bordered {errors && errors.length > 0
			? 'select-error'
			: ''} {select_classes}"
		bind:value
		{required}
		{autofocus}
	>
		{#each options as option}
			<option value={option}> {option} </option>
		{/each}
	</select>
	{#if errors && errors.length > 0}
		<label class="label flex flex-col items-baseline" for={name}>
			{#each errors as error}
				<span class="label-text text-error">{error}</span>
			{/each}
		</label>
	{/if}
</div>
