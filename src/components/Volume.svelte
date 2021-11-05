<script>
	
	import { onMount, onDestroy } from 'svelte'
	import { getVolume } from '../lib/graph'
	import { formatToDisplay } from '../lib/utils'

	let volume;
	let v;
	
	onMount(async () => {
		const res = await getVolume();
		volume = res.volume;
		v = setInterval(async () => {
			const res = await getVolume();
			volume = res.volume;
		}, 20*1000);
	});
	
	onDestroy(() => {
		clearInterval(v);
	});

</script>

<style>
</style>

{#if volume}
	${formatToDisplay(volume)}
{/if}