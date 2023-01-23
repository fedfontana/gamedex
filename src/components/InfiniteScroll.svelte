<script lang="ts">
	import { onDestroy, createEventDispatcher } from 'svelte';

	export let threshold = 0;
	export let hasMore = true;
	export let parent: HTMLElement;

	const dispatch = createEventDispatcher();
	let isLoadMore = false;

	$: {
		if(parent) {
			//console.log("Adding handlers")
			parent.addEventListener('scroll', onScroll);
			parent.addEventListener('resize', onScroll);
		}
	}

	const onScroll: EventListener = e => {
		//console.log('Calling onScroll');
		const offset = parent.scrollHeight - parent.clientHeight - parent.scrollTop;
		console.log('Offset: ', offset);

		if (offset <= threshold) {
			if (!isLoadMore && hasMore) {
				console.log("LOAD MORE");
				dispatch('loadMore');
			}
			isLoadMore = true;
		} else {
			isLoadMore = false;
		}
	};

	onDestroy(() => {
		if(!parent) return;
		//console.log("removing handlers")
		parent.removeEventListener('scroll', null);
		parent.removeEventListener('resize', null);
	});
</script>

<div style="width:0px" />
