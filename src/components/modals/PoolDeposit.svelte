<script>

	import { onMount } from 'svelte'

	import { formatToDisplay, formatCurrency } from '../../lib/utils'
	
	import { deposit, depositCAP } from '../../lib/methods'
	
	import Modal from './Modal.svelte'
	import DataList from '../layout/DataList.svelte'
	import Button from '../layout/Button.svelte'

	export let data;

	let amount;

	async function calculateShare() {
		
	}

	let submitIsPending = false;
	async function _submit() {
		submitIsPending = true;
		let error;
		if (data.currencyLabel == 'cap') {
			error = await depositCAP(
				amount
			);
		} else {
			error = await deposit(
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
			label: 'Amount (' + formatCurrency(data.currencyLabel) + ')',
			onKeyUp: calculateShare
		}
	];

</script>

<style>
</style>

<Modal>
	<DataList data={rows} bind:value={amount} onSubmit={_submit} />
	<Button wrap={true} isLoading={!amount || submitIsPending} onClick={_submit} label={`Deposit into ${formatCurrency(data.currencyLabel)} pool`} />
</Modal>