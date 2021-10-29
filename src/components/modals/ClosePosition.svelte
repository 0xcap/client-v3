<script>

	import { submitCloseOrder } from '../../lib/methods'
	
	import { formatToDisplay } from '../../lib/utils'

	import Modal from './Modal.svelte'
	
	import DataList from '../layout/DataList.svelte'
	import Button from '../layout/Button.svelte'
	
	export let data;

	let amount;
	let entire = false;

	let prior_amount;

	let closePercent = 0, newAmount = data.amount;

	function calculateAmounts() {
		if (!amount*1) {
			closePercent = 0;
			newAmount = data.amount;
			return;
		}
		closePercent = 100 * amount * 1 / (data.amount * 1);
		if (closePercent > 100) closePercent = 100;
		newAmount = data.amount * 1 - amount * 1;
		if (newAmount < 0) newAmount = 0;
	}

	function setMaxAmount(_entire) {
		amount = formatToDisplay(data.margin * data.leverage);
		calculateAmounts();
	}

	let canSubmit;
	$: canSubmit = amount*1 > 0;

	let submitIsPending = false;
	async function _submitOrder() {
		let marginToSubmit;
		if (closePercent >= 100) {
			marginToSubmit = data.margin * 1.01;
		} else {
			marginToSubmit = (amount*1)/(data.leverage*1);
		}
		submitIsPending = true;
		const error = await submitCloseOrder(
			data.positionId,
			data.productId,
			marginToSubmit,
			data.leverage,
			data.currencyLabel
		);
		submitIsPending = false;
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
			value: `${formatToDisplay(data.amount)} ${data.currencyLabel}`,
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
			value: `${formatToDisplay(newAmount)} ${data.currencyLabel}`,
			isEmpty: newAmount * 1 == data.amount * 1
		},
	];

</script>

<style>

</style>

<Modal title='Close'>
	<DataList data={rows} bind:value={amount} />
	<Button isDisabled={!canSubmit} isPending={submitIsPending} onClick={_submitOrder} label='Close' />
</Modal>