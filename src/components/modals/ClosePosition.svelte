<script>

	import { submitCloseOrder } from '../../lib/methods'
	
	import { formatToDisplay, formatCurrency, hideModal } from '../../lib/utils'

	import Modal from './Modal.svelte'
	
	import DataList from '../layout/DataList.svelte'
	import Button from '../layout/Button.svelte'
	
	export let data;

	let size;
	let entire = false;

	let closePercent = 0, newAmount = data.size;

	function calculateAmounts() {
		if (!size*1) {
			closePercent = 0;
			newAmount = data.size;
			return;
		}
		closePercent = 100 * size * 1 / (data.size * 1);
		if (closePercent > 100) closePercent = 100;
		newAmount = data.size * 1 - size * 1;
		if (newAmount < 0) newAmount = 0;
	}

	function setMaxAmount(_entire) {
		size = formatToDisplay(data.size);
		calculateAmounts();
	}

	let canSubmit;
	$: canSubmit = size*1 > 0;

	let submitIsPending = false;
	async function _submitOrder() {
		let sizeToSubmit;
		if (closePercent >= 100) {
			sizeToSubmit = data.size * 1.001;
		} else {
			sizeToSubmit = size*1;
		}
		submitIsPending = true;
		const error = await submitCloseOrder(
			data.positionId,
			data.productId,
			sizeToSubmit,
			data.currencyLabel
		);
		submitIsPending = false;
		hideModal();
	}

	let rows;
	$: rows = [
		{
			type: 'input',
			label: 'Amount to Close',
			onKeyUp: calculateAmounts
		},
		{
			label: 'Current Position Size',
			value: `${formatToDisplay(data.size)} ${formatCurrency(data.currencyLabel)}`,
			dim: true,
			onclick: setMaxAmount
		},
		{
			label: 'Closing % of Total',
			value: `${formatToDisplay(closePercent, 2)}%`,
			isEmpty: closePercent == 0
		},
		{
			label: 'Position Size after Closing',
			value: `${formatToDisplay(newAmount)} ${formatCurrency(data.currencyLabel)}`,
			isEmpty: newAmount * 1 == data.size * 1
		},
	];

</script>

<style>

</style>

<Modal title='Close'>
	<DataList data={rows} bind:value={size} />
	<Button wrap={true} isDisabled={!canSubmit} isPending={submitIsPending} onClick={_submitOrder} label='Close' />
</Modal>