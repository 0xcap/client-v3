<script>

/* TODO
- order form, form elements
- order details
- modal products
- modal leverage
- modal currency - with balance of each
- chart with resolutions and product selection
- positions list 
- modal position details
- modal close position
- modal add margin
- history list
- modal trade details
- pools list
- pool deposit modal
- pool withdraw modal
- nav
- wallet, network, & disconnect
- referrals, rebates
- homepage
- design and branding
*/

	import { onMount } from 'svelte'

	import Input from '../layout/Input.svelte'
	import Button from '../layout/Button.svelte'

	import { submitNewPosition, approveCurrency } from '../../lib/methods'

	import { PRODUCTS } from '../../utils/constants'
	import { showModal, shortSymbol, getCachedLeverage, formatToDisplay } from '../../utils/helpers'
	import { CARET_DOWN } from '../../utils/icons'

	import { productId, product, currencyLabel, leverage, amount, margin, isSubmittingShort, isSubmittingLong } from '../../stores/order'
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
		border: 1px solid var(--green);
		border-radius: var(--base-radius);
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

<div class='order' class:loading={$isSubmittingLong || $isSubmittingShort}>

	<div class='split-row'>

		<div class='box'>

			<div class='label-row'>
				<div class='label'>Product</div>
				<div class='tool'></div>
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
			{#if $currencyLabel == 'weth'}
			<div class='tool'>${formatToDisplay($prices[1] * $amount, 2)}</div>
			{/if}
		</div>

		<div class='input-wrap'>
			
			<Input bindValue={amount} id='amount' />

			<div class='selector selector-currency' on:click={() => {showModal('Currencies')}} data-intercept="true">
				<span>{$currencyLabel}</span>{@html CARET_DOWN}
			</div>

		</div>

	</div>

	<div class='order-details'>
		<div class='detail-label'>Margin</div>
		<div class='detail-value'>{$margin} {$currencyLabel}</div>
	</div>

	<div class='split-row'>
		{#if $currencyLabel != 'weth' && $allowances[$currencyLabel] && $allowances[$currencyLabel]['trading'] * 1 == 0}
		<Button label={`Approve ${$currencyLabel}`} onClick={() => {_approveCurrency()}} />
		{:else}
		<Button isRed={true} isLoading={$isSubmittingShort} label='Short' onClick={() => {_submitNewPosition(false)}} /> <Button isLoading={$isSubmittingLong} label='Long' onClick={() => {_submitNewPosition(true)}} />
		{/if}
	</div>

</div>