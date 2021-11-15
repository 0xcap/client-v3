// Monitor tx and positions status 
import { get } from 'svelte/store'
import { ethers } from 'ethers'

import { provider } from './stores'

import { getAllowance, getPoolInfo, getCapPoolInfo } from './methods'
import { getUserPositions } from './graph'

import { showToast, formatCurrency } from './utils'

export async function monitorTx(hash, type, details) {

	let i = 0;
	let c = setInterval(async () => {
		i++;
		if (i > 30) return clearInterval(c);
		const txReceipt = await get(provider).getTransactionReceipt(hash);
	    if (txReceipt && txReceipt.blockNumber) {
	    	handleTxComplete(type, details);
	    	clearInterval(c);
	    }
	}, 500);

}

// Todo: show success toasts

async function handleTxComplete(type, details) {

	if (type == 'submit-new-position') {
		showToast('Order submitted.', 'success');
		await getUserPositions();
	} else if (type == 'submit-close-order') {
		showToast('Close order submitted.', 'success');
		await getUserPositions();
	} else if (type == 'add-margin') {
		showToast('Margin added.', 'success');
		await getUserPositions();
	} else if (type == 'cancel-position') {
		showToast('Position cancelled.', 'success');
		await getUserPositions();
	} else if (type == 'cancel-order') {
		showToast('Close order cancelled.', 'success');
		await getUserPositions();
	} else if (type == 'approve') {
		await getAllowance(details.currencyLabel, details.spenderName);
	} else if (type == 'pool-deposit') {
		showToast(`Deposited into ${formatCurrency(details.currencyLabel)} pool.`, 'success');
		await getPoolInfo(details.currencyLabel);
	} else if (type == 'pool-withdraw') {
		showToast(`Withdrew from ${formatCurrency(details.currencyLabel)} pool.`, 'success');
		await getPoolInfo(details.currencyLabel);
	} else if (type == 'pool-collect') {
		showToast(`Collected rewards from ${formatCurrency(details.currencyLabel)} pool.`, 'success');
		await getPoolInfo(details.currencyLabel);
	} else if (type == 'cap-deposit') {
		showToast('Deposited CAP into pool.', 'success');
		await getCapPoolInfo();
	} else if (type == 'cap-withdraw') {
		showToast('Withdrew CAP from pool.', 'success');
		await getCapPoolInfo();
	} else if (type == 'cap-collect') {
		showToast('Collected rewards from CAP pool.', 'success');
		await getCapPoolInfo();
	}

}