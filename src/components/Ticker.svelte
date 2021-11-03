<script>
	import { PRODUCTS } from '../lib/constants'
	import { showModal, shortSymbol } from '../lib/utils'
	import { productId, product } from '../lib/stores'
	import { CARET_DOWN } from '../lib/icons'

</script>

<style>

	.ticker {
		height: var(--ticker-height);
		display: flex;
		align-items: center;
		background-color: var(--eerie-black);
	}

	.selector :global(svg) {
		margin-left: 12px;
		height: 8px;
		fill: transparent;
		stroke: #fff;
	}

	.selector img {
		width: 24px;
	}


</style>


<div class='ticker'>
	<div class='selector selector-product' on:click={() => {showModal('Products')}} data-intercept="true">
				<img src={PRODUCTS[$productId].logo} alt={`${$product.symbol} logo`}>
				<span>{shortSymbol($product.symbol)}</span>
				{@html CARET_DOWN}
			</div> | price, 24h change | protocol volume
</div>