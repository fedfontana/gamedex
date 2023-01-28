<script lang="ts">
	// TODO import the actual type
	type HTMLInputType =
		| 'button'
		| 'checkbox'
		| 'color'
		| 'date'
		| 'datetime-local'
		| 'email'
		| 'file'
		| 'hidden'
		| 'image'
		| 'month'
		| 'number'
		| 'password'
		| 'radio'
		| 'range'
		| 'reset'
		| 'search'
		| 'submit'
		| 'tel'
		| 'text'
		| 'time'
		| 'url'
		| 'week';

	export let required = false;
	export let autofocus = false;
	export let errors: string[] | undefined;
	export let value: string | number | null | undefined = undefined;
	export let label: string = '';
	export let name: string;
	export let type: HTMLInputType = 'text';
	export let placeholder: string = '';
	export let wrapper_classes = '';
	export let input_classes = '';
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
</script>

<div class="form-control w-full {wrapper_classes}">
	{#if label}
		<label class="label" for={name}>
			<span class="label-text"> {label} </span>
		</label>
	{/if}
	<!-- svelte-ignore a11y-autofocus -->
	<input
		{name}
		{type}
		{placeholder}
		class="input input-bordered {(errors && errors.length > 0) ? 'input-error' : ''} {input_classes}"
		on:input={(e) => {
            // https://stackoverflow.com/a/57393751
            //@ts-ignore
			value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
		}}
		{value}
		{min}
		{max}
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
