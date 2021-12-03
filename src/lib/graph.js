// Subgraph interaction
import { get } from 'svelte/store'

import { ADDRESS_ZERO } from './constants'
import { getContract } from './contracts'
import { getOrders, getPositions } from './methods'

import { formatUnits, formatTrades, formatOrders, formatPositions, setActiveProducts } from './utils'
import { history, orders, positions, address } from './stores'

const graph_url = 'https://api.thegraph.com/subgraphs/name/0xcap/cap3';

export async function getVolume() {

	// v1 and v2 volume should already be added in graph call 

	const response = await fetch(graph_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `
				query {
					datas(first: 2) {
						id
						cumulativeVolume
					}
				}
			`
		})
	});
	const json = await response.json();
	if (!json.data) return {volume: 1099876787};

	let datas = json.data && json.data.datas;
  	
  	// console.log('datas', datas);
  	
	let volumeETH = 110000;
	let volumeUSD = 0; // v2 + v1
	for (const d of datas) {
		// console.log('d', d);
		if (d.id == ADDRESS_ZERO) { // ETH
			volumeETH += formatUnits(d.cumulativeVolume) * 1;
		} else {
			volumeUSD += formatUnits(d.cumulativeVolume) * 1;
		}
	}
	return {
		volumeETH: volumeETH,
		volumeUSD: volumeUSD
	};
}

export async function getUserOrders() {

	// console.log('called getUserOrders');

	// from events only

	const _address = get(address);
	if (!_address) return;

	// From recent events + graph - merge both
	const contract = await getContract('trading');
	if (!contract) return;

	const filter = contract.filters.NewOrder(null, _address);
	const _events = await contract.queryFilter(filter, -100);

	// console.log('NewOrder _events', _events);

	let _details = {};
	for (const ev of _events) {
		_details[ev.args.key] = ev.args;
	}

	let keys = _events.map((e) => {return e.args.key;});

	// uniq keys
	let unique_keys = [];
	for (const k of keys) {
		if (unique_keys.includes(k)) continue;
		unique_keys.push(k);
	}

	let _raw_orders = await getOrders(unique_keys);

	let _order_info = [];
	for (const k of unique_keys) {
		_order_info.push(_details[k]);
	}

	// console.log('_raw_orders', _raw_orders, _order_info);
	
	orders.set(formatOrders(_raw_orders,_order_info));

}

export async function getUserPositions() {

	const _address = get(address);
	if (!_address) return;

	// From recent events + graph - merge both

	// events

	const contract = await getContract('trading');
	if (!contract) return;

	const filter = contract.filters.PositionUpdated(null, _address);
	const _events = await contract.queryFilter(filter, -100);

	// console.log('_events', _events);

	let _details = {};
	for (const ev of _events) {
		_details[ev.args.key] = ev.args;
	}

	let keys = _events.map((e) => {return e.args.key;});

	// console.log('keys', keys);

	// uniq keys
	let unique_keys = [];
	for (const k of keys) {
		if (unique_keys.includes(k)) continue;
		unique_keys.push(k);
	}

	// console.log('unique_keys', unique_keys);

	let raw_positions = await getPositions(unique_keys);
	// console.log('raw_positions', raw_positions);

	let _position_info = [];
	for (const k of unique_keys) {
		_position_info.push(_details[k]);
	}

	let event_positions = formatPositions(raw_positions,_position_info);

	// console.log('event_positions', event_positions);

	// graph

	const response = await fetch(graph_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `
				query {
				  positions(
				    orderBy: createdAtTimestamp,
				    orderDirection: desc,
				    first:50,
				    where: {user: "${_address}"}
				  ) {
				  	id,
				    productId,
				    currency,
				    margin,
				    fee,
				    size,
				    leverage,
				    price,
				    isLong,
				    createdAtTimestamp
				  }
				}
			`
		})
	});

	const json = await response.json();

	let _positions = json.data && json.data.positions;

	let _keys = _positions.map((e) => {return e.id;});

	let _raw_positions = await getPositions(_keys);

	// make sure graph positions actually exist in the contract for times the graph hasn't yet updated
	let actual_positions = [];
	let i = 0;
	for (const p of _positions) {
		if (_raw_positions[i] && _raw_positions[i].size && _raw_positions[i].size.toString() * 1 > 0) {
			actual_positions.push(p);
		}
		i++;
	}

	let graph_positions = formatPositions(actual_positions);

	// console.log('graph_positions', graph_positions);

	let unique_positions = [];
	let added_key = {};
	for (const item of event_positions) {
		if (!added_key[item.key]) {
			unique_positions.push(item);
			added_key[item.key] = true;
		}
	}
	for (const item of graph_positions) {
		if (!added_key[item.key]) {
			unique_positions.push(item);
			added_key[item.key] = true;
		}
	}

	positions.set(unique_positions);
	setActiveProducts();

}

export async function getUserHistory() {

	const _address = get(address);
	if (!_address) return;

	const response = await fetch(graph_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `
				query {
				  trades(
				    orderBy: timestamp,
				    orderDirection: desc,
				    first:50,
				    where: {user: "${_address}"}
				  ) {
				    id,
				    txHash,
				    positionKey,
				    productId,
				    currency,
				    margin,
				    leverage,
				    size,
				    entryPrice,
				    closePrice,
				    isLong,
				    pnl,
				    fee,
				    timestamp,
				    blockNumber,
				    wasLiquidated,
				    isFullClose
				  }
				}
			`
		})
	});
	const json = await response.json();
	history.set(formatTrades(json.data && json.data.trades));
}