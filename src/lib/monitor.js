// Monitor tx and positions status 
import { get } from 'svelte/store'
import { ethers } from 'ethers'

import { provider } from '../stores/wallet'

import { getUserPositions, getAllowance, getPoolInfo } from './methods'

export async function monitorTx(hash, type, details) {

	let i = 0;
	let c = setInterval(async () => {
		i++;
		if (i > 30) return clearInterval(c);
		const txReceipt = await get(provider).getTransactionReceipt(hash);
	    if (txReceipt && txReceipt.blockNumber) {
	    	handleTxComplete({type, details});
	    	clearInterval(c);
	    }
	}, 500);

}

function handleTxComplete(type, details) {

	if (type == 'submitted-new-position') {
		getUserPositions();
	} else if (type == 'approve') {
		getAllowance(details.currencyLabel, details.spenderName);
	} else if (type == 'pool-stake' || type == 'pool-unstake' || type == 'pool-collect') {
		getPoolInfo(details.currencyLabel);
	}

}