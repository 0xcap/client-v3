<script>
	
	import Modal from '../modals/Modal.svelte'

	import { currencyLabel } from '../../stores/order'

	import { selectCurrency } from '../../lib/methods'

	import { hideModal, getChainData } from '../../utils/helpers'
	import { CURRENCY_LOGOS } from '../../utils/constants'

	let currencies = getChainData('currencies');
	
	console.log('currencies', currencies);

</script>

<style>

	.row {
		display: flex;
		align-items: center;
		padding: 0 var(--base-padding);
		border-bottom: 1px solid var(--jet-dim);
		font-size: 120%;
		font-weight: 700;
		cursor: pointer;
		height: 74px;
	}
	.row:not(.selected):hover {
		background-color: var(--jet-dim);
	}
	.row.selected {
		background-color: var(--jet);
		cursor: default !important;
	}
	.row:last-child {
		border-bottom: none;
	}

	.row img {
		max-width: 42px;
		margin-right: 20px;
	}

</style>

<Modal>

	{#each Object.entries(currencies || {}) as [_currencyLabel, _address]}

		<div class='row' class:selected={_currencyLabel == $currencyLabel} on:click={async () => {await selectCurrency(_currencyLabel); hideModal()}} data-intercept="true">

			<div class='product-wrap'>
				<img src={CURRENCY_LOGOS[_currencyLabel]} alt={`${_currencyLabel} logo`}>
				<span>{_currencyLabel}</span>
			</div>

		</div>

	{/each}

</Modal>