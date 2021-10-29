<script>

	import { onMount } from 'svelte'

	import { calculateLiquidationPrice, formatToDisplay } from '../../lib/utils'
	
	import { addMargin } from '../../lib/methods'
	
	import Modal from './Modal.svelte'
	import DataList from '../layout/DataList.svelte'
	import Button from '../layout/Button.svelte'

	export let data;

	let margin;

	let currentLiquidationPrice = 0, newMargin = 0, newLeverage = 0, newLiquidationPrice = 0;

	async function calculateAmounts() {
		if (!margin*1) {
			newMargin = 0;
			newLeverage = 0;
			newLiquidationPrice = 0;
			return;
		}
		newMargin = data.margin * 1 + margin * 1;
		newLeverage = 1 * data.leverage * data.margin / newMargin;
		newLiquidationPrice = await calculateLiquidationPrice({
			productId: data.productId,
			leverage: newLeverage,
			margin: newMargin,
			price: data.price,
			isLong: data.isLong
		});
		newLiquidationPrice = newLiquidationPrice.toFixed(6);
	}

	let canSubmit;
	$: canSubmit = margin * 1 > 0 && newMargin * 1 > 0 && newLeverage * 1 >= 1 && newLiquidationPrice * 1 >= 0;

	let submitIsPending = false;
	async function _submitOrder() {
		submitIsPending = true;
		const error = await addMargin(
			data.positionId,
			margin,
			data.productId
		);
		submitIsPending = false;
	}

	onMount(async () => {
		currentLiquidationPrice = await calculateLiquidationPrice({
			productId: data.productId,
			leverage: data.leverage,
			margin: data.margin,
			price: data.price,
			isLong: data.isLong
		});
	});

	let rows;
	$: rows = [
		{
			type: 'input',
			label: 'Margin to Add',
			onKeyUp: calculateAmounts
		},
		{
			label: 'Current / New Margin',
			value: `${formatToDisplay(data.margin)} / ${formatToDisplay(newMargin)}`
		},
		{
			label: 'Current / New Leverage',
			value: `${formatToDisplay(data.leverage)}× / ${formatToDisplay(newLeverage)}×`,
			hasError: newLeverage * 1 < 1
		},
		{
			label: 'Current / New Liquidation Price',
			value: `${formatToDisplay(currentLiquidationPrice)} / ${formatToDisplay(newLiquidationPrice)}`,
			hasError: newLiquidationPrice * 1 <= 0
		}
	];

</script>

<style>
</style>

<Modal title='Add Margin'>
	<DataList data={rows} bind:value={margin} />
	<Button isDisabled={!canSubmit} isPending={submitIsPending} onClick={_submitOrder} label='Add Margin' />
</Modal>