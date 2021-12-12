<script>

	import { onMount } from 'svelte'

	import { getUserOrders, getUserPositions } from '../lib/graph'

	import { positions, prices, orders, enhancedPositions } from '../lib/stores'

	import { CANCEL_ICON, CIRCLE_ICON } from '../lib/icons'

	import { formatPnl, showModal, getUPL, formatCurrency, formatToDisplay, getPriceImpact, calculateLiquidationPrice } from '../lib/utils'

	let upls = {};
	let liqPrices = {};
	let upls_percent = {};
	let totalUPL = 0;
	let count = 0;
	$: count = $positions && $positions.length || 0;

	async function calculateUPLs(_positions, _prices) {
		totalUPL = 0;
		for (const position of _positions) {

			// Liq prices
			const lp = await calculateLiquidationPrice(position);
			liqPrices[position.key] = lp && lp.toFixed(6);

			// UPL
			if (!_prices[position.productId]) continue;
			const upl = await getUPL(position, _prices[position.productId]);			
			if (upl == undefined) continue;
			upls[position.key] = upl;
			upls_percent[position.key] = (100 * upl * 1 / position.margin);
			totalUPL += upl * 1;
			
		}
		if (isNaN(totalUPL)) totalUPL = 0;
		totalUPL = totalUPL.toFixed(4);
	}

	$: calculateUPLs($positions, $prices);

	let items_to_show = [];

	function displayItems(_orders, _positions) {
		// console.log('_positions', _positions);
		items_to_show = _orders.concat(_positions);
	}

	$: displayItems($orders, $positions);

	$: $enhancedPositions;

	onMount(async () => {
		await getUserOrders();
		await getUserPositions();
	});

	function getPendingPrice(position, price) {
		let priceImpact = Math.abs(getPriceImpact(position.size, position.productId, position.currencyLabel));
		if (position.isLong) {
			return price * (1 + priceImpact / 100);
		} else {
			return price * (1 - priceImpact / 100);
		}
	}

</script>

<style>

	.positions {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.columns {
		display: flex;
		align-items: center;
		height: 40px;
		padding: 0 var(--base-padding);
		color: var(--sonic-silver);
		font-size: 90%;
		border-bottom: 1px solid var(--jet-dim);
	}

	.positions-list {
		overflow-y: scroll;
		position: absolute;
		top: 40px;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.position {
		display: flex;
		align-items: center;
		height: 48px;
		cursor: pointer;
		padding: 0 var(--base-padding);
		border-bottom: 1px solid var(--jet-dim);
	}
	.position:hover {
		background-color: var(--jet-dim);
	}

	.column {

	}

	.dim {
		color: var(--sonic-silver);
	}

	.column-product {
		width: 10%;
	}
	.column-price {
		width: 15%;
	}
	.column-size {
		width: 15%;
	}
	.column-margin {
		width: 15%;
	}
	.column-leverage {
		width: 10%;
	}
	.column-pnl {
		width: 15%;
	}
	.column-liqprice {
		width: 10%;
	}
	.column-close {

	}

	@media (max-width: 1200px) {
		.pnl-percent {
			display: none;
		}
	}

	@media (max-width: 1000px) {
		.column-liqprice {
			display: none;
		}
		.column-product {
			width: 15%;
		}
		.column-price {
			width: 15%;
		}
		.column-size {
			width: 15%;
		}
		.column-margin {
			width: 15%;
		}
		.column-leverage {
			width: 15%;
		}
		.column-pnl {
			width: 15%;
		}
		.column-close {
			
		}
	}

	@media (max-width: 780px) {

		.column-leverage, .column-margin {
			display: none;
		}

		.column-product {
			width: 30%;
		}
		.column-price {
			width: 20%;
		}
		.column-size {
			width: 20%;
		}
		.column-pnl {
			width: 25%;
		}
		.column-close {
			
		}

	}

	.column-close {
		flex: 1;
		text-align: right;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.column-close a :global(svg) {
		width: 16px;
		fill: currentColor;
		margin-bottom: -2px;
	}
	.column-close a {
		color: var(--sonic-silver);
	}
	.column-close a:hover {
		color: var(--green);
	}

	.status :global(svg) {
		fill: currentColor;
		height: 10px;
	}

	.status {
		color: var(--orange);
	}

	.empty {
		padding: var(--base-padding);
		color: var(--onyx);
		text-align: center;
	}

</style>

<div class='positions'>

	<div class='columns'>

		<div class='column column-product'>Product</div>
		<div class='column column-price'>Price</div>
		<div class='column column-size'>Size</div>
		<div class='column column-margin'>Margin</div>
		<div class='column column-leverage'>Leverage</div>
		<div class='column column-pnl'>P/L</div>
		<div class='column column-liqprice'>Liq. Price</div>
		<div class='column column-close'></div>

	</div>

	<div class='positions-list no-scrollbar'>

		{#if $enhancedPositions.length == 0}
			<div class='empty'>No positions to show.</div>
		{:else}
			{#each $enhancedPositions as position}
				<div class='position' on:click={() => {showModal('PositionDetails', position)}} data-intercept="true">

					<div class='column column-product'>{#if position.isLong}<span class='pos'>↑</span>{:else}<span class='neg'>↓</span>{/if} {position.product}</div>
					<div class='column column-price' class:dim={!position.price}>
						{#if !position.price}
							{formatToDisplay(getPendingPrice(position, $prices[position.productId]))}
						{:else}
							{formatToDisplay(position.price)}
						{/if}
					</div>
					<div class='column column-size'>{formatToDisplay(position.size)} {formatCurrency(position.currencyLabel)}</div>
					<div class='column column-margin'>{formatToDisplay(position.margin)} {formatCurrency(position.currencyLabel)}</div>
					<div class='column column-leverage'>
						{formatToDisplay(position.leverage)}×
					</div>
					<div class={`column column-pnl ${upls[position.key] * 1 < 0 ? 'neg' : 'pos'}`}>
						{formatPnl(upls[position.key]) || '--'} {#if upls[position.key] != undefined}<span class='pnl-percent'>({formatPnl(100*upls[position.key]/position.margin, true)}%)</span>{/if}
					</div>
					<div class='column column-liqprice'>
						{formatToDisplay(liqPrices[position.key]) || '--'}
					</div>
					<div class='column column-close'>

						{#if position.isClosing || position.isSettling}
							<span class='status' title={position.isClosing ? 'Closing' : 'Settling'}>{@html CIRCLE_ICON}</span>
						{:else}
							<a class='close' title='Close Position' on:click|stopPropagation={() => {showModal('ClosePosition', position)}} data-intercept="true">
								{@html CANCEL_ICON}
							</a>
						{/if}

					</div>

				</div>

			{/each}

		{/if}

	</div>

</div>