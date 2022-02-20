<script>

	import { onMount } from 'svelte'

	import { formatToDisplay, formatCurrency } from '../../lib/utils'
	
	import { deposit, depositCAP, getBalanceOf } from '../../lib/methods'
	
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

	let loading = false;
	let balance = 0;
	onMount(async () => {
		// get available balance
		loading = true;
		balance = await getBalanceOf(data.currencyLabel);
		loading = false;
	});

	function setMaxAmount() {
		let _balance = balance * 1;
		if (data.currencyLabel == 'weth') {
			_balance -= 0.003; // gas 
			if (_balance < 0) _balance = 0;
		}
		amount = _balance;
	}

	let rows;
	$: rows = [
		{
			type: 'input',
			label: 'Amount (' + formatCurrency(data.currencyLabel) + ')',
			onKeyUp: calculateShare
		},
		{
			label: 'Wallet Balance',
			value: `${formatToDisplay(balance)}`,
			onclick: setMaxAmount,
			isEmpty: loading
		}
	];

</script>

<style>
</style>

<Modal>
	<DataList data={rows} bind:value={amount} onSubmit={_submit} />
	<Button wrap={true} isLoading={!amount || submitIsPending} onClick={_submit} label={`Deposit into ${formatCurrency(data.currencyLabel)} pool`} />
</Modal>