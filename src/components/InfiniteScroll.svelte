<script lang="ts">
	import { onDestroy, createEventDispatcher } from 'svelte';

	export let threshold = 0;
	export let hasMore = true;
	export let parent: HTMLElement;

	const dispatch = createEventDispatcher();
	let isLoadMore = false;

	$: {
		if(parent) {
			parent.addEventListener('scroll', onScroll);
			parent.addEventListener('resize', onScroll);
		}
	}

	const onScroll: EventListener = (e) => {
		console.log('Calling onScroll');
		const offset = parent.scrollHeight - parent.clientHeight - parent.scrollTop;
		console.log('Offset: ', offset);

		if (offset <= threshold) {
			if (!isLoadMore && hasMore) {
				dispatch('loadMore');
			}
			isLoadMore = true;
		} else {
			isLoadMore = false;
		}
	};

	onDestroy(() => {
		if(!parent) return;
		parent.removeEventListener('scroll', null);
		parent.removeEventListener('resize', null);
	});
</script>

<div style="width:0px" />
