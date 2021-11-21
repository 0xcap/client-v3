const graph_url = 'https://api.thegraph.com/subgraphs/name/0xcap/capv1';

export async function getV1PositionIDs(owner) {
	if (!owner) return;
	const response = await fetch(graph_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `
				query {
					positions(where: {owner: "${owner}"}) {
						id
					}
				}
			`
		})
	});
	const json = await response.json();
	let ids = json.data.positions.map((x) => {return x.id});
	return ids;
}

export async function getV1StakeIDs(owner) {
	if (!owner) return;
	const response = await fetch(graph_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `
				query {
					stakes(where: {owner: "${owner}"}) {
						id
					}
				}
			`
		})
	});
	const json = await response.json();
	let ids = json.data.stakes.map((x) => {return x.id});
	return ids;
}
