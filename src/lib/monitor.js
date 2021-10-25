// Monitor tx and positions status 
import { get } from 'svelte/store'
import { ethers } from 'ethers'

import { provider } from '../stores/wallet'

import { getUserPositions } from './methods'

export async function monitorTx(hash, type) {

	let i = 0;
	let c = setInterval(async () => {
		i++;
		if (i > 30) return clearInterval(c);
		const txReceipt = await get(provider).getTransactionReceipt(hash);
	    if (txReceipt && txReceipt.blockNumber) {
	    	handleTxComplete({type, receipt});
	    	clearInterval(c);
	    }
	}, 500);

}

function handleTxComplete(type, receipt) {

	if (type == 'submitted-new-position') {
		getUserPositions();
	}

}