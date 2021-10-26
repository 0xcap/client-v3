// Monitor tx and positions status 
import { get } from 'svelte/store'
import { ethers } from 'ethers'

import { provider } from '../stores/wallet'

import { getUserPositions, getAllowance, getPoolInfo, getStakingInfo } from './methods'

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
	} else if (type == 'pool-stake' || type == 'pool-unstake' || type == 'pool-collect') {
		await getPoolInfo(details.currencyLabel);
	} else if (type == 'cap-stake' || type == 'cap-unstake' || type == 'cap-collect') {
		await getStakingInfo();
	}

}