<script>
	
	import { onMount, onDestroy } from 'svelte'
	import { getVolume } from '../lib/graph'
	import { formatToDisplay } from '../lib/utils'
	import { SPINNER_ICON } from '../lib/icons'
	import { prices } from '../lib/stores'

	let v;
	let volumeETH;
	let volumeUSD;

	onMount(async () => {
		const res = await getVolume();
		// console.log('res', res);
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

	let volume_eth;
	let volume_usd;

	function calculateVolume(_prices, _volumeETH, _volumeUSD) {
		// console.log('calculateVolume', _prices, _volumeETH, _volumeUSD);
		if (!_prices['ETH-USD']) return;
		volume_eth = _volumeUSD * 1 / _prices['ETH-USD'] + _volumeETH * 1;
		volume_usd = _volumeUSD * 1 + _prices['ETH-USD'] * _volumeETH * 1;
		volume_usd /= 10**6;
		volume_usd = volume_usd.toFixed(2);
	}

	$: calculateVolume($prices, volumeETH, volumeUSD);

</script>

<style>
	.loading-icon :global(svg) {
		height: 16px;
		fill: none;
	}
	.dollar-amount {
		color: var(--sonic-silver);
		font-weight: 400;
	}
</style>

{#if volume_eth}
	{formatToDisplay(volume_eth)} ETH {#if volume_usd}<span class='dollar-amount'>(${volume_usd}M)</span>{/if}
{:else}
	<div class='loading-icon'>{@html SPINNER_ICON}</div>
{/if}