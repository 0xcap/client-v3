<script>
	import { _ } from '../../services/i18n';

	import Modal from './Modal.svelte'
	import DataList from '../layout/DataList.svelte'

	import { EXTERNAL_ICON } from '../../lib/icons'
	import { txLink, formatToDisplay, formatPnl, formatCurrency } from '../../lib/utils'

	export let data;
	export let isActive;

	let rows = [];

	$: !data ? '' : rows = [
			{
				label: $_('p.date'),
				value: data.timestamp ? new Date(data.timestamp * 1000).toLocaleString() : null
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
				label: $_('p.pentry'),
				value: formatToDisplay(data.entryPrice),
			},
			{
				label: $_('p.pclose'),
				value: formatToDisplay(data.price),
			},
			{
				label: $_('p.size'),
				value: `${formatToDisplay(data.size, 0, true)} ${formatCurrency(data.currencyLabel)}`,
			},
			{
				label: $_('p.margin'),
				value: `${formatToDisplay(data.margin, 0, true)} ${formatCurrency(data.currencyLabel)}`,
			},
			{
				label: $_('p.leverage'),
				value: `${formatToDisplay(data.leverage)}×`
			},
			{
				label: $_('p.PL1'),
				value: `${formatPnl(data.pnl)} ${formatCurrency(data.currencyLabel)} (${formatPnl(100*data.pnl/data.margin, true)}%)`
			},
			{
				label: $_('p.liqed'),
				value: data.wasLiquidated ? 'Yes' : 'No'
			},
			{
				label: $_('p.block'),
				value: data.block
			},
			{
				label: $_('p.tx'),
				value: `<a href='${txLink(data.txHash)}' target='_blank'>${EXTERNAL_ICON}</a>`,
				renderHTML: true
			},
		];

</script>

<style>
</style>

<Modal isActive={isActive} title={$_('p.tradeTitle')} showHeader={true}>
	<DataList data={rows} />
</Modal>