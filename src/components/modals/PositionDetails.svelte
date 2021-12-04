<script>
	import { _ } from '../../services/i18n';

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
				label: $_('p.date'),
				value: new Date(data.timestamp * 1000).toLocaleString()
			},
			{
				label: $_('p.prod'),
				value: data.product
			},
			{
				label: $_('p.dir'),
				value: data.isLong ? $_('p.long'): $_('p.short')
			},
			{
				label: $_('p.pexec'),
				value: data.price * 1 > 0 ? formatToDisplay(data.price) : $_('p.settling')
			},
			{
				label: $_('p.pcurr'),
				value: formatToDisplay(_prices[data.productId])
			},
			{
				label: $_('p.size'),
				value: `${formatToDisplay(data.size, 0, true)} ${formatCurrency(data.currencyLabel)}`,
			},
			{
				label: $_('p.margin'),
				value: `${formatToDisplay(data.margin, 0, true)} ${formatCurrency(data.currencyLabel)}`
			},
			{
				label: $_('p.leverage'),
				value: `${formatToDisplay(data.leverage)}×`
			}
		];

		if (data.price * 1 > 0) {
			rows.push({
				label: $_('p.PL'),
				value: `${formatPnl(upl)} ${formatCurrency(data.currencyLabel)} (${formatPnl(100*upl/data.margin, true)}%)`,
				isPnl: true,
				rawValue: upl * 1
			},
			{
				label: $_('p.INT'),
				value: interest ? `${formatToDisplay(interest)}  ${formatCurrency(data.currencyLabel)}` : '0'
			},
			{
				label: $_('p.LIQP'),
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

<Modal title={$_('p.detailTitle')} showHeader={true}>
	{#if data.isSettling}
		<div class='status'>
			Status: {$_('p.status1')} <a on:click={_cancelOrder}>{$_("p.cancel1")}</a>
		</div>
	{/if}

	{#if data.isClosing}
		<div class='status'>
			Status: {$_('p.status2')} <a on:click={_cancelOrder}>{$_("p.cancel2")}</a>
		</div>
	{/if}
	<DataList data={rows} />
</Modal>