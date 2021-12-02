<script>

	import { onMount } from 'svelte'

	import Button from './layout/Button.svelte'

	import { PRODUCTS } from '../lib/products'

	import { submitOrder, approveCurrency, getBalanceOf } from '../lib/methods'

	import { showModal, showToast, shortSymbol, getCachedLeverage, formatToDisplay, formatCurrency } from '../lib/utils'
	import { CARET_DOWN } from '../lib/icons'

	import { address, productId, product, currencyLabel, leverage, size, margin, marginPlusFee, isSubmittingShort, isSubmittingLong, prices, allowances, slippage } from '../lib/stores'

	// functions

	function focusAmount() {
		const elem = document.getElementById('size');
		if (elem) elem.focus();
	}

	async function _submitNewPosition(isLong) {
		
		if (!$size) return focusAmount();
		if (!$address) return showToast('Connect your wallet to trade.');

		if ($size * 1 > PRODUCTS[$productId].maxLiquidity[$currencyLabel]) return showToast('Order size exceeds maximum allowed on this market.');

		if (isLong) {
			isSubmittingLong.set(true);
		} else {
			isSubmittingShort.set(true);
		}

		const error = await submitOrder(isLong);
		if (error) {
			focusAmount();
		} else {
			balance -= $margin * 1;
			available -= $size * 1;
			if (balance < 0) balance = 0;
			if (available < 0) available = 0;
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

	let balance = 0;
	let available = 0;

	async function getBalance(_currencyLabel, _leverage, _address) {
		if (!_leverage || !_currencyLabel || !_address) return;
		balance = await getBalanceOf(_currencyLabel);
		available = balance * _leverage * 1;
	}

	$: getBalance($currencyLabel, $leverage, $address);

	let sizeInUSD = 0;

	async function getSizeInUSD(_currencyLabel, _prices, _size) {
		if (!_prices || !_currencyLabel || !_size) return 0;
		if (_currencyLabel == 'weth') {
			sizeInUSD = _prices['ETH-USD'] * _size;
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
		padding-bottom: 12px;
		font-size: 90%;
	}
	.row:last-child {
		padding-bottom: 0;
	}

	.detail-label {
		color: var(--sonic-silver);
	}

	.sep {
		height: 1px;
		line-height: 0;
		border-top: 1px solid var(--jet);
		margin: 4px 0 var(--base-padding);
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

		<div class='title'>Place Order</div>
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
		<Button isRed={true} isLoading={$isSubmittingShort} label='Short' onClick={() => {_submitNewPosition(false)}} /> <Button isLoading={$isSubmittingLong} label='Long' onClick={() => {_submitNewPosition(true)}} />
		{/if}
	</div>

	<div class='details'>
		{#if $margin * 1 > 0}
			{#if sizeInUSD}
			<div class='row'>
				<div class='detail-label'>Size in USD</div>
				<div class='detail-value'>${formatToDisplay(sizeInUSD, 2)}</div>
			</div>
			{/if}
			<div class='row'>
				<div class='detail-label'>Margin</div>
				<div class='detail-value'>{formatToDisplay($marginPlusFee || 0)} {formatCurrency($currencyLabel)}</div>
			</div>
			{#if Math.abs($slippage * 1) > $product.fee * 1}
				<div class='row'>
					<div class='detail-label'>Price Impact</div>
					<div class='detail-value'>{formatToDisplay($slippage)}%</div>
				</div>
			{/if}
			<div class='sep'></div>
		{/if}
		<div class='row'>
			<div class='detail-label'>Buying Power</div>
			<div class='detail-value'>{formatToDisplay(available)} {formatCurrency($currencyLabel)}</div>
		</div>
		<div class='row'>
			<div class='detail-label'>Wallet Balance</div>
			<div class='detail-value'>{formatToDisplay(balance)} {formatCurrency($currencyLabel)}</div>
		</div>
		<div class='sep'></div>
		<div class='row'>
			<div class='detail-label'>Product</div>
			<div class='detail-value'>{$product.symbol}</div>
		</div>
		<div class='row'>
			<div class='detail-label'>Fee</div>
			<div class='detail-value'>{$product.fee || 0}%</div>
		</div>
		<div class='row'>
			<div class='detail-label'>Funding</div>
			<div class='detail-value'>-{formatToDisplay($product.interest/(360*24)) || 0}% / hr</div>
		</div>
		<div class='row'>
			<div class='detail-label'>Trading Hours</div>
			<div class='detail-value'>{$product.hours}</div>
		</div>
	</div>

	{#if $address && balance * 1 == 0}
	<div class='note'><a href='https://docs.cap.finance/setting-up-your-wallet' target='_blank'>Bridge funds</a> to Arbitrum to start trading.</div>
	{/if}
	

</div>