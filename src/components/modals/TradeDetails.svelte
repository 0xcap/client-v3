<script>

	import Modal from './Modal.svelte'
	import DataList from '../layout/DataList.svelte'

	import { EXTERNAL_ICON } from '../../lib/icons'
	import { txLink, formatToDisplay, formatPnl, formatCurrency } from '../../lib/utils'

	export let data;
	export let isActive;

	let rows = [];

	$: !data ? '' : rows = [
			{
				label: 'Date',
				value: data.timestamp ? new Date(data.timestamp * 1000).toLocaleString() : null
			},
			{
				label: 'Product',
				value: data.product
			},
			{
				label: 'Direction',
				value: data.isLong ? 'Close Long' : 'Close Short'
			},
			{
				label: 'Entry Price',
				value: formatToDisplay(data.entryPrice),
			},
			{
				label: 'Close Price',
				value: formatToDisplay(data.price),
			},
			{
				label: 'Size',
				value: `${formatToDisplay(data.size, 0, true)} ${formatCurrency(data.currencyLabel)}`,
			},
			{
				label: 'Margin',
				value: `${formatToDisplay(data.margin, 0, true)} ${formatCurrency(data.currencyLabel)}`,
			},
			{
				label: 'Leverage',
				value: `${formatToDisplay(data.leverage)}×`
			},
			{
				label: 'Profit or Loss',
				value: `${formatPnl(data.pnl)} ${formatCurrency(data.currencyLabel)} (${formatPnl(100*data.pnl/data.margin, true)}%)`
			},
			{
				label: 'Was Liquidated',
				value: data.wasLiquidated ? 'Yes' : 'No'
			},
			{
				label: 'Block',
				value: data.block
			},
			{
				label: 'Transaction',
				value: `<a href='${txLink(data.txHash)}' target='_blank'>${EXTERNAL_ICON}</a>`,
				renderHTML: true
			},
		];

</script>

<style>
</style>

<Modal isActive={isActive} title='Trade Details' showHeader={true}>
	<DataList data={rows} />
</Modal>