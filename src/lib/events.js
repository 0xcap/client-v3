// Oracle triggered events. For user tx triggered actions, use monitor
import { get } from 'svelte/store'
import { getContract } from './contracts'
import { getUserOrders, getUserPositions, getUserHistory } from './graph'

import { address } from './stores'

export async function initEventListeners() {
	const tradingContract = await getContract('trading');
	if (!tradingContract) return;

	tradingContract.removeAllListeners();
	
	const _address = get(address);
	if (!_address) return;

	tradingContract.on(tradingContract.filters.NewOrder(null, _address), handleEvent);
	tradingContract.on(tradingContract.filters.PositionUpdated(null, _address), handleEvent);
	tradingContract.on(tradingContract.filters.ClosePosition(null, _address), handleEvent);

	const oracleContract = await getContract('oracle');
	if (!oracleContract) return;
	
	oracleContract.on(oracleContract.filters.SettlementError(), console.log);
}

function handleEvent() {

	const ev = arguments[arguments.length - 1];

	console.log('got event', ev);

	if (ev.event == 'NewOrder') {
		getUserOrders();
	}

	if (ev.event == 'PositionUpdated') {
		// From listener only - oracle triggered
		getUserPositions();
	}

	if (ev.event == 'ClosePosition') {
		// From listener only - oracle triggered
		getUserPositions();
		getUserHistory();
	}

}