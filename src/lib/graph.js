// Subgraph interaction
import { get } from 'svelte/store'

import { formatUnits, formatTrades } from '../utils/helpers'
import { address } from '../stores/wallet'

const graph_url = 'https://api.thegraph.com/subgraphs/name/0xcap/capv3';

export async function getUserTrades() {

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
				    first:100,
				    where: {owner: "${_address}"}
				  ) {
				    id,
				    txHash,
				    positionId,
				    productId,
				    margin,
				    leverage,
				    amount,
				    entryPrice,
				    closePrice,
				    isLong,
				    pnl,
				    pnlIsNegative,
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
	return formatTrades(json.data && json.data.trades);
}