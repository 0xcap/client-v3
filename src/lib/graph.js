// Subgraph interaction
import { get } from 'svelte/store'

import { getContract } from './contracts'

import { formatUnits, formatTrades } from './utils'
import { history, address } from './stores'

const graph_url = 'https://api.thegraph.com/subgraphs/name/0xcap/capv3';

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
					data(id: 1) {
						cumulativeVolumeUSD
					}
				}
			`
		})
	});
	const json = await response.json();
	if (!json.data) return {volume: 1099876787};
	return {
		volume: formatUnits(1 * json.data.data.cumulativeVolumeUSD)
	};
}

export async function getUserHistory() {

	const _address = get(address);
	if (!_address) return;

	// From events (local test)
	const contract = await getContract('trading');
	if (!contract) return;

	const filter = contract.filters.ClosePosition(null, _address);
	const _events = await contract.queryFilter(filter, -1000);

	history.set(formatTrades(_events.map((e) => {return e.args;})));
	return;

	////////

	

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
				    where: {owner: "${_address}"}
				  ) {
				    id,
				    txHash,
				    positionId,
				    productId,
				    currency,
				    margin,
				    leverage,
				    amount,
				    entryPrice,
				    closePrice,
				    isLong,
				    pnl,
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