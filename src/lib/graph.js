// Subgraph interaction
import { get } from 'svelte/store'

import { formatUnits, formatTrades } from '../utils/helpers'
import { history } from '../stores/history'
import { address } from '../stores/wallet'

const graph_url = 'https://api.thegraph.com/subgraphs/name/0xcap/capv3';

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
	history.set(formatTrades(json.data && json.data.trades));
}