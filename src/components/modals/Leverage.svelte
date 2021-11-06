<script>

	import { onMount } from 'svelte'

	import Modal from './Modal.svelte'
	
	import DataList from '../layout/DataList.svelte'

	import { calculateLiquidationPrice, setCachedLeverage, formatToDisplay, displayPricePercentChange } from '../../lib/utils'

	import { prices, product, productId, leverage, address } from '../../lib/stores'

	let maxLeverage;
	$: maxLeverage = $product.maxLeverage * 1 || 50

	$: handleChange($leverage);

	function handleChange(_leverage) {
		if (!_leverage || !maxLeverage) return;
		setCachedLeverage($productId, _leverage);
		const elem = document.getElementById('range');
		if (!elem) return;
		const percent = 100 * _leverage * 1 / maxLeverage * 1;
		elem.style.filter = `hue-rotate(-${percent}deg)`;
	}

	let liquidationPriceShort, liquidationPriceLong;
	function calcLiqPrices(_leverage, price) {
		liquidationPriceShort = calculateLiquidationPrice({
			productId: $productId,
			price,
			leverage: _leverage,
			isLong: false
		});
		liquidationPriceLong = calculateLiquidationPrice({
			productId: $productId,
			price,
			leverage: _leverage,
			isLong: true
		});
	}

	$: calcLiqPrices($leverage, $prices[$productId]);
	
	onMount(() => {
		handleChange($leverage);
	});

	let rows;
	$: rows = [
		{
			label: 'Liquidation Price (Long)',
			value: `${formatToDisplay(liquidationPriceLong, 0, true)} (${displayPricePercentChange(liquidationPriceLong, $prices[$productId])}%)`
		},
		{
			label: 'Liquidation Price (Short)',
			value: `${formatToDisplay(liquidationPriceShort, 0, true)} (${displayPricePercentChange(liquidationPriceShort, $prices[$productId])}%)`
		}
	];

</script>

<style>

	.value {
		padding: var(--base-padding);
		font-weight: 600;
		font-size: 200%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.range-container {
		padding: var(--base-padding);
		padding-top: 0;
		border-bottom: 1px solid var(--jet-dim);
	}

	.range {
		-webkit-appearance: none;
		appearance: none;
		background: var(--jet);
		outline: none;
		border: none;
		height: 18px;
		border-radius: var(--base-radius);
		width: 100%;
		overflow: hidden;
		transition: box-shadow 0.6s ease-in-out;
	}
	.range::-moz-range-track {
		appearance: none;
		background: var(--jet);
		outline: none;
		border: none;
		height: 18px;
		border-radius: var(--base-radius);
		width: 100%;
		overflow: hidden;
		transition: box-shadow 0.6s ease-in-out;
	}

	.range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		cursor: ew-resize;
		background: var(--sonic-silver);
		border: 3px solid var(--jet-dim);
		box-shadow: -407px 0 0 400px var(--green);
	}

	.range::-moz-range-thumb {
		appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		cursor: ew-resize;
		background: var(--sonic-silver);
		border: 3px solid var(--jet-dim);
		box-shadow: -407px 0 0 400px var(--green);
	}

</style>

<Modal title='Select Leverage' showHeader={true} >

	<div class='leverage-select'>
		<div class='value'>
			{formatToDisplay($leverage)}×
		</div>
		<div class='range-container'>
			<input class='range' id='range' type=range bind:value={$leverage} min=1 max={maxLeverage}> 
		</div>
		{#if $address}
		<div class='details'>
			<DataList data={rows} />
		</div>
		{/if}
	</div>

</Modal>