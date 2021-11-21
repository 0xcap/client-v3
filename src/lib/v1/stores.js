import { derived } from 'svelte/store'

import { getV1PositionIDs, getV1StakeIDs } from './graph'

import { CHECK_V1_POSITIONS } from '../constants';
import { address } from '../stores';

export const v1PositionIDs = derived(address, async ($address, set) => {
	if (!CHECK_V1_POSITIONS || !$address) {
		set([]);
		return;
	}

	set(await getV1PositionIDs($address));
},[]);

export const v1StakeIDs = derived(address, async ($address, set) => {
	if (!CHECK_V1_POSITIONS || !$address) {
		set([]);
		return;
	}

	set(await getV1StakeIDs($address));
},[]);
