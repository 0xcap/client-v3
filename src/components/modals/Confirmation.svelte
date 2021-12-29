<script>

	import { submitOrder, getProduct } from '../../lib/methods'
	
	import { formatToDisplay, formatCurrency, calculateLiquidationPrice, getPriceImpact, showToast, hideModal } from '../../lib/utils'
	
	import { prices, size, leverage, positions } from '../../lib/stores'

	import Modal from './Modal.svelte'
	
	import DataList from '../layout/DataList.svelte'
	import Button from '../layout/Button.svelte'
	
	export let data;

	// console.log('data', data);

	let isSubmitting = false;
	async function _submitNewPosition() {

		isSubmitting = true;

		const error = await submitOrder(data.isLong);
		if (error) {
			showToast(error);
		} else {
			// balance -= $margin * 1;
			// available -= $size * 1;
			// if (balance < 0) balance = 0;
			// if (available < 0) available = 0;
			size.set();

			// This refetches buying power and available balance
			const _leverage = $leverage;
			leverage.set(0);
			leverage.set(_leverage);
			hideModal();
		}

		isSubmitting = false;

	}

	let priceImpact = getPriceImpact(data.size, data.productId, data.currencyLabel);

	let rows = [];

	function findExistingPosition() {
		for (const pos of $positions) {
			if (pos.currencyLabel == data.currencyLabel && pos.isLong == data.isLong) return pos;
		}
	}

	let existingPosition = findExistingPosition();

	async function calculateRows(price) {

		const product = await getProduct(data.productId);

		let _existingPosition = existingPosition;

		if (!_existingPosition) {
			_existingPosition = {
				size: 0,
				margin: 0,
				leverage: 0,
				price: 0
			};
		} else {
			_existingPosition.liqPrice = calculateLiquidationPrice({
				productId: data.productId,
				price: _existingPosition.price,
				leverage: _existingPosition.leverage,
				isLong: data.isLong
			});
		}

		let newSize = _existingPosition.size * 1 + data.size * 1;
		let newMargin = _existingPosition.margin * 1 + data.margin * 1;
		let newLeverage = newSize / newMargin;

		// console.log(newSize, newMargin, newLeverage);
		
		let averagePrice = (_existingPosition.price * _existingPosition.size + data.size * price) / (_existingPosition.size * 1 + data.size * 1);

		// console.log('averagePrice', averagePrice, priceImpact, data.isLong);

		if (data.isLong) {
			averagePrice = averagePrice * (1 + Math.abs(priceImpact) / 100);
		} else {
			averagePrice = averagePrice * (1 - Math.abs(priceImpact) / 100);
		}

		// console.log('averagePrice 2', averagePrice, priceImpact, data.isLong);

		let liqPrice = calculateLiquidationPrice({
			productId: data.productId,
			price: averagePrice,
			leverage: newLeverage,
			isLong: data.isLong
		});

		rows = [
			{
				label: 'Product',
				value: data.productId
			},
			{
				label: 'Direction',
				value: data.isLong ? 'Long' : 'Short'
			},
			{
				label: 'Entry Price',
				value: `${formatToDisplay(averagePrice)}`,
				anteriorValue: formatToDisplay(_existingPosition.price)
			},
			{
				label: 'Size',
				value: `${formatToDisplay(newSize)} ${formatCurrency(data.currencyLabel)}`,
				anteriorValue: formatToDisplay(_existingPosition.size)
			},
			{
				label: 'Margin',
				value: `${formatToDisplay(newMargin)} ${formatCurrency(data.currencyLabel)}`,
				anteriorValue: formatToDisplay(_existingPosition.margin)
			},
			{
				label: 'Leverage',
				value: `${formatToDisplay(newLeverage)}×`,
				anteriorValue: _existingPosition.leverage && `${formatToDisplay(_existingPosition.leverage)}×`
			},
			{
				label: 'Fee',
				value: `${product.fee || 0}%`
			},
			{
				label: 'Funding',
				value: `-${formatToDisplay(product.interest/(360*24)) || 0}% / h`
			}
		];

		if (Math.abs(priceImpact * 1) > 0.1) {
			rows.push({
				label: 'Price Impact',
				value: `${formatToDisplay(priceImpact)}%`
			});
		}

	}

	$: calculateRows($prices[data.productId]);

</script>

<style>

	.note {
		padding: var(--base-padding);
		line-height: 1.618;
		border-bottom: 1px solid var(--rich-black);
	}

</style>

<Modal title={existingPosition ? 'Resulting Position' : 'New Position'} showHeader={true} showCancel={true}>
	{#if existingPosition}
	<div class='note'>You're adding to an existing {data.isLong ? 'long' : 'short'} position.</div>
	{:else}
	<div class='note'>You're opening a new {data.isLong ? 'long' : 'short'} position.</div>
	{/if}
	<DataList data={rows} onSubmit={_submitNewPosition} />
	<Button wrap={true} isLoading={isSubmitting} onClick={_submitNewPosition} label='Confirm Order' />
</Modal>