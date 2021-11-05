<script>

	import { onMount } from 'svelte'

	import { formatToDisplay, formatCurrency, hideModal } from '../../lib/utils'
	
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
		hideModal();
	}

	onMount(async () => {

	});

	let rows;
	$: rows = [
		{
			type: 'input',
			label: 'Amount',
			onKeyUp: calculateShare
		}
	];

</script>

<style>
</style>

<Modal>
	<DataList data={rows} bind:value={amount} />
	<Button wrap={true} isLoading={!amount || submitIsPending} onClick={_submit} label={`Withdraw from ${formatCurrency(data.currencyLabel)} pool`} />
</Modal>