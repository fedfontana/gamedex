<script lang="ts">
	import type { PageData } from './$types';
	import GameCard from './GameCard.svelte';
	export let data: PageData;
</script>

<div class="flex flex-col w-8/12 mx-auto gap-12">
	{#each data.games as game}
		<GameCard {game} />
	{/each}
</div>
