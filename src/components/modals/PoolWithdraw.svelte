<script>
	import { _ } from '../../services/i18n';

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
				amount
			);
		}
		submitIsPending = false;
	}

	onMount(async () => {

	});

	let rows;
	$: rows = [
		{
			type: 'input',
			label: $_('page.pool.amount')+' (' + formatCurrency(data.currencyLabel) + ')',
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
		<div class='info'> {$_('page.pool.withdrawNote',{values:{"fee":data.withdrawFee}})}</div>
	{/if}
	<Button wrap={true} isLoading={!amount || submitIsPending} onClick={_submit} label={$_('page.pool.btnWithdraw',{values:{"currency":formatCurrency(data.currencyLabel)}})}/>
</Modal>