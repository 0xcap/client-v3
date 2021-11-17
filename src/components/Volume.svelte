<script>
	
	import { onMount, onDestroy } from 'svelte'
	import { getVolume } from '../lib/graph'
	import { formatToDisplay } from '../lib/utils'

	import { prices } from '../lib/stores'

	let v;
	let volumeETH;
	let volumeUSD;

	onMount(async () => {
		const res = await getVolume();
		console.log('res', res);
		volumeETH = res.volumeETH;
		volumeUSD = res.volumeUSD;
		v = setInterval(async () => {
			const res = await getVolume();
			volumeETH = res.volumeETH;
			volumeUSD = res.volumeUSD;
		}, 60*1000);
	});
	
	onDestroy(() => {
		clearInterval(v);
	});

	let volume;

	function calculateVolume(_prices, _volumeETH, _volumeUSD) {
		console.log('calculateVolume', _prices, _volumeETH, _volumeUSD);
		volume = _volumeUSD * 1 + _prices['ETH-USD'] * _volumeETH * 1;
	}

	$: calculateVolume($prices, volumeETH, volumeUSD);

</script>

<style>
</style>

{#if volume}
	${formatToDisplay(volume)}
{/if}