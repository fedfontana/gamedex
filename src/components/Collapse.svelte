<script lang="ts">
    export let title: string;
    export let open: boolean = false;
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class={`collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-full ${open ? "collapse-open" : ""}`}
    on:click={() => {open = !open;}}
    >
    <!-- on:keydown={() => {open = !open;}} -->
    <div class="collapse-title text-2xl font-semibold"> {title} </div>
    <div class="collapse-content">
         <slot />
    </div>
</div>