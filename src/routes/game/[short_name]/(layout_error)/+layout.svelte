<script lang="ts">
	import type { LayoutData } from "./$types";

    export let data: LayoutData;
</script>

<svelte:head>
    <title>
        {data.game.name} - gamedex
    </title>
</svelte:head>

<slot />