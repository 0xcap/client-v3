import { derived } from 'svelte/store'

import { getV2PositionIDs } from './graph'

import { CHECK_V2_POSITIONS } from '../constants';
import { address } from '../stores'

export const v2PositionIDs = derived(address, async ($address, set) => {
	if (!CHECK_V2_POSITIONS || !$address) {
		set([]);
		return;
	}

	set(await getV2PositionIDs($address));
},[]);
