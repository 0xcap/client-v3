// Oracle triggered events. For user tx triggered actions, use monitor
import { get } from 'svelte/store'
import { getContract } from './contracts'
import { getUserPositions } from './methods'

import { address } from '../stores/wallet'

export async function initEventListeners() {
	const tradingContract = await getContract('trading');
	if (!tradingContract) return;

	tradingContract.removeAllListeners();
	
	const _address = get(address);
	if (!_address) return;

	tradingContract.on(tradingContract.filters.NewPosition(null, _address), handleEvent);
	tradingContract.on(tradingContract.filters.ClosePosition(null, _address), handleEvent);
}

function handleEvent() {

	const ev = arguments[arguments.length - 1];

	if (ev.event == 'NewPosition') {
		// From listener only - oracle triggered
		getUserPositions();
	}

	if (ev.event == 'ClosePosition') {
		// From listener only - oracle triggered
		getUserPositions();
		getUserHistory();
	}

}