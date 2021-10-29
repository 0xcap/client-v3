<script>

	import { onMount } from 'svelte'
	
	import Modal from './Modal.svelte'

	import { currencyLabel } from '../../lib/stores'

	import { selectCurrency, getBalanceOf } from '../../lib/methods'

	import { hideModal, getChainData } from '../../lib/utils'
	import { CURRENCY_LOGOS } from '../../lib/constants'

	let currencies = getChainData('currencies');
	
	let balances = {};

	async function getBalances() {
		for (const _currencyLabel in currencies) {
			balances[_currencyLabel] = await getBalanceOf(_currencyLabel);
		}
	}

	onMount(() => {
		getBalances();
	});

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

			<div class='currency-wrap'>
				<img src={CURRENCY_LOGOS[_currencyLabel]} alt={`${_currencyLabel} logo`}>
				<span>{_currencyLabel}</span>
			</div>

			<div class='balance'>
				{balances[_currencyLabel]}
			</div>

		</div>

	{/each}

</Modal>