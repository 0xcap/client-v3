<script>

	import { submitCloseOrder, getProduct } from '../../lib/methods'
	
	import { formatToDisplay, formatCurrency, getPriceImpact, formatPnl, getUPL } from '../../lib/utils'
	
	import { prices } from '../../lib/stores'

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
		size = data.size * 1;
		calculateAmounts();
		calculatePnl($prices, size);
	}

	let canSubmit;
	$: canSubmit = size*1 > 0;

	let submitIsPending = false;
	async function _submitOrder() {
		let sizeToSubmit;
		if (closePercent >= 100) {
			sizeToSubmit = data.size * 1.0000001;
		} else {
			sizeToSubmit = size*1;
		}
		sizeToSubmit = sizeToSubmit.toFixed(8);
		// console.log('sizeToSubmit', sizeToSubmit);
		submitIsPending = true;
		const error = await submitCloseOrder(
			data.productId,
			data.currencyLabel,
			data.isLong,
			sizeToSubmit
		);
		submitIsPending = false;
	}

	let priceImpact = 0;
	$: priceImpact = getPriceImpact(Math.min(size * 1, data.size * 1), data.productId, data.currencyLabel);

	let pnl;

	async function calculatePnl(_prices, _size) {
		// console.log('calculatePnl', _prices, _size);
		if (!_size) {
			pnl = undefined;
			return;
		}
		let price = _prices[data.productId]
		// console.log('priceImpact', priceImpact);
		let _data = JSON.parse(JSON.stringify(data));
		_data.size = Math.min(_size * 1, data.size * 1);
		// console.log('getUPL', _data, price);
		pnl = await getUPL(_data, price);
		// console.log('pnl', pnl);
	}

	$: calculatePnl($prices, size);

	let rows = [];

	async function calculateRows() {

		const product = await getProduct(data.productId);

		rows = [
			{
				type: 'input',
				label: 'Size to Close (' + formatCurrency(data.currencyLabel) + ')',
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
			{
				label: 'Fee',
				value: `${product && product.fee || 0}%`,
				isEmpty: !size
			},
			{
				label: 'P/L (approx.)',
				value: `${formatPnl(pnl)}`,
				isEmpty: pnl == undefined,
				isPnl: true,
				rawValue: pnl * 1
			}
		];

		if (Math.abs(priceImpact * 1) > 0.1) {
			rows.push({
				label: 'Price Impact',
				value: `${formatToDisplay(priceImpact)}%`
			});
		}

	}

	$: calculateRows(size, newAmount, pnl)

</script>

<style>

</style>

<Modal title='Close'>
	<DataList data={rows} bind:value={size} onSubmit={_submitOrder} />
	<Button wrap={true} isLoading={!canSubmit || submitIsPending} onClick={_submitOrder} label='Close Position' />
</Modal>