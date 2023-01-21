<script lang="ts">
	import type { PageData } from './$types';
	import GameCard from './GameCard.svelte';
	export let data: PageData;
</script>

<div class="grid grid-cols-2 w-8/12 mx-auto gap-y-12 gap-x-8">
	{#each data.games as game}
		<GameCard {game} />
	{/each}
</div>
