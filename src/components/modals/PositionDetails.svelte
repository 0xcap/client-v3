<script>

	import { onMount } from 'svelte'

	import Modal from './Modal.svelte'
	import DataList from '../layout/DataList.svelte'

	import { getUPL, getInterest, calculateLiquidationPrice, formatToDisplay, formatPnl } from '../../lib/utils'
	import { cancelPosition, cancelOrder } from '../../lib/methods'

	import { prices } from '../../lib/stores'

	export let data;

	let liquidationPrice;

	onMount(async () => {
		const lp = await calculateLiquidationPrice(data);
		liquidationPrice = lp && lp.toFixed(6);
	});

	async function _cancelPosition() {
		const error = await cancelPosition(data.positionId);
	}

	async function _cancelOrder() {
		const error = await cancelOrder(data.closeOrderId);
	}

	let rows = [];

	async function setRows(_prices) {

		const upl = await getUPL(data, _prices[data.productId]);
		const interest = await getInterest(data);

		const liquidatingSoon = data.isLong ? _prices[data.productId] <= liquidationPrice : _prices[data.productId] >= liquidationPrice;

		rows = [
			{
				label: 'ID',
				value: data.positionId
			},
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
				value: `${formatToDisplay(data.size, 0, true)}`,
			},
			{
				label: 'Margin',
				value: `${formatToDisplay(data.margin, 0, true)}`,
				addMargin: true,
				data: data
			},
			{
				label: 'Leverage',
				value: `${formatToDisplay(data.leverage)}×`
			}
		];

		if (data.price * 1 > 0) {
			rows.push({
				label: 'Unrealized P/L',
				value: `${formatPnl(upl)} (${formatPnl(100*upl/data.margin, true)}%)`,
				hasError: liquidatingSoon
			},
			{
				label: 'Accrued Interest',
				value: interest ? formatToDisplay(interest) : '0'
			},
			{
				label: 'Liquidation Price',
				value: "~" + formatToDisplay(liquidationPrice),
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

<Modal>
	{#if data.price * 1 == 0 || data.closeOrderId > 0}
		{#if data.price * 1 == 0}
			<div class='status'>
				Status: Settling. <a on:click={_cancelPosition}>Cancel Order</a>
			</div>
		{/if}

		{#if data.closeOrderId > 0}
			<div class='status'>
				Status: Closing. <a on:click={_cancelOrder}>Cancel Close Order</a>
			</div>
		{/if}

	{/if}
	<DataList data={rows} />
</Modal>