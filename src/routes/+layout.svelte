<script lang="ts">
	import { is_logged_in } from "$src/stores";
  import "../tailwind.css";
	import Navbar from "./Navbar.svelte";
  import type { LayoutData } from "./$types";
  
  export let data: LayoutData;
  $: {
    if(data) {
      $is_logged_in = data.is_logged_in;
    }
  }

</script>

<Navbar />
<slot />