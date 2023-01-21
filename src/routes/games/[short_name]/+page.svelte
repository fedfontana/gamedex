<script lang="ts">
	import type { PageData } from "./$types";
    export let data: PageData;

    const deleteGame = async () => {
        const res = await fetch(`/games/${data.game.short_name}/delete`, {
            method: "DELETE"
        });
        if(res.ok) {
            console.log("Game deleted");
        } else {
            console.error("Could not delete game for some reason. Res: ", res);
        }
    }

</script>

{data.game.name} s personal page

<button class="btn btn-error" on:click={deleteGame}>
    delete this game
</button>