<script lang="ts">
	import type { Platform } from '$models/Game';
	import { slide } from 'svelte/transition';

	export let platforms: readonly Platform[];
	export let name: string;
	export let option_group: Platform[];

	const handle_change = (platform: Platform) => {
		return (e: any) => {
			if (e.target.checked as boolean) {
				option_group.push(platform);
				option_group = option_group;
			} else {
				option_group = option_group.filter(e => e !== platform);
			}
		};
	};
</script>

<h3 class="font-medium text-lg" transition:slide>{name}</h3>
<div class="grid grid-cols-2 mb-2">
	{#each platforms as platform}
		<div class="form-control" transition:slide>
			<label class="label cursor-pointer justify-start gap-3">
				<input
					type="checkbox"
					name="platform_filters"
					value={platform}
					class="checkbox checkbox-primary"
					on:change={handle_change(platform)}
				/>
				<span class="label-text"> {platform} </span>
			</label>
		</div>
	{/each}
</div>
