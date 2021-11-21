import { derived } from 'svelte/store'

import { v1PositionIDs, v1StakeIDs } from './v1/stores';
import { v2PositionIDs } from './v2/stores';

export const legacyPositions = derived([v1PositionIDs, v1StakeIDs, v2PositionIDs], async ([$v1PositionIDs, $v1StakeIDs, $v2PositionIDs], set) => {
	const results = [];

	if ($v1PositionIDs.length) {
		results.push({
			message: 'Open V1 positions:',
			href: 'https://v1.cap.finance/#/trade',
		});
	}

	if ($v1StakeIDs.length) {
		results.push({
			message: 'Staked V1 ETH:',
			href: 'https://v1.cap.finance/#/vault',
		});
	}

	if ($v2PositionIDs.length) {
		results.push({
			message: 'Open V2 positions:',
			href: 'https://v2.cap.finance/#/trade',
		});
	}

	set(results);
});
