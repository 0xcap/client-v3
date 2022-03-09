<script>

	import { onMount } from 'svelte'

	import { formatToDisplay, formatCurrency } from '../../lib/utils'
	
	import { withdraw, withdrawCAP } from '../../lib/methods'
	
	import Modal from './Modal.svelte'
	import DataList from '../layout/DataList.svelte'
	import Button from '../layout/Button.svelte'

	export let data;

	let amount;

	async function calculateShare() {
		
	}

	let canSubmit;
	$: canSubmit = true;

	let submitIsPending = false;
	async function _submit() {
		submitIsPending = true;
		let error;
		if (data.currencyLabel == 'cap') {
			error = await withdrawCAP(
				amount
			);
		} else {
			error = await withdraw(
				data.currencyLabel,
				amount,
				data.isOld
			);
		}
		submitIsPending = false;
	}

	if (!isNaN(+data.userBalance)) {
		amount = +data.userBalance;
	}
	
	onMount(async () => {

	});

	let rows;
	$: rows = [
		{
			type: 'input',
			label: 'Amount (' + formatCurrency(data.currencyLabel) + ')',
			onKeyUp: calculateShare
		}
	];

</script>

<style>
	.info {
		color: var(--sonic-silver);
		padding: var(--base-padding);
		font-size: 85%;
		text-align: center;
	}
</style>

<Modal>
	<DataList data={rows} bind:value={amount} onSubmit={_submit} />
	{#if data.withdrawFee}
		<div class='info'>{data.withdrawFee}% is retained and awarded to the rest of the pool.</div>
	{/if}
	<Button wrap={true} isLoading={!amount || submitIsPending} onClick={_submit} label={`Withdraw from ${formatCurrency(data.currencyLabel)} pool`} />
</Modal>