<script>

	import { positions, prices } from '../lib/stores'

	import { CANCEL_ICON } from '../lib/icons'

	import { formatPnl, showModal, getUPL } from '../lib/utils'

	let upls = {};
	let upls_percent = {};
	let totalUPL = 0;
	let count = 0;
	$: count = $positions && $positions.length || 0;

	async function calculateUPLs(_prices) {
		totalUPL = 0;
		for (const position of $positions) {
			const upl = await getUPL(position, _prices[position.productId]);
			upls[position.positionId] = upl;
			if (!upl) continue;
			upls_percent[position.positionId] = (100 * upl * 1 / position.margin);
			totalUPL += upl * 1;
		}
		if (isNaN(totalUPL)) totalUPL = 0;
		totalUPL = totalUPL.toFixed(4);
	}

	$: calculateUPLs($prices);

</script>

<style>

	.position {
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

<div class='positions'>

	<div class='columns'>

	</div>

	{#each $positions as position}
		<div class='position' on:click={() => {showModal('PositionDetails', position)}} data-intercept="true">

			<div class='column column-product'>{position.isLong ? '↑' : '↓'} {position.product}</div>
			<div class='column column-price'>{position.price}</div>
			<div class='column column-amount'>{position.amount} {position.currencyLabel}</div>
			<div class='column column-pnl'>
				<div class={`upl-wrap ${upls[position.positionId] * 1 > 0 ? 'pos' : 'neg'}`}>
					<div class='upl'>
						{formatPnl(upls[position.positionId])}
					</div>
				</div>
			</div>

			<div class='column column-tools'>

				{#if position.price * 1 == 0}
						Settling
				{/if}

				{#if position.closeOrderId > 0}
						Closing
				{/if}

				<a class='close' on:click|stopPropagation={() => {showModal('ClosePosition', position)}} data-intercept="true">
					{@html CANCEL_ICON}
				</a>
			</div>

		</div>

	{/each}

</div>