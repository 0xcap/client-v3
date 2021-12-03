<script>

	import { onMount } from 'svelte'

	import Modal from './Modal.svelte'
	import DataList from '../layout/DataList.svelte'

	import { getUPL, getInterest, calculateLiquidationPrice, formatToDisplay, formatPnl, formatCurrency } from '../../lib/utils'
	import { cancelOrder } from '../../lib/methods'

	import { prices } from '../../lib/stores'

	export let data;

	let liquidationPrice;

	onMount(async () => {
		const lp = await calculateLiquidationPrice(data);
		liquidationPrice = lp && lp.toFixed(6);
	});

	async function _cancelOrder() {
		const error = await cancelOrder(data.productId, data.currencyLabel, data.isLong);
	}

	let rows = [];

	async function setRows(_prices) {

		const upl = await getUPL(data, _prices[data.productId]);
		const interest = await getInterest(data);

		const liquidatingSoon = data.isLong ? _prices[data.productId] <= liquidationPrice : _prices[data.productId] >= liquidationPrice;

		rows = [
			{
				label: 'Date',
				value: new Date(data.timestamp * 1000).toLocaleString()
			},
			{
				label: 'Product',
				value: data.product
			},
			{
				label: 'Direction',
				value: data.isLong ? 'Long' : 'Short'
			},
			{
				label: 'Execution Price',
				value: data.price * 1 > 0 ? formatToDisplay(data.price) : 'Settling'
			},
			{
				label: 'Current Price',
				value: formatToDisplay(_prices[data.productId])
			},
			{
				label: 'Size',
				value: `${formatToDisplay(data.size, 0, true)} ${formatCurrency(data.currencyLabel)}`,
			},
			{
				label: 'Margin',
				value: `${formatToDisplay(data.margin, 0, true)} ${formatCurrency(data.currencyLabel)}`
			},
			{
				label: 'Leverage',
				value: `${formatToDisplay(data.leverage)}×`
			}
		];

		if (data.price * 1 > 0) {
			rows.push({
				label: 'Unrealized P/L',
				value: `${formatPnl(upl)} ${formatCurrency(data.currencyLabel)} (${formatPnl(100*upl/data.margin, true)}%)`,
				isPnl: true,
				rawValue: upl * 1
			},
			{
				label: 'Interest',
				value: interest ? `${formatToDisplay(interest)}  ${formatCurrency(data.currencyLabel)}` : '0'
			},
			{
				label: 'Liquidation Price',
				value: formatToDisplay(liquidationPrice),
				hasError: liquidatingSoon
			});
		}
	}

	$: setRows($prices);

</script>

<style>
	.status {
		padding: var(--base-padding);
		text-align: center;
		background-color: var(--jet);
	}
	.status a {
	}
</style>

<Modal title='Position Details' showHeader={true}>
	{#if data.isSettling}
		<div class='status'>
			Status: Settling. <a on:click={_cancelOrder}>Cancel Order</a>
		</div>
	{/if}

	{#if data.isClosing}
		<div class='status'>
			Status: Closing. <a on:click={_cancelOrder}>Cancel Close Order</a>
		</div>
	{/if}
	<DataList data={rows} />
</Modal>