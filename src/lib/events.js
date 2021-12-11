// Oracle triggered events. For user tx triggered actions, use monitor
import { get } from 'svelte/store'
import { getContract } from './contracts'
import { getUserOrders, getUserPositions, getUserHistory } from './graph'

import { address } from './stores'

import { formatToDisplay, formatUnits, formatPnl, getCurrencyLabelFromAddress, formatCurrency, fromBytes32, showToast } from './utils'

export async function initEventListeners() {
	const tradingContract = await getContract('trading');
	if (!tradingContract) return;

	tradingContract.removeAllListeners();
	
	const _address = get(address);
	if (!_address) return;

	tradingContract.on(tradingContract.filters.NewOrder(null, _address), handleEvent);
	tradingContract.on(tradingContract.filters.PositionUpdated(null, _address), handleEvent);
	tradingContract.on(tradingContract.filters.ClosePosition(null, _address), handleEvent);

	// const oracleContract = await getContract('oracle');
	// if (!oracleContract) return;
	
	// oracleContract.on(oracleContract.filters.SettlementError(), console.log);
}

async function handleEvent() {

	const ev = arguments[arguments.length - 1];

	// console.log('got event', ev.event, ev);

	const args = ev.args;

	if (ev.event == 'NewOrder') {
		await getUserOrders();
	}

	if (ev.event == 'PositionUpdated') {
		// From listener only - oracle triggered
		await getUserOrders();
		await getUserPositions();
		// console.log('refreshed orders and positions');

		// event PositionUpdated(
		// 	bytes32 indexed key,
		// 	address indexed user,
		// 	bytes32 indexed productId,
		// 	address currency,
		// 	bool isLong,
		// 	uint256 margin,
		// 	uint256 size,
		// 	uint256 price,
		// 	uint256 fee
		// );

		// notify
		let size = formatToDisplay(formatUnits(args.size));
		let currency = formatCurrency(getCurrencyLabelFromAddress(args.currency));
		let price = formatToDisplay(formatUnits(args.price));
		showToast(`Order executed: ${size} ${currency} ${args.isLong ? 'long' : 'short'} on ${fromBytes32(args.productId)} at ${price}.`, 'success');

	}

	if (ev.event == 'ClosePosition') {
		// From listener only - oracle triggered
		await getUserHistory();

		// event ClosePosition(
		// 	bytes32 indexed key,
		// 	address indexed user,
		// 	bytes32 indexed productId,
		// 	address currency,
		// 	bool isLong,
		// 	uint256 price,
		// 	uint256 margin,
		// 	uint256 size,
		// 	uint256 fee,
		// 	int256 pnl,
		// 	bool wasLiquidated
		// );

		if (args.wasLiquidated) return;

		// notify
		let size = formatToDisplay(formatUnits(args.size));
		let currency = formatCurrency(getCurrencyLabelFromAddress(args.currency));
		let price = formatToDisplay(formatUnits(args.price));
		let pnl = formatPnl(formatUnits(args.pnl));
		showToast(`Position closed on ${fromBytes32(args.productId)}. P/L: ${pnl} ${currency}.`, 'success');

	}

}