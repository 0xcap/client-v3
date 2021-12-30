<script>

	import { onMount } from 'svelte'
	
	import Modal from './Modal.svelte'

	import { currencyLabel, address } from '../../lib/stores'

	import { selectCurrency, getBalanceOf } from '../../lib/methods'

	import { hideModal, getChainData, formatCurrency, formatToDisplay } from '../../lib/utils'
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
		justify-content: space-between;
		padding: 0 var(--base-padding);
		border-bottom: 1px solid var(--jet-dim);
		font-size: 120%;
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

	.currency-wrap {
		display: flex;
		align-items: center;
		font-weight: 700;
	}

	.currency-wrap img {
		width: 32px;
		margin-right: 10px;
	}

</style>

<Modal title='Select Collateral' showHeader={true}>

	{#each Object.entries(currencies || {}) as [_currencyLabel, _address]}

		<div class='row' class:selected={_currencyLabel == $currencyLabel} on:click={async () => {await selectCurrency(_currencyLabel); hideModal()}} data-intercept="true">

			<div class='currency-wrap'>
				<img src={CURRENCY_LOGOS[_currencyLabel]} alt={`${_currencyLabel} logo`}>
				<span>{formatCurrency(_currencyLabel)}</span>
			</div>

			{#if $address}
			<div class='balance'>
				{formatToDisplay(balances[_currencyLabel])} 
			</div>
			{/if}

		</div>

	{/each}

</Modal>