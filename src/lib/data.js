import { get } from 'svelte/store'

import { selectProduct, selectCurrency, getPoolInfo, getCapPoolInfo } from './methods'
import { getUserOrders, getUserPositions, getPoolStats } from './graph'
 
import { currentPage } from './stores'

// Fetchs appropriate data from contracts and APIs. Called on route or signer change
export function hydrateData() {

	const _currentPage = get(currentPage);

	// console.log('hydrateData', _currentPage);

	if (_currentPage == 'trade') {
		selectProduct();
		selectCurrency();
		getUserOrders();
		getUserPositions();
	} else if (_currentPage == 'pool') {
		getPoolInfo('weth');
		getPoolInfo('usdc');
		getPoolStats('weth');
		getPoolStats('usdc');
		getCapPoolInfo();
	}

}