<script lang="ts">
	import type { Game } from "@prisma/client";

    export let game: Game;
</script>

<div class="flex flex-col bg-gray-500">
    <span>
        Name:{game.name}
    </span>
    Short name: {game.short_name}
</div>