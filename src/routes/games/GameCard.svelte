<script lang="ts">
	import type { Game } from '@prisma/client';

	export let game: Game;
</script>

<div class="card lg:card-side bg-base-300 shadow-xl">
	<figure class="w-3/12">
		<img
			src={game.art_url || 'https://static-cdn.jtvnw.net/ttv-boxart/498566-500x640.jpg'}
			alt="Album"
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">{game.name}</h2>
		<p>Click the button to listen on Spotiwhy app.</p>
		<div class="card-actions justify-end">
			<a href="/games/{game.short_name}">
				<button class="btn btn-primary"> Details </button>
			</a>
		</div>
	</div>
</div>
