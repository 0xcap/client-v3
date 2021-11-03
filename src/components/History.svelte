<script>

	import { history } from '../lib/stores'

</script>

<style>

	.item {
		display: flex;
	}

	.column {

	}

	.column-product {
		width: 15%;
	}

	.column-tools {
		flex: 1;
		text-align: right;
	}

	.column-tools :global(svg) {
		width: 24px;
		fill:  #fff;
	}

</style>

<div class='history'>

	{#each $history as item}

		<div class='position' on:click={() => {showModal('TradeDetails', item)}} data-intercept="true">

			<div class='column-product'>{item.isLong ? '↑' : '↓'} {item.product}</div>
			<div class='column-price'>{item.price}</div>
			<div class='column-amount'>{item.amount} {item.currencyLabel}</div>
			<div class='column-pnl'>{formatPnl(item.pnl || 0, item.pnlIsNegative)}</div>

		</div>

	{/each}

</div>