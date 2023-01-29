<script lang="ts">
	import type { SvelteComponent } from 'svelte';

    export let name: string;
    export let open_btn: SvelteComponent;

</script>

<div class="drawer relative">
	<input {name} type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<label
			for={name}
			class="drawer-button absolute top-6 left-12 z-50 flex items-center justify-center p-2"
		>
            {open_btn}
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
