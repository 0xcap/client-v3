<script>

	import { onMount } from 'svelte'

	import { HISTORY_COUNT } from '../lib/constants'

	import { SPINNER_ICON } from '../lib/icons'

	import { history } from '../lib/stores'
	import { formatPnl, showModal, formatCurrency, formatToDisplay } from '../lib/utils'
	import { getUserHistory } from '../lib/graph'

	let loading;
	let loadingMore = false;
	onMount(async () => {
		if (!$history.length) {
			loading = true;
		}
		let lastTrades = await getUserHistory();
		loading = false;

		// monitor scoll
		let skip = HISTORY_COUNT;
		const historyList = document.getElementById('history-list');
		historyList.onscroll = async () => {
			// console.log('scrolling', historyList.scrollTop, historyList.scrollHeight);
			if (historyList.scrollTop > historyList.scrollHeight - 350) {
				if (loadingMore || lastTrades.length < HISTORY_COUNT) return;
				loadingMore = true;
				// console.log('loading more');
				lastTrades = await getUserHistory(HISTORY_COUNT, skip);
				// console.log('lastTrades', lastTrades);
				loadingMore = false;
				skip += HISTORY_COUNT;
			}
		}
	});

</script>

<style>

	.history {
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

	.trades-list {
		overflow-y: scroll;
		position: absolute;
		top: 40px;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.trade {
		display: flex;
		align-items: center;
		height: 48px;
		cursor: pointer;
		padding: 0 var(--base-padding);
		border-bottom: 1px solid var(--jet-dim);
	}
	.trade:hover {
		background-color: var(--jet-dim);
	}

	.column {

	}

	.column-product {
		width: 12.5%;
	}
	.column-entry-price {
		width: 12.5%;
	}
	.column-price {
		width: 12.5%;
	}
	.column-margin {
		width: 12.5%;
	}
	.column-size {
		width: 12.5%;
	}
	.column-leverage {
		width: 12.5%;
	}
	.column-pnl {
		width: 20%;
	}
	.column-wasliq {
		width: 5%;
	}

	@media (max-width: 1200px) {
		.pnl-percent {
			display: none;
		}
	}

	@media (max-width: 1000px) {
		.column-wasliq, .column-margin {
			display: none;
		}
		.column-product {
			width: 16%;
		}
		.column-entry-price {
			width: 16%;
		}
		.column-price {
			width: 16%;
		}
		.column-size {
			width: 16%;
		}
		.column-leverage {
			width: 16%;
		}
		.column-pnl {
			width: 20%;
		}
	}

	@media (max-width: 780px) {

		.column-leverage, .column-entry-price {
			display: none;
		}

		.column-product {
			width: 25%;
		}
		.column-price {
			width: 25%;
		}
		.column-size {
			width: 25%;
		}
		.column-pnl {
			width: 25%;
		}

	}

	.empty {
		padding: var(--base-padding);
		color: var(--onyx);
		text-align: center;
	}

	.loading-icon :global(svg) {
		height: 24px;
	}

	

</style>

<div class='history'>

	<div class='columns'>

		<div class='column column-product'>Product</div>
		<div class='column column-entry-price'>Entry Price</div>
		<div class='column column-price'>Close Price</div>
		<div class='column column-margin'>Margin</div>
		<div class='column column-size'>Size</div>
		<div class='column column-leverage'>Leverage</div>
		<div class='column column-pnl'>P/L</div>
		<div class='column column-wasliq'>Was Liq.</div>

	</div>

	<div class='trades-list no-scrollbar' id='history-list'>

		{#if loading}
			<div class='empty'>
				<div class='loading-icon'>{@html SPINNER_ICON}</div>
			</div>
		{:else}
			{#if $history.length == 0}
				<div class='empty'>No trades to show.</div>
			{:else}

				{#each $history as trade}

					<div class='trade' on:click={() => {showModal('TradeDetails', trade)}} data-intercept="true">

						<div class='column column-product'>{#if trade.isLong}<span class='pos'>↑</span>{:else}<span class='neg'>↓</span>{/if} {trade.product}</div>
						<div class='column column-entry-price'>{formatToDisplay(trade.entryPrice)}</div>
						<div class='column column-price'>{formatToDisplay(trade.price)}</div>
						<div class='column column-margin'>{formatToDisplay(trade.margin)} {formatCurrency(trade.currencyLabel)}</div>
						<div class='column column-size'>{formatToDisplay(trade.size)} {formatCurrency(trade.currencyLabel)}</div>
						<div class='column column-leverage'>{formatToDisplay(trade.leverage)}×</div>
						<div class={`column column-pnl ${trade.pnl * 1 < 0 ? 'neg' : 'pos'}`}>{formatPnl(trade.pnl)} <span class='pnl-percent'>({formatPnl(100*trade.pnl/trade.margin, true)}%)</span></div>
						<div class='column column-wasliq'>{trade.wasLiquidated ? 'Yes' : ''}</div>

					</div>

				{/each}

				{#if loadingMore}
					<div class='empty'>
						<div class='loading-icon'>{@html SPINNER_ICON}</div>
					</div>
				{/if}

			{/if}
		{/if}

	</div>

</div>