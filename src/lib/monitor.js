// Monitor tx and positions status 
import { get } from 'svelte/store'
import { ethers } from 'ethers'

import { provider } from './stores'

import { getUserPositions, getAllowance, getPoolInfo, getCapPoolInfo } from './methods'

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

async function handleTxComplete(type, details) {

	if (type == 'submitted-new-position') {
		await getUserPositions();
	} else if (type == 'approve') {
		await getAllowance(details.currencyLabel, details.spenderName);
	} else if (type == 'pool-deposit' || type == 'pool-withdraw' || type == 'pool-collect') {
		await getPoolInfo(details.currencyLabel);
	} else if (type == 'cap-deposit' || type == 'cap-withdraw' || type == 'cap-collect') {
		await getCapPoolInfo();
	}

}