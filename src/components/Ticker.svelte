<script>

	import Volume from './Volume.svelte'

	import { showModal, showToast, shortSymbol, displayPricePercentChange, formatToDisplay } from '../lib/utils'
	import { address, productId, product, prices, prices24h } from '../lib/stores'
	import { CARET_DOWN } from '../lib/icons'

	let change = 0;
	$: change = displayPricePercentChange($prices[$productId], $prices24h[$productId]);

</script>

<style>

	.ticker {
		padding: 0 var(--base-padding);
		height: var(--ticker-height);
		display: flex;
		align-items: center;
		background-color: var(--eerie-black);
		justify-content: space-between;
	}

	.product-info {
		display: flex;
		align-items: center;
	}

	.selector {
		display: flex;
		align-items: center;
		cursor: pointer;
		padding: 6px 0;
	}

	.selector:hover {
		color: #ddd;
	}

	.selector :global(svg) {
		margin-left: 10px;
		height: 8px;
		fill: transparent;
		stroke: currentColor;
	}

	.selector img {
		width: 24px;
		margin-right: 10px;
	}

	.item {
		margin-right: calc(2 * var(--base-padding));
	}

	.volume {
		text-align: right;
	}

	.label {
		font-size: 80%;
		color: var(--onyx);
	}

	@media (max-width: 780px) {

		.volume {
			display: none;
		}

		.item {
			margin-right: var(--base-padding);
		}

	}

</style>


<div class='ticker'>
	
	{#if $product && $product.symbol}
	<div class='product-info'>

		<div class='item selector selector-product' on:click={() => {if ($address) {showModal('Products')} else {showToast('Connect your wallet to trade.')}}} data-intercept="true">
			<img src={$product.logo} alt={`${$product.symbol} logo`}>
			<span>{$product.symbol || ''}</span>
			{@html CARET_DOWN}
		</div>

		<div class='item price'>
			{$prices[$productId] ? $prices[$productId].toFixed(2) : ''}
		</div>

		{#if change}
		<div class={`item price-change ${change * 1 < 0 ? 'neg' : 'pos'}`}>
			{change}%
		</div>
		{/if}

	</div>
	{/if}

	<div class='volume'>
		<div class='value'><Volume/></div>
		<div class='label'>Protocol Volume</div>
	</div>

</div>