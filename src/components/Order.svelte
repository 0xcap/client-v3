<script>
	import {_} from "../services/i18n"

	import { onMount } from 'svelte'

	import Button from './layout/Button.svelte'

	import { submitOrder, approveCurrency, getBalanceOf } from '../lib/methods'

	import { showModal, showToast, shortSymbol, getCachedLeverage, formatToDisplay, formatCurrency } from '../lib/utils'
	import { CARET_DOWN } from '../lib/icons'

	import { address, productId, product, currencyLabel, leverage, size, margin, marginPlusFee, isSubmittingShort, isSubmittingLong, prices, allowances } from '../lib/stores'

	// functions

	function focusAmount() {
		const elem = document.getElementById('size');
		if (elem) elem.focus();
	}

	async function _submitNewPosition(isLong) {
		if (!$size) return focusAmount();
		if (!$address) return showToast('Connect your wallet to trade.');

		if (isLong) {
			isSubmittingLong.set(true);
		} else {
			isSubmittingShort.set(true);
		}

		const error = await submitOrder(isLong);
		if (error) {
			focusAmount();
		} else {
			available -= $size * 1;
			size.set();
		}

		isSubmittingLong.set(false);
		isSubmittingShort.set(false);
	}

	async function _approveCurrency() {
		const result = await approveCurrency($currencyLabel, 'trading');
	}

	function setInitialLeverage(_product, _productId) {
		if (!_product || !_productId) return;
		const cached = getCachedLeverage(_productId);
		// console.log('cached', cached);
		if (cached) {
			leverage.set(cached);
		} else {
			leverage.set(_product.maxLeverage);
		}
	}

	$: setInitialLeverage($product, $productId);	

	let available = 0;

	async function getBalance(_currencyLabel, _leverage, _address) {
		if (!_leverage || !_currencyLabel || !_address) return;
		let balance = await getBalanceOf(_currencyLabel);
		available = balance * _leverage * 1;
	}

	$: getBalance($currencyLabel, $leverage, $address);

	let sizeInUSD = 0;

	async function getSizeInUSD(_currencyLabel, _prices, _size) {
		if (!_prices || !_currencyLabel || !_size) return 0;
		if (_currencyLabel == 'weth') {
			sizeInUSD = _prices[1] * _size;
		} else if (_currencyLabel == 'usdc') {
			sizeInUSD = 0;
		}
	}

	$: getSizeInUSD($currencyLabel, $prices, $size);

</script>

<style>

	.order {
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--base-padding);
		border-bottom: 1px solid var(--rich-black-fogra);
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
		background-color: var(--onyx-dim);
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
		background-color: var(--onyx-dim);
		border-radius: var(--base-radius);
		border: 1px solid var(--onyx-dim);
		padding: 11px var(--base-padding);
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

	.note {
		padding: var(--base-padding);
		border-top: 1px solid var(--jet);
		color: var(--sonic-silver);
		font-size: 80%;
	}

</style>

<div class='order' class:loading={$isSubmittingLong || $isSubmittingShort}>

	<div class='header'>

		<div class='title'>{$_('page.order.title')}</div>
		<div class='pills'>
			<div class='pill' on:click={() => {if ($address) {showModal('Currencies')}}} data-intercept="true">{formatCurrency($currencyLabel)}</div>
			<div class='pill' on:click={() => {showModal('Leverage')}} data-intercept="true">{formatToDisplay($leverage)}×</div>
		</div>

	</div>

	<div class='input-wrap'>

		<span class='label'>Size ({formatCurrency($currencyLabel)})</span>
		<input id='size' type='number' step="0.0001" bind:value={$size} min="0" max="1000000" maxlength="10" spellcheck="false" placeholder={`0.0`} autocomplete="off" autocorrect="off" inputmode="decimal" lang="en">

	</div>

	<div class='buttons'>
		{#if $currencyLabel != 'weth' && $allowances[$currencyLabel] && $allowances[$currencyLabel]['trading'] * 1 == 0}
		<Button label={`Approve ${formatCurrency($currencyLabel)}`} onClick={() => {_approveCurrency()}} />
		{:else}
		<Button isRed={true} isLoading={$isSubmittingShort} label={$_('p.short')} onClick={() => {_submitNewPosition(false)}} /> <Button isLoading={$isSubmittingLong} label={$_('p.long')} onClick={() => {_submitNewPosition(true)}} />
		{/if}
	</div>

	<div class='details'>
		{#if $margin * 1 > 0}
		<div class='row'>
			<div class='detail-label'>{$_('p.prod')}</div>
			<div class='detail-value'>{$product.symbol}</div>
		</div>
		{#if sizeInUSD}
		<div class='row'>
			<div class='detail-label'>{$_('p.sizeUSD')}</div>
			<div class='detail-value'>${formatToDisplay(sizeInUSD, 2)}</div>
		</div>
		{/if}
		<div class='row'>
			<div class='detail-label'>{$_('p.margin')}</div>
			<div class='detail-value'>{formatToDisplay($marginPlusFee || 0)} {formatCurrency($currencyLabel)}</div>
		</div>
		{#if $product.fee}
		<div class='row'>
			<div class='detail-label'>{$_('p.fee')}</div>
			<div class='detail-value'>{$product.fee}%</div>
		</div>
		{/if}
		{:else}
		<div class='row'>
			<div class='detail-label'>{$_('page.order.power')}</div>
			<div class='detail-value'>{formatToDisplay(available)} {formatCurrency($currencyLabel)}</div>
		</div>
		{/if}
	</div>

	{#if available * 1 == 0}
	<div class='note'>{@html $_('page.order.note')}</div>
	{/if}
	

</div>