<script>

/* TODO
- stream and reference price
- modals for product, leverage, currency
- order details: margin (includes 0.1% fee), size in USD
- order submission through contract
- positions
- history
- pools: deposit, withdraw, claim
- staking cap: deposit, withdraw, claim
- referrals (can be done later)
- chart
- homepage
*/

	import { onMount } from 'svelte'

	import Button from '../layout/Button.svelte'

	import { submitNewPosition, approveCurrency } from '../../lib/methods'

	import { PRODUCTS } from '../../utils/constants'
	import { showModal, shortSymbol, getCachedLeverage } from '../../utils/helpers'
	import { CARET_DOWN } from '../../utils/icons'

	import { productId, product, currencyLabel, leverage, amount, isSubmitting } from '../../stores/order'
	import { prices } from '../../stores/prices'
	import { allowances } from '../../stores/wallet'

	// functions

	function focusAmount() {
		const elem = document.getElementById('amount');
		if (elem) elem.focus();
	}

	async function _submitNewPosition(isLong) {
		if (!$amount) return focusAmount();
		const result = await submitNewPosition(isLong);
		if (result) {
			amount.set();
		} else {
			focusAmount();
		}
	}

	async function _approveCurrency() {
		const result = await approveCurrency($currencyLabel, 'trading');
	}

	function setInitialLeverage(_product) {
		if (!product) return;
		const cached = getCachedLeverage(_product.id);
		if (cached) return leverage.set(cached);
		leverage.set(_product.maxLeverage);
	}

	$: setInitialLeverage($product);

	//$: console.log('cp1', $productId, $product, $currency);

</script>

<style>

	.order {
		padding: var(--base-padding);
	}

	.split-row {
		display: grid;
		grid-auto-flow: column;
		grid-gap: var(--base-padding);
	}

	.amount-row {

	}

	.selector :global(svg) {
		margin-left: 12px;
		height: 8px;
		fill: transparent;
		stroke: #fff;
	}

</style>

<div class='order'>

	<div class='split-row'>

		<div class='box'>

			<div class='label-row'>
				<div class='label'>Product</div>
				<div class='tool'>{$prices[$productId]}</div>
			</div>

			<div class='selector selector-product' on:click={() => {showModal('Products')}} data-intercept="true">
				<img src={PRODUCTS[$productId].logo} alt={`${$product.symbol} logo`}>
				<span>{shortSymbol($product.symbol)}</span>
				{@html CARET_DOWN}
			</div>

		</div>

		<div class='box'>

			<div class='label-row'>
				<div class='label'>Leverage</div>
				<div class='tool'></div>
			</div>

			<div class='selector selector-leverage' on:click={() => {showModal('Leverage')}} data-intercept="true">
				<span>{$leverage}×</span>{@html CARET_DOWN}
			</div>

		</div>

	</div>

	<div class='amount-row'>

		<div class='label-row'>
			<div class='label'>Amount</div>
			<div class='tool'></div>
		</div>

		<div class='input-wrap'>
			<input id='amount' type='number' step="0.0001" bind:value={$amount} min="0" max="1000000" maxlength="10" spellcheck="false" placeholder={`0.0`} autocomplete="off" autocorrect="off" inputmode="decimal" disabled={$isSubmitting} lang="en">

			<div class='selector selector-currency' on:click={() => {showModal('Currencies')}} data-intercept="true">
				<span>{$currencyLabel}</span>{@html CARET_DOWN}
			</div>
		</div>

	</div>

	<div class='split-row'>
		{#if /*$currencyLabel != 'weth' &&*/ $allowances[$currencyLabel] && $allowances[$currencyLabel]['trading'] * 1 == 0}
		<Button label={`Approve ${$currencyLabel}`} onClick={() => {_approveCurrency()}} />
		{:else}
		<Button isRed={true} isLoading={$isSubmitting} label='Short' onClick={() => {_submitNewPosition(false)}} /> <Button isLoading={$isSubmitting} label='Long' onClick={() => {_submitNewPosition(true)}} />
		{/if}
	</div>

</div>