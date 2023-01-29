<script lang="ts">
	export let name: string;
	export let open: boolean = false;
</script>

<div class="drawer">
	<input id={name} type="checkbox" class="drawer-toggle" bind:checked={open} />
	<div class="drawer-content">
		<label
			for={name}
			class="drawer-button"
		>
			<slot name="open_btn" />
		</label>

		<slot name="content" />
	</div>
	<div class="drawer-side">
		<label for={name} class="drawer-overlay" />
		<div class="p-4 w-1/3 bg-base-100 text-base-content">
			<slot name="drawer" />
		</div>
	</div>
</div>
