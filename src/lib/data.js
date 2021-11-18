import { get } from 'svelte/store'

import { selectProduct, selectCurrency, getPoolInfo, getCapPoolInfo } from './methods'
import { getUserOrders, getUserPositions } from './graph'
 
import { currentPage } from './stores'

// Fetchs appropriate data from contracts and APIs. Called on route or signer change
export function hydrateData() {

	const _currentPage = get(currentPage);

	//console.log('hydrateData', _currentPage);

	if (!_currentPage || _currentPage == 'home') {
		//selectProduct();
	} else if (_currentPage == 'trade') {
		selectProduct();
		selectCurrency();
		getUserOrders();
		getUserPositions();
	} else if (_currentPage == 'pool') {
		getPoolInfo('weth');
		getPoolInfo('usdc');
		getCapPoolInfo();
	}

}