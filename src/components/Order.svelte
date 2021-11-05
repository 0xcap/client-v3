<script>

	import { onMount } from 'svelte'

	import Input from './layout/Input.svelte'
	import Button from './layout/Button.svelte'

	import { submitNewPosition, approveCurrency, getBalanceOf } from '../lib/methods'

	import { PRODUCTS } from '../lib/constants'
	import { showModal, shortSymbol, getCachedLeverage, formatToDisplay, formatCurrency } from '../lib/utils'
	import { CARET_DOWN } from '../lib/icons'

	import { productId, product, currencyLabel, leverage, size, margin, marginPlusFee, isSubmittingShort, isSubmittingLong, prices, allowances } from '../lib/stores'

	// functions

	function focusAmount() {
		const elem = document.getElementById('size');
		if (elem) elem.focus();
	}

	async function _submitNewPosition(isLong) {
		if (!$size) return focusAmount();
		const result = await submitNewPosition(isLong);
		if (result) {
			size.set();
		} else {
			focusAmount();
		}
	}

	async function _approveCurrency() {
		const result = await approveCurrency($currencyLabel, 'trading');
	}

	function setInitialLeverage(_product) {
		if (!_product) return;
		const cached = getCachedLeverage(_product.id);
		if (cached) return leverage.set(cached);
		leverage.set(_product.maxLeverage);
	}

	$: setInitialLeverage($product, $productId);

	let available = 0;

	async function getBalance(_currencyLabel, _leverage) {
		let balance = await getBalanceOf(_currencyLabel);
		available = balance * _leverage * 1;
	}

	$: getBalance($currencyLabel, $leverage);

	//$: console.log('cp1', $productId, $product, $currency);

</script>

<style>

	.order {
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--base-padding);
		border-bottom: 1px solid var(--onyx);
		height: var(--ticker-height);
	}

	.title {
		font-weight: 700;
	}

	.pills {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.pill {
		padding: 4px 8px;
		border-radius: var(--base-radius);
		background-color: var(--onyx);
		cursor: pointer;
		margin-left: 6px;
	}
	.pill:hover {
		background-color: var(--dim-gray);
	}

	.input-wrap {
		position: relative;
		padding: var(--base-padding);
	}

	input {
		background-color: var(--onyx);
		border-radius: var(--base-radius);
		border: 1px solid var(--onyx);
		padding: 11px 62px;
		width: 100%;
		box-sizing: border-box;
		text-align: right;
	}
	input:hover, input:focus {
		border-color: var(--green);
	}

	.label {
		position: absolute;
		top: 50%;
		left: 26px;
		transform: translateY(-50%);
		color: #888;
		pointer-events: none;
	}

	.currency {
		position: absolute;
		top: 50%;
		right: 26px;
		transform: translateY(-50%);
		pointer-events: none;
	}

	.buttons {
		display: grid;
		grid-auto-flow: column;
		grid-gap: 10px;
		padding: var(--base-padding);
		padding-top: 0;
	}

	.details {
		padding: var(--base-padding);
		padding-top: 0;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 10px;
	}
	.row:last-child {
		padding-bottom: 0;
	}

	.detail-label {
		color: var(--sonic-silver);
	}

</style>

<div class='order' class:loading={$isSubmittingLong || $isSubmittingShort}>

	<div class='header'>

		<div class='title'>Place Order</div>
		<div class='pills'>
			<div class='pill' on:click={() => {showModal('Currencies')}} data-intercept="true">{formatCurrency($currencyLabel)}</div>
			<div class='pill' on:click={() => {showModal('Leverage')}} data-intercept="true">{formatToDisplay($leverage)}×</div>
		</div>

	</div>

	<div class='input-wrap'>

		<span class='label'>Size</span>
		<input id='size' type='number' step="0.0001" bind:value={$size} min="0" max="1000000" maxlength="10" spellcheck="false" placeholder={`0.0`} autocomplete="off" autocorrect="off" inputmode="decimal" lang="en">
		<span class='currency'>{formatCurrency($currencyLabel)}</span>

	</div>

	<div class='buttons'>
		{#if $currencyLabel != 'weth' && $allowances[$currencyLabel] && $allowances[$currencyLabel]['trading'] * 1 == 0}
		<Button label={`Approve ${$currencyLabel}`} onClick={() => {_approveCurrency()}} />
		{:else}
		<Button isRed={true} isLoading={$isSubmittingShort} label='Short' onClick={() => {_submitNewPosition(false)}} /> <Button isLoading={$isSubmittingLong} label='Long' onClick={() => {_submitNewPosition(true)}} />
		{/if}
	</div>

	
	<div class='details'>
		{#if $margin * 1 > 0}
		<div class='row'>
			<div class='detail-label'>Size in USD</div>
			<div class='detail-value'>${formatToDisplay($prices[1] * $size, 2)}</div>
		</div>
		<div class='row'>
			<div class='detail-label'>Margin</div>
			<div class='detail-value'>{formatToDisplay($marginPlusFee)} {formatCurrency($currencyLabel)}</div>
		</div>
		<div class='row'>
			<div class='detail-label'>Fee</div>
			<div class='detail-value'>{$product.fee}%</div>
		</div>
		{:else}
		<div class='row'>
			<div class='detail-label'>Buying Power</div>
			<div class='detail-value'>{formatToDisplay(available)} {formatCurrency($currencyLabel)}</div>
		</div>
		{/if}
	</div>
	

</div>